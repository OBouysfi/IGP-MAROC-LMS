import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS IGP Maroc",
  description: "Plateforme d'apprentissage IGP Maroc",
  icons: {
    icon: '/images/logo_igp.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full text-[90%]">
      <body className="antialiased h-full m-0 p-0 overflow-hidden">
        {children}
      </body>
    </html>
  );
}