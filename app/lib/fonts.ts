import localFont from "next/font/local";

export const contractica = localFont({
  src: [
    {
      path: "../../public/fonts/tbccontractica-light-webfont.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/tbccontractica-book-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/tbccontractica-regular-webfont.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/tbccontractica-medium-webfont.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/tbccontractica-bold-webfont.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/tbccontractica-black-webfont.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-contractica",
  display: "swap",
  preload: true,
});

export const contracticaCaps = localFont({
  src: [
    {
      path: "../../public/fonts/tbccontracticacaps-light-webfont.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/tbccontracticacaps-book-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/tbccontracticacaps-regular-webfont.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/tbccontracticacaps-medium-webfont.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/tbccontracticacaps-bold-webfont.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/tbccontracticacaps-black-webfont.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-contractica-caps",
  display: "swap",
  preload: true,
});
