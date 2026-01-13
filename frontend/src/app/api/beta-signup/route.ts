import { NextRequest, NextResponse } from "next/server";

// ============================================================
// BETA SIGNUP API ENDPOINT
// ============================================================
// 
// This endpoint collects beta signup data.
// 
// CONFIGURATION:
// To connect to your own external API, modify the EXTERNAL_API_URL below.
// Set it to your actual endpoint URL, or leave empty to just store locally.
//
// The data sent includes:
// - name: string (optional)
// - city: string (optional)  
// - email: string (required)
// - signedUpAt: ISO date string
//
// ============================================================

// TODO: Change this to your actual external API endpoint
const EXTERNAL_API_URL = process.env.BETA_SIGNUP_EXTERNAL_API || "";

interface BetaSignupData {
  name?: string;
  city?: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: BetaSignupData = await request.json();

    // Validate required fields
    if (!data.email || !data.email.includes("@")) {
      return NextResponse.json(
        { error: "Email válido requerido" },
        { status: 400 }
      );
    }

    const signupData = {
      name: data.name || "",
      city: data.city || "",
      email: data.email.toLowerCase().trim(),
      signedUpAt: new Date().toISOString(),
    };

    // If external API is configured, forward the request
    if (EXTERNAL_API_URL) {
      try {
        const externalResponse = await fetch(EXTERNAL_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        });

        if (!externalResponse.ok) {
          console.error("External API error:", await externalResponse.text());
          // Continue anyway to not lose the signup
        }
      } catch (externalError) {
        console.error("External API request failed:", externalError);
        // Continue anyway to not lose the signup
      }
    }

    // Log the signup (you can also save to a file or database here)
    console.log("Beta signup received:", signupData);

    return NextResponse.json({
      success: true,
      message: "¡Gracias por registrarte!",
    });

  } catch (error) {
    console.error("Beta signup error:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check API status
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "beta-signup",
    externalApiConfigured: !!EXTERNAL_API_URL,
  });
}
