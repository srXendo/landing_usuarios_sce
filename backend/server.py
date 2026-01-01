from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class UserBase(BaseModel):
    email: EmailStr
    name: str
    user_type: str = "user"  # "user" or "club"
    skill_level: Optional[str] = None  # principiante/medio/avanzado
    city: Optional[str] = None
    bio: Optional[str] = None
    picture: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    user_type: str = "user"
    skill_level: Optional[str] = None
    city: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    user_id: str
    email: str
    name: str
    user_type: str
    skill_level: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    picture: Optional[str] = None
    created_at: Optional[str] = None
    chess_com_username: Optional[str] = None
    chess_com_rating: Optional[int] = None
    lichess_username: Optional[str] = None
    lichess_rating: Optional[int] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    skill_level: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    picture: Optional[str] = None
    chess_com_username: Optional[str] = None
    lichess_username: Optional[str] = None

class ChessAccountLink(BaseModel):
    platform: str  # "chess_com" or "lichess"
    username: str

class ChessRatingResponse(BaseModel):
    platform: str
    username: str
    rapid_rating: Optional[int] = None
    blitz_rating: Optional[int] = None
    bullet_rating: Optional[int] = None
    best_rating: Optional[int] = None
    skill_level: str  # Calculated: principiante/medio/avanzado

class EventBase(BaseModel):
    title: str
    description: str
    city: str
    address: str
    date: str  # ISO date string
    time: str
    event_type: str  # torneo/casual/entrenamiento/club
    skill_level: str  # principiante/medio/avanzado
    max_seats: int
    image_url: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    event_id: str
    organizer_id: str
    organizer_name: str
    organizer_type: str
    seats_taken: int = 0
    created_at: str

class AttendanceCreate(BaseModel):
    event_id: str

class AttendanceResponse(BaseModel):
    attendance_id: str
    user_id: str
    event_id: str
    status: str  # joined/pending
    created_at: str

class ClubMemberCreate(BaseModel):
    user_email: EmailStr
    skill_level: str

class ClubMemberResponse(BaseModel):
    member_id: str
    club_id: str
    user_id: str
    user_name: str
    user_email: str
    skill_level: str
    joined_at: str

class PostCreate(BaseModel):
    content: str

class PostResponse(BaseModel):
    post_id: str
    user_id: str
    user_name: str
    user_type: str
    content: str
    created_at: str

# ============ AUTH HELPERS ============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

async def get_current_user(request: Request) -> dict:
    """Get current user from session token cookie or Authorization header"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

async def get_optional_user(request: Request) -> Optional[dict]:
    """Get current user if authenticated, else None"""
    try:
        return await get_current_user(request)
    except HTTPException:
        return None

# ============ AUTH ENDPOINTS ============

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, response: Response):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "name": user_data.name,
        "user_type": user_data.user_type,
        "skill_level": user_data.skill_level,
        "city": user_data.city,
        "bio": None,
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    # Create session
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    return UserResponse(
        user_id=user_id,
        email=user_doc["email"],
        name=user_doc["name"],
        user_type=user_doc["user_type"],
        skill_level=user_doc.get("skill_level"),
        city=user_doc.get("city"),
        bio=user_doc.get("bio"),
        picture=user_doc.get("picture"),
        created_at=user_doc["created_at"]
    )

@api_router.post("/auth/login", response_model=UserResponse)
async def login(credentials: UserLogin, response: Response):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user["user_id"],
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    return UserResponse(
        user_id=user["user_id"],
        email=user["email"],
        name=user["name"],
        user_type=user["user_type"],
        skill_level=user.get("skill_level"),
        city=user.get("city"),
        bio=user.get("bio"),
        picture=user.get("picture"),
        created_at=user.get("created_at")
    )

@api_router.post("/auth/session")
async def process_google_session(request: Request, response: Response):
    """Process Google OAuth session from Emergent Auth"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    async with httpx.AsyncClient() as client_http:
        resp = await client_http.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
    
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session_id")
    
    google_data = resp.json()
    email = google_data["email"]
    name = google_data["name"]
    picture = google_data.get("picture")
    
    # Check if user exists
    user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "user_type": "user",
            "skill_level": None,
            "city": None,
            "bio": None,
            "picture": picture,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user)
    else:
        user_id = user["user_id"]
        # Update picture if changed
        if picture and picture != user.get("picture"):
            await db.users.update_one({"user_id": user_id}, {"$set": {"picture": picture}})
            user["picture"] = picture
    
    # Create session
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user["name"],
        "user_type": user["user_type"],
        "skill_level": user.get("skill_level"),
        "city": user.get("city"),
        "bio": user.get("bio"),
        "picture": user.get("picture"),
        "created_at": user.get("created_at")
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(
        user_id=user["user_id"],
        email=user["email"],
        name=user["name"],
        user_type=user["user_type"],
        skill_level=user.get("skill_level"),
        city=user.get("city"),
        bio=user.get("bio"),
        picture=user.get("picture"),
        created_at=user.get("created_at")
    )

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out"}

# ============ USER ENDPOINTS ============

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user)

@api_router.put("/users/me", response_model=UserResponse)
async def update_user(update_data: UserUpdate, user: dict = Depends(get_current_user)):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if update_dict:
        await db.users.update_one({"user_id": user["user_id"]}, {"$set": update_dict})
    
    updated_user = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0, "password_hash": 0})
    return UserResponse(**updated_user)

# ============ CLUB ENDPOINTS ============

@api_router.get("/clubs")
async def list_clubs(city: Optional[str] = None):
    query = {"user_type": "club"}
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    
    clubs = await db.users.find(query, {"_id": 0, "password_hash": 0}).to_list(100)
    
    # Add member count and event count for each club
    result = []
    for club in clubs:
        member_count = await db.club_members.count_documents({"club_id": club["user_id"]})
        event_count = await db.events.count_documents({"organizer_id": club["user_id"]})
        result.append({
            **club,
            "member_count": member_count,
            "event_count": event_count
        })
    
    return result

@api_router.get("/clubs/{club_id}")
async def get_club(club_id: str):
    club = await db.users.find_one({"user_id": club_id, "user_type": "club"}, {"_id": 0, "password_hash": 0})
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    
    members = await db.club_members.find({"club_id": club_id}, {"_id": 0}).to_list(100)
    events = await db.events.find({"organizer_id": club_id}, {"_id": 0}).sort("date", 1).to_list(20)
    
    return {
        **club,
        "members": members,
        "events": events,
        "member_count": len(members),
        "event_count": len(events)
    }

@api_router.post("/clubs/members", response_model=ClubMemberResponse)
async def add_club_member(member_data: ClubMemberCreate, user: dict = Depends(get_current_user)):
    if user["user_type"] != "club":
        raise HTTPException(status_code=403, detail="Only clubs can add members")
    
    target_user = await db.users.find_one({"email": member_data.user_email}, {"_id": 0})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found with this email")
    
    # Check if already member
    existing = await db.club_members.find_one({
        "club_id": user["user_id"],
        "user_id": target_user["user_id"]
    })
    if existing:
        raise HTTPException(status_code=400, detail="User is already a member")
    
    member_id = f"member_{uuid.uuid4().hex[:12]}"
    member_doc = {
        "member_id": member_id,
        "club_id": user["user_id"],
        "user_id": target_user["user_id"],
        "user_name": target_user["name"],
        "user_email": target_user["email"],
        "skill_level": member_data.skill_level,
        "joined_at": datetime.now(timezone.utc).isoformat()
    }
    await db.club_members.insert_one(member_doc)
    
    return ClubMemberResponse(**member_doc)

@api_router.delete("/clubs/members/{member_id}")
async def remove_club_member(member_id: str, user: dict = Depends(get_current_user)):
    if user["user_type"] != "club":
        raise HTTPException(status_code=403, detail="Only clubs can remove members")
    
    result = await db.club_members.delete_one({"member_id": member_id, "club_id": user["user_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    
    return {"message": "Member removed"}

# ============ EVENT ENDPOINTS ============

@api_router.get("/events")
async def list_events(
    city: Optional[str] = None,
    date_filter: Optional[str] = None,  # hoy/semana/mes
    skill_level: Optional[str] = None,
    event_type: Optional[str] = None
):
    query = {}
    
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    
    if skill_level:
        query["skill_level"] = skill_level
    
    if event_type:
        query["event_type"] = event_type
    
    if date_filter:
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        if date_filter == "hoy":
            query["date"] = {"$gte": today.isoformat()[:10], "$lt": (today + timedelta(days=1)).isoformat()[:10]}
        elif date_filter == "semana":
            query["date"] = {"$gte": today.isoformat()[:10], "$lt": (today + timedelta(days=7)).isoformat()[:10]}
        elif date_filter == "mes":
            query["date"] = {"$gte": today.isoformat()[:10], "$lt": (today + timedelta(days=30)).isoformat()[:10]}
    
    events = await db.events.find(query, {"_id": 0}).sort("date", 1).to_list(100)
    return events

@api_router.get("/events/{event_id}")
async def get_event(event_id: str, request: Request):
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if current user has joined
    user = await get_optional_user(request)
    user_joined = False
    if user:
        attendance = await db.attendance.find_one({
            "event_id": event_id,
            "user_id": user["user_id"]
        })
        user_joined = attendance is not None
    
    # Get attendees
    attendees = await db.attendance.find({"event_id": event_id}, {"_id": 0}).to_list(100)
    
    return {
        **event,
        "user_joined": user_joined,
        "attendees": attendees
    }

@api_router.post("/events", response_model=EventResponse)
async def create_event(event_data: EventCreate, user: dict = Depends(get_current_user)):
    event_id = f"event_{uuid.uuid4().hex[:12]}"
    event_doc = {
        "event_id": event_id,
        "organizer_id": user["user_id"],
        "organizer_name": user["name"],
        "organizer_type": user["user_type"],
        "title": event_data.title,
        "description": event_data.description,
        "city": event_data.city,
        "address": event_data.address,
        "date": event_data.date,
        "time": event_data.time,
        "event_type": event_data.event_type,
        "skill_level": event_data.skill_level,
        "max_seats": event_data.max_seats,
        "seats_taken": 0,
        "image_url": event_data.image_url or "https://images.unsplash.com/photo-1743686749360-712a3bfb19f0?w=800",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.events.insert_one(event_doc)
    
    return EventResponse(**event_doc)

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, user: dict = Depends(get_current_user)):
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event["organizer_id"] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.events.delete_one({"event_id": event_id})
    await db.attendance.delete_many({"event_id": event_id})
    
    return {"message": "Event deleted"}

# ============ ATTENDANCE ENDPOINTS ============

@api_router.post("/events/{event_id}/join")
async def join_event(event_id: str, user: dict = Depends(get_current_user)):
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event["seats_taken"] >= event["max_seats"]:
        raise HTTPException(status_code=400, detail="Event is full")
    
    # Check if already joined
    existing = await db.attendance.find_one({
        "event_id": event_id,
        "user_id": user["user_id"]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already joined this event")
    
    attendance_id = f"att_{uuid.uuid4().hex[:12]}"
    attendance_doc = {
        "attendance_id": attendance_id,
        "user_id": user["user_id"],
        "user_name": user["name"],
        "event_id": event_id,
        "status": "joined",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.attendance.insert_one(attendance_doc)
    
    # Increment seats taken
    await db.events.update_one(
        {"event_id": event_id},
        {"$inc": {"seats_taken": 1}}
    )
    
    return {"message": "Joined successfully", "attendance_id": attendance_id}

@api_router.delete("/events/{event_id}/leave")
async def leave_event(event_id: str, user: dict = Depends(get_current_user)):
    result = await db.attendance.delete_one({
        "event_id": event_id,
        "user_id": user["user_id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not joined this event")
    
    # Decrement seats taken
    await db.events.update_one(
        {"event_id": event_id},
        {"$inc": {"seats_taken": -1}}
    )
    
    return {"message": "Left event successfully"}

@api_router.get("/me/events")
async def get_my_events(user: dict = Depends(get_current_user)):
    # Events I organized
    organized = await db.events.find(
        {"organizer_id": user["user_id"]},
        {"_id": 0}
    ).sort("date", 1).to_list(100)
    
    # Events I joined
    attendances = await db.attendance.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).to_list(100)
    
    event_ids = [a["event_id"] for a in attendances]
    joined = await db.events.find(
        {"event_id": {"$in": event_ids}},
        {"_id": 0}
    ).sort("date", 1).to_list(100)
    
    return {
        "organized": organized,
        "joined": joined
    }

# ============ POST ENDPOINTS ============

@api_router.post("/posts", response_model=PostResponse)
async def create_post(post_data: PostCreate, user: dict = Depends(get_current_user)):
    post_id = f"post_{uuid.uuid4().hex[:12]}"
    post_doc = {
        "post_id": post_id,
        "user_id": user["user_id"],
        "user_name": user["name"],
        "user_type": user["user_type"],
        "content": post_data.content,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.posts.insert_one(post_doc)
    
    return PostResponse(**post_doc)

@api_router.get("/posts")
async def list_posts(user_id: Optional[str] = None):
    query = {}
    if user_id:
        query["user_id"] = user_id
    
    posts = await db.posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(50)
    return posts

# ============ SEED DATA ============

@api_router.post("/seed")
async def seed_data():
    # Check if already seeded
    existing = await db.events.count_documents({})
    if existing > 0:
        return {"message": "Data already seeded", "event_count": existing}
    
    # Create sample club
    club_id = f"user_{uuid.uuid4().hex[:12]}"
    club_doc = {
        "user_id": club_id,
        "email": "escacs.barcelona@example.com",
        "password_hash": hash_password("club123"),
        "name": "Club d'Escacs Barcelona",
        "user_type": "club",
        "skill_level": None,
        "city": "Barcelona",
        "bio": "El club de ajedrez más activo de Barcelona. Organizamos torneos semanales y clases para todos los niveles.",
        "picture": "https://images.unsplash.com/photo-1763461092785-816bddca2ee1?w=400",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(club_doc)
    
    # Create another club
    club2_id = f"user_{uuid.uuid4().hex[:12]}"
    club2_doc = {
        "user_id": club2_id,
        "email": "escacs.sabadell@example.com",
        "password_hash": hash_password("club123"),
        "name": "Club Escacs Sabadell",
        "user_type": "club",
        "skill_level": None,
        "city": "Sabadell",
        "bio": "Club centenario de ajedrez en Sabadell. Formamos campeones desde 1920.",
        "picture": "https://images.unsplash.com/photo-1743354832606-e8cbf29e7c64?w=400",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(club2_doc)
    
    # Sample events
    events_data = [
        {
            "title": "Torneo Blitz Nocturno",
            "description": "Torneo de partidas rápidas de 5 minutos. Premios para los 3 primeros clasificados. Ambiente amigable y competitivo.",
            "city": "Barcelona",
            "address": "Carrer de la Portaferrissa, 22",
            "date": (datetime.now(timezone.utc) + timedelta(days=2)).strftime("%Y-%m-%d"),
            "time": "20:00",
            "event_type": "torneo",
            "skill_level": "avanzado",
            "max_seats": 16,
            "organizer_id": club_id,
            "organizer_name": "Club d'Escacs Barcelona",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1743686749360-712a3bfb19f0?w=800"
        },
        {
            "title": "Clase de Aperturas para Principiantes",
            "description": "Aprende las aperturas más sólidas para empezar tus partidas con ventaja. Ideal para jugadores que están comenzando.",
            "city": "Barcelona",
            "address": "Carrer de Balmes, 150",
            "date": (datetime.now(timezone.utc) + timedelta(days=3)).strftime("%Y-%m-%d"),
            "time": "18:00",
            "event_type": "entrenamiento",
            "skill_level": "principiante",
            "max_seats": 12,
            "organizer_id": club_id,
            "organizer_name": "Club d'Escacs Barcelona",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1683673940036-106de8a52705?w=800"
        },
        {
            "title": "Partidas Amistosas en el Parque",
            "description": "Ven a jugar partidas casuales en el Parc de la Ciutadella. Trae tu tablero o usa los nuestros.",
            "city": "Barcelona",
            "address": "Parc de la Ciutadella",
            "date": (datetime.now(timezone.utc) + timedelta(days=1)).strftime("%Y-%m-%d"),
            "time": "11:00",
            "event_type": "casual",
            "skill_level": "principiante",
            "max_seats": 20,
            "organizer_id": club_id,
            "organizer_name": "Club d'Escacs Barcelona",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1617740102894-b860db2b2012?w=800"
        },
        {
            "title": "Campeonato Social de Primavera",
            "description": "Nuestro torneo trimestral para todos los niveles. Sistema suizo a 5 rondas con ritmo de 15+10.",
            "city": "Barcelona",
            "address": "Carrer de Provença, 250",
            "date": (datetime.now(timezone.utc) + timedelta(days=7)).strftime("%Y-%m-%d"),
            "time": "10:00",
            "event_type": "torneo",
            "skill_level": "medio",
            "max_seats": 32,
            "organizer_id": club_id,
            "organizer_name": "Club d'Escacs Barcelona",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1699813555526-9fd23f91c7b3?w=800"
        },
        {
            "title": "Sesión de Análisis de Partidas",
            "description": "Analiza tus partidas con jugadores experimentados. Trae tus partidas en PGN o escritas.",
            "city": "Sabadell",
            "address": "Carrer de Gràcia, 15",
            "date": (datetime.now(timezone.utc) + timedelta(days=4)).strftime("%Y-%m-%d"),
            "time": "19:00",
            "event_type": "club",
            "skill_level": "medio",
            "max_seats": 8,
            "organizer_id": club2_id,
            "organizer_name": "Club Escacs Sabadell",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1741926677819-c7543a44d2f2?w=800"
        },
        {
            "title": "Torneo Juvenil Sub-18",
            "description": "Torneo exclusivo para jóvenes talentos menores de 18 años. Premios en material y libros de ajedrez.",
            "city": "Sabadell",
            "address": "Plaça del Sol, 5",
            "date": (datetime.now(timezone.utc) + timedelta(days=5)).strftime("%Y-%m-%d"),
            "time": "16:00",
            "event_type": "torneo",
            "skill_level": "principiante",
            "max_seats": 24,
            "organizer_id": club2_id,
            "organizer_name": "Club Escacs Sabadell",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1743686749360-712a3bfb19f0?w=800"
        },
        {
            "title": "Simultáneas con Maestro FIDE",
            "description": "Juega contra nuestro Maestro FIDE en una sesión de partidas simultáneas. ¡Intenta ganarle!",
            "city": "Terrassa",
            "address": "Carrer Major, 45",
            "date": (datetime.now(timezone.utc) + timedelta(days=6)).strftime("%Y-%m-%d"),
            "time": "17:00",
            "event_type": "entrenamiento",
            "skill_level": "avanzado",
            "max_seats": 15,
            "organizer_id": club2_id,
            "organizer_name": "Club Escacs Sabadell",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1683673940036-106de8a52705?w=800"
        },
        {
            "title": "Ajedrez y Café",
            "description": "Mañana de ajedrez casual con café incluido. Ambiente relajado para conocer otros jugadores.",
            "city": "Terrassa",
            "address": "Cafeteria El Peó, Rambla d'Ègara, 100",
            "date": (datetime.now(timezone.utc) + timedelta(days=2)).strftime("%Y-%m-%d"),
            "time": "10:30",
            "event_type": "casual",
            "skill_level": "principiante",
            "max_seats": 10,
            "organizer_id": club2_id,
            "organizer_name": "Club Escacs Sabadell",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1617740102894-b860db2b2012?w=800"
        },
        {
            "title": "Entrenamiento de Finales",
            "description": "Clase magistral sobre finales de torre. El final más común y más importante de dominar.",
            "city": "Barcelona",
            "address": "Carrer d'Aragó, 320",
            "date": (datetime.now(timezone.utc) + timedelta(days=8)).strftime("%Y-%m-%d"),
            "time": "19:30",
            "event_type": "entrenamiento",
            "skill_level": "medio",
            "max_seats": 15,
            "organizer_id": club_id,
            "organizer_name": "Club d'Escacs Barcelona",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1699813555526-9fd23f91c7b3?w=800"
        },
        {
            "title": "Liga Interclubes - Jornada 3",
            "description": "Tercera jornada de la liga entre clubes de la comarca. Ven a animar a tu equipo.",
            "city": "Sabadell",
            "address": "Polideportivo Municipal, Av. de la Concòrdia",
            "date": (datetime.now(timezone.utc) + timedelta(days=10)).strftime("%Y-%m-%d"),
            "time": "16:00",
            "event_type": "torneo",
            "skill_level": "avanzado",
            "max_seats": 40,
            "organizer_id": club2_id,
            "organizer_name": "Club Escacs Sabadell",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1743686749360-712a3bfb19f0?w=800"
        },
        {
            "title": "Introducción al Ajedrez 960",
            "description": "Aprende la variante Fischer Random (Ajedrez 960). ¡Posiciones iniciales aleatorias para más creatividad!",
            "city": "Barcelona",
            "address": "Carrer de Mallorca, 200",
            "date": (datetime.now(timezone.utc) + timedelta(days=9)).strftime("%Y-%m-%d"),
            "time": "18:30",
            "event_type": "casual",
            "skill_level": "medio",
            "max_seats": 12,
            "organizer_id": club_id,
            "organizer_name": "Club d'Escacs Barcelona",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1741926677819-c7543a44d2f2?w=800"
        },
        {
            "title": "Torneo Relámpago de Navidad",
            "description": "Torneo festivo con partidas de 3 minutos. Premios navideños y ambiente festivo.",
            "city": "Terrassa",
            "address": "Centre Cívic Can Aurell",
            "date": (datetime.now(timezone.utc) + timedelta(days=12)).strftime("%Y-%m-%d"),
            "time": "18:00",
            "event_type": "torneo",
            "skill_level": "principiante",
            "max_seats": 20,
            "organizer_id": club2_id,
            "organizer_name": "Club Escacs Sabadell",
            "organizer_type": "club",
            "image_url": "https://images.unsplash.com/photo-1683673940036-106de8a52705?w=800"
        }
    ]
    
    for event_data in events_data:
        event_id = f"event_{uuid.uuid4().hex[:12]}"
        event_doc = {
            "event_id": event_id,
            "seats_taken": 0,
            "created_at": datetime.now(timezone.utc).isoformat(),
            **event_data
        }
        await db.events.insert_one(event_doc)
    
    return {"message": "Seed data created", "event_count": len(events_data), "club_count": 2}

# ============ APP SETUP ============

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
