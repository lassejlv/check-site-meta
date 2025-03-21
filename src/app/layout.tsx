import type { Metadata, Viewport } from "next";
import { Geist_Mono, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "lazy-cn";
import { ThemeSwitcherDev } from "./theme-switch";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Check Site Meta",
  description: "Check the metadata of any site",
}
export const viewport: Viewport = {
  colorScheme: "light dark"
}

export default function RootLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <meta name="version" content={process.env['CSM_VERSION']} />
        <meta name="disable_analytics" content={process.env['DISABLE_ANALYTICS']} />
      </head>
      <body className={cn(
        sans.variable,
        mono.variable,
        `subpixel-antialiased bg-background`
      )}>
        {props.children}
      </body>
    </html>
  );
}

// Fonts -----------------------------

const sans = Plus_Jakarta_Sans({
  variable: "--font-pjs",
  subsets: ["latin"],
});
const mono = JetBrains_Mono({
  variable: "--font-gm",
  subsets: ["latin"],
});


// Scripts -----------------------------

function ThemeScript() {
  return (
    <script id="theme">{`const theme = localStorage.getItem('theme');
if (theme === null || !['light', 'dark', 'system'].includes(theme)) {
  localStorage.setItem('theme', 'system');
  document.documentElement.style.colorScheme = 'light dark';
} else {
  if (theme === 'system') {
    document.documentElement.style.colorScheme = 'light dark';
  } else {
    document.documentElement.style.colorScheme = theme;
  }
}`}</script>
  )
}

