import requests
import sys
import json
from datetime import datetime

class SocialChessAPITester:
    def __init__(self, base_url="https://playmate-chess.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
            self.failed_tests.append({"test": name, "error": details})

    def test_seed_data(self):
        """Test seed data creation"""
        print("\n🌱 Testing seed data creation...")
        try:
            response = requests.post(f"{self.api_url}/seed")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Seed data creation", True, f"Created {data.get('event_count', 0)} events")
                return True
            else:
                self.log_test("Seed data creation", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Seed data creation", False, str(e))
            return False

    def test_events_listing(self):
        """Test events listing endpoint"""
        print("\n📅 Testing events listing...")
        try:
            response = requests.get(f"{self.api_url}/events")
            if response.status_code == 200:
                events = response.json()
                if len(events) >= 12:
                    self.log_test("Events listing", True, f"Found {len(events)} events")
                    return True
                else:
                    self.log_test("Events listing", False, f"Expected 12+ events, got {len(events)}")
                    return False
            else:
                self.log_test("Events listing", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Events listing", False, str(e))
            return False

    def test_event_filters(self):
        """Test event filtering"""
        print("\n🔍 Testing event filters...")
        filters = [
            ("city", "Barcelona"),
            ("skill_level", "principiante"),
            ("event_type", "torneo"),
            ("date_filter", "semana")
        ]
        
        all_passed = True
        for filter_name, filter_value in filters:
            try:
                response = requests.get(f"{self.api_url}/events?{filter_name}={filter_value}")
                if response.status_code == 200:
                    events = response.json()
                    self.log_test(f"Filter by {filter_name}", True, f"Found {len(events)} events")
                else:
                    self.log_test(f"Filter by {filter_name}", False, f"Status: {response.status_code}")
                    all_passed = False
            except Exception as e:
                self.log_test(f"Filter by {filter_name}", False, str(e))
                all_passed = False
        
        return all_passed

    def test_user_registration(self):
        """Test user registration"""
        print("\n👤 Testing user registration...")
        timestamp = datetime.now().strftime("%H%M%S")
        user_data = {
            "email": f"test_user_{timestamp}@example.com",
            "password": "testpass123",
            "name": f"Test User {timestamp}",
            "user_type": "user",
            "skill_level": "medio",
            "city": "Barcelona"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/auth/register",
                json=user_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                self.user_data = response.json()
                # Extract session token from cookies
                if 'Set-Cookie' in response.headers:
                    cookies = response.headers['Set-Cookie']
                    if 'session_token=' in cookies:
                        self.session_token = cookies.split('session_token=')[1].split(';')[0]
                
                self.log_test("User registration", True, f"User ID: {self.user_data.get('user_id')}")
                return True
            else:
                self.log_test("User registration", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("User registration", False, str(e))
            return False

    def test_user_login(self):
        """Test user login with registered credentials"""
        print("\n🔐 Testing user login...")
        if not self.user_data:
            self.log_test("User login", False, "No user data from registration")
            return False
        
        # Extract email from user_data for login
        login_data = {
            "email": self.user_data.get("email"),
            "password": "testpass123"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                login_result = response.json()
                # Update session token from login
                if 'Set-Cookie' in response.headers:
                    cookies = response.headers['Set-Cookie']
                    if 'session_token=' in cookies:
                        self.session_token = cookies.split('session_token=')[1].split(';')[0]
                
                self.log_test("User login", True, f"Logged in as: {login_result.get('name')}")
                return True
            else:
                self.log_test("User login", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("User login", False, str(e))
            return False

    def test_auth_me(self):
        """Test /auth/me endpoint"""
        print("\n🔍 Testing auth/me endpoint...")
        if not self.session_token:
            self.log_test("Auth me", False, "No session token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.session_token}"}
            response = requests.get(f"{self.api_url}/auth/me", headers=headers)
            
            if response.status_code == 200:
                user_info = response.json()
                self.log_test("Auth me", True, f"User: {user_info.get('name')}")
                return True
            else:
                self.log_test("Auth me", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Auth me", False, str(e))
            return False

    def test_event_detail_and_join(self):
        """Test event detail and join functionality"""
        print("\n🎯 Testing event detail and join...")
        
        # First get an event ID
        try:
            response = requests.get(f"{self.api_url}/events")
            if response.status_code != 200:
                self.log_test("Event detail", False, "Could not fetch events list")
                return False
            
            events = response.json()
            if not events:
                self.log_test("Event detail", False, "No events available")
                return False
            
            event_id = events[0]["event_id"]
            
            # Test event detail
            response = requests.get(f"{self.api_url}/events/{event_id}")
            if response.status_code == 200:
                event_detail = response.json()
                self.log_test("Event detail", True, f"Event: {event_detail.get('title')}")
            else:
                self.log_test("Event detail", False, f"Status: {response.status_code}")
                return False
            
            # Test join event (requires authentication)
            if self.session_token:
                headers = {"Authorization": f"Bearer {self.session_token}"}
                response = requests.post(f"{self.api_url}/events/{event_id}/join", headers=headers)
                if response.status_code == 200:
                    self.log_test("Join event", True, "Successfully joined event")
                    return True
                else:
                    self.log_test("Join event", False, f"Status: {response.status_code}, Response: {response.text}")
                    return False
            else:
                self.log_test("Join event", False, "No session token for authentication")
                return False
                
        except Exception as e:
            self.log_test("Event detail and join", False, str(e))
            return False

    def test_my_events(self):
        """Test my events endpoint"""
        print("\n📋 Testing my events...")
        if not self.session_token:
            self.log_test("My events", False, "No session token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.session_token}"}
            response = requests.get(f"{self.api_url}/me/events", headers=headers)
            
            if response.status_code == 200:
                my_events = response.json()
                joined_count = len(my_events.get("joined", []))
                organized_count = len(my_events.get("organized", []))
                self.log_test("My events", True, f"Joined: {joined_count}, Organized: {organized_count}")
                return True
            else:
                self.log_test("My events", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("My events", False, str(e))
            return False

    def test_create_event(self):
        """Test event creation"""
        print("\n➕ Testing event creation...")
        if not self.session_token:
            self.log_test("Create event", False, "No session token available")
            return False
        
        event_data = {
            "title": "Test Event",
            "description": "This is a test event created by automated testing",
            "city": "Barcelona",
            "address": "Test Address 123",
            "date": "2025-02-15",
            "time": "18:00",
            "event_type": "casual",
            "skill_level": "medio",
            "max_seats": 10
        }
        
        try:
            headers = {
                "Authorization": f"Bearer {self.session_token}",
                "Content-Type": "application/json"
            }
            response = requests.post(f"{self.api_url}/events", json=event_data, headers=headers)
            
            if response.status_code == 200:
                created_event = response.json()
                self.log_test("Create event", True, f"Event ID: {created_event.get('event_id')}")
                return True
            else:
                self.log_test("Create event", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Create event", False, str(e))
            return False

    def test_clubs_listing(self):
        """Test clubs listing"""
        print("\n🏛️ Testing clubs listing...")
        try:
            response = requests.get(f"{self.api_url}/clubs")
            if response.status_code == 200:
                clubs = response.json()
                self.log_test("Clubs listing", True, f"Found {len(clubs)} clubs")
                return True
            else:
                self.log_test("Clubs listing", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Clubs listing", False, str(e))
            return False

    def test_club_detail(self):
        """Test club detail"""
        print("\n🏛️ Testing club detail...")
        try:
            # First get clubs list
            response = requests.get(f"{self.api_url}/clubs")
            if response.status_code != 200:
                self.log_test("Club detail", False, "Could not fetch clubs list")
                return False
            
            clubs = response.json()
            if not clubs:
                self.log_test("Club detail", False, "No clubs available")
                return False
            
            club_id = clubs[0]["user_id"]
            
            # Test club detail
            response = requests.get(f"{self.api_url}/clubs/{club_id}")
            if response.status_code == 200:
                club_detail = response.json()
                self.log_test("Club detail", True, f"Club: {club_detail.get('name')}")
                return True
            else:
                self.log_test("Club detail", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Club detail", False, str(e))
            return False

    def test_user_profile(self):
        """Test user profile endpoints"""
        print("\n👤 Testing user profile...")
        if not self.user_data:
            self.log_test("User profile", False, "No user data available")
            return False
        
        user_id = self.user_data.get("user_id")
        
        try:
            # Test get user profile
            response = requests.get(f"{self.api_url}/users/{user_id}")
            if response.status_code == 200:
                profile = response.json()
                self.log_test("Get user profile", True, f"User: {profile.get('name')}")
            else:
                self.log_test("Get user profile", False, f"Status: {response.status_code}")
                return False
            
            # Test update profile (requires authentication)
            if self.session_token:
                update_data = {
                    "bio": "Updated bio from automated test",
                    "city": "Madrid"
                }
                headers = {
                    "Authorization": f"Bearer {self.session_token}",
                    "Content-Type": "application/json"
                }
                response = requests.put(f"{self.api_url}/users/me", json=update_data, headers=headers)
                if response.status_code == 200:
                    self.log_test("Update user profile", True, "Profile updated successfully")
                    return True
                else:
                    self.log_test("Update user profile", False, f"Status: {response.status_code}")
                    return False
            else:
                self.log_test("Update user profile", False, "No session token available")
                return False
                
        except Exception as e:
            self.log_test("User profile", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Social Chess Events Backend API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            self.test_seed_data,
            self.test_events_listing,
            self.test_event_filters,
            self.test_user_registration,
            self.test_user_login,
            self.test_auth_me,
            self.test_event_detail_and_join,
            self.test_my_events,
            self.test_create_event,
            self.test_clubs_listing,
            self.test_club_detail,
            self.test_user_profile
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ Test {test.__name__} failed with exception: {e}")
                self.failed_tests.append({"test": test.__name__, "error": str(e)})
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for failed in self.failed_tests:
                print(f"  - {failed['test']}: {failed['error']}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\n✨ Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = SocialChessAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())