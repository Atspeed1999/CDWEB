import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    title: "Gulfline Auto Spa | Premium Auto Detailing in Tampa",
    description: "Precision auto detailing, paint correction, and ceramic coating for Tampa Bay vehicles.",
    openGraph: {
      title: "Gulfline Auto Spa — Tampa’s finish, perfected.",
      description: "Premium vehicle care crafted for Gulf Coast sun, salt, and storms.",
      type: "website",
      images: [{ url: `${baseUrl}/og.png`, width: 1200, height: 630, alt: "Gulfline Auto Spa — Tampa’s finish, perfected." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Gulfline Auto Spa — Tampa’s finish, perfected.",
      description: "Premium vehicle care crafted for Gulf Coast sun, salt, and storms.",
      images: [`${baseUrl}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={sans.variable}>{children}</body>
    </html>
  );
}
