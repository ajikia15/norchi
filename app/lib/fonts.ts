import localFont from "next/font/local";

// FiraGO font family - using optimized webfonts
export const firaGO = localFont({
  src: [
    {
      path: "../../public/fonts/firago-thin-webfont.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/firago-light-webfont.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/firago-regular-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/firago-semibold-webfont.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/firago-bold-webfont.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-firago",
  display: "swap",
  preload: true,
});
