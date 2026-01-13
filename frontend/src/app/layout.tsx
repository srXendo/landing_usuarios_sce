import type { Metadata } from "next";
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
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
