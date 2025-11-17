import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "StoryFit",
  description: "行動変容を促進するヘルスケアアプリです",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="appShell">
          <header className="topHeader" aria-label="アプリヘッダー">
            <Image
              src="/logo.png"
              alt="StoryFitロゴ"
              width={140}
              height={35}
              priority
            />
          </header>

          <main className="mainArea">{children}</main>

          <nav className="bottomNav" aria-label="メインナビゲーション">
            <Link href="/" className="tabItem" aria-label="今日">
              <span className="tabIcon">📅</span>
              <span className="tabLabel">今日</span>
            </Link>
            <Link href="/actions" className="tabItem" aria-label="行動">
              <span className="tabIcon">⚡️</span>
              <span className="tabLabel">行動</span>
            </Link>
            <Link href="/goals" className="tabItem" aria-label="目標">
              <span className="tabIcon">🎯</span>
              <span className="tabLabel">目標</span>
            </Link>
            <Link href="/settings" className="tabItem" aria-label="設定">
              <span className="tabIcon">⚙️</span>
              <span className="tabLabel">設定</span>
            </Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
