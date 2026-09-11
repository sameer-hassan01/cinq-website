import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

/** Display face. Variable, with the optical-size and width axes included so
    the wordmark can sit at opsz 96 / wdth 90 while UI labels stay at 14. */
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontClassNames = `${bricolage.variable} ${geist.variable} ${geistMono.variable}`;
