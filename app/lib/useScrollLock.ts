import { useEffect, useRef } from "react";

/**
 * Custom hook to prevent body scroll when a modal or dialog is open
 * Works across all devices including mobile with proper scroll position restoration
 */
export function useScrollLock(isLocked: boolean) {
  const scrollPositionRef = useRef<number>(0);
  const originalStylesRef = useRef<{
    overflow: string;
    position: string;
    top: string;
    width: string;
    paddingRight: string;
  }>({
    overflow: "",
    position: "",
    top: "",
    width: "",
    paddingRight: "",
  });

  useEffect(() => {
    if (isLocked) {
      // Store current scroll position and original styles
      scrollPositionRef.current = window.pageYOffset;
      const body = document.body;

      originalStylesRef.current = {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        paddingRight: body.style.paddingRight,
      };

      // Calculate scrollbar width to prevent layout shift
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Apply scroll lock styles
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${scrollPositionRef.current}px`;
      body.style.width = "100%";

      // Compensate for scrollbar width
      if (scrollBarWidth > 0) {
        body.style.paddingRight = `${scrollBarWidth}px`;
      }

      // Prevent touch scrolling on mobile
      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };

      document.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });

      return () => {
        document.removeEventListener("touchmove", preventTouchMove);
      };
    } else {
      // Restore original styles
      const body = document.body;
      const original = originalStylesRef.current;

      body.style.overflow = original.overflow;
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.width = original.width;
      body.style.paddingRight = original.paddingRight;

      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [isLocked]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const body = document.body;
      const original = originalStylesRef.current;

      body.style.overflow = original.overflow;
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.width = original.width;
      body.style.paddingRight = original.paddingRight;
    };
  }, []);
}
