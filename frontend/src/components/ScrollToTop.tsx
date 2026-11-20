import { useEffect } from "react";
import { useLocation } from "react-router";

// Scrolls to the top on page change, or to the element matching the URL hash (e.g. /services#wedding)
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
