import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Epiroc | Operational Intelligence",
  description:
    "Operational intelligence dashboard + consulting solution simulation (black/yellow, mining-tech, executive)."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
