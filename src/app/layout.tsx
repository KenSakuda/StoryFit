import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "行動変容促進アプリ『StoryFit』",
  description: "行動変容を促進するためのヘルスケアアプリ『StoryFit』です",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header className="header">
          <div className="logo">StoryFit</div>
          <nav className="nav">
            <button>今日</button>
            <button>行動</button>
            <button>目標</button>
            <button>設定</button>
          </nav>
        </header>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
