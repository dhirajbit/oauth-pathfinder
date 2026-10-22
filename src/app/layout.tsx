import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans({ variable: "--font-plex", subsets: ["latin"], weight: ["400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "OAuth Pathfinder",
  description: "How hard is it to get an OAuth app approved for this provider? Guides for 100+ apps, plus a live agent for any other.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plex.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <Link href="/" className="font-semibold tracking-tight text-ink flex items-center gap-2">
              <span className="blaze blaze-easy" aria-hidden />
              OAuth Pathfinder
            </Link>
            <nav className="flex items-center gap-4 sm:gap-5 text-sm text-muted whitespace-nowrap">
              <Link href="/#library" className="hover:text-ink">Library</Link>
              <Link href="/#generate" className="hover:text-ink">Generate</Link>
              <Link href="/about" className="hover:text-ink">How it works</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-sm text-muted flex flex-wrap gap-x-6 gap-y-2">
            <span>Guides describe provider policies as read on the dates shown. Providers change them; check the cited source before relying on a number.</span>
            <a className="hover:text-ink" href="https://docs.composio.dev/toolkits/managed-auth" target="_blank" rel="noreferrer">Composio managed-auth directory</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
