"use client";

import { useEffect, useState } from "react";

import DesktopNavbar from "./desktop/DesktopNavbar";
import DesktopTopNav from "./desktop/DesktopTopNav";
import MobileNavbar from "./mobile/MobileNavbar";

export default function NavbarShell() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div className="hidden lg:block">
        <DesktopTopNav isScrolled={isScrolled} />
        <DesktopNavbar isScrolled={isScrolled} />
      </div>
      <MobileNavbar />
    </div>
  );
}
