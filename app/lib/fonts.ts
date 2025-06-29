import localFont from "next/font/local";

export const contractica = localFont({
  src: [
    {
      path: "../fonts/tbccontractica-light-webfont.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/tbccontractica-book-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/tbccontractica-regular-webfont.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/tbccontractica-medium-webfont.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/tbccontractica-bold-webfont.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/tbccontractica-black-webfont.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
});
