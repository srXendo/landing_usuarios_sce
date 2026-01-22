import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Events - Conecta, Juega, Compite",
  description: "La app para conectar jugadores, clubes y organizadores de ajedrez en el mundo real. Descubre torneos, partidas y eventos presenciales cerca de ti.",
  keywords: "ajedrez, chess, torneos, eventos, clubes, partidas, comunidad",
  openGraph: {
    title: "Chess Events - Conecta, Juega, Compite",
    description: "La app para conectar jugadores, clubes y organizadores de ajedrez en el mundo real.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  return (
    <html lang="es">
      <head>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
