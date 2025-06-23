export const isMobile = (userAgent: string): boolean => {
  return /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
  // return true;
};
// to use in server component: import { headers } from "next/headers";
// const userAgent = headers().get("user-agent") || "";
// const mobile = isMobile(userAgent);

// to use in client component:
// userAgent = navigator.userAgent || "";
// const mobile = isMobile(userAgent);
