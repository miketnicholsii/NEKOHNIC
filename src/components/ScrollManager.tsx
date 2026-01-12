import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType();
  const positionsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const key = location.key;
    const onScroll = () => {
      positionsRef.current.set(key, window.scrollY || window.pageYOffset || 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.key]);

  useEffect(() => {
    const key = location.key;

    if (navType === "POP") {
      const y = positionsRef.current.get(key);
      if (typeof y === "number") {
        window.scrollTo({ top: y, left: 0, behavior: "auto" });
        return;
      }
    }

    if (location.hash) {
      const id = decodeURIComponent(location.hash.replace("#", ""));
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search, location.hash, location.key, navType]);

  return null;
}
