import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teacher's Bookshelf",
  description: "Персональный подбор курса английского языка по цели, уровню и формату занятий.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
