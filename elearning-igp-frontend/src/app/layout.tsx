import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS IGP Maroc",
  description: "Plateforme d'apprentissage IGP Maroc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}