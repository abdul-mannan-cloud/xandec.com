"use client";

import { useEffect } from "react";

export default function HomeScrollSnap() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("home-snap");
    return () => root.classList.remove("home-snap");
  }, []);

  return null;
}
