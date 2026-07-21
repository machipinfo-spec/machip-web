"use client";

import { useEffect, useState } from "react";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600"] });

// Timeline: dot pops in ~300ms, blob blooms out beneath it ~180-930ms,
// shadow fades in ~450-850ms, text pops ~850-1250ms. Hold until HOLD_MS,
// then fade out over FADE_MS.
const HOLD_MS = 2000;
const FADE_MS = 380;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const hideTimer = setTimeout(() => setHiding(true), HOLD_MS);
    const removeTimer = setTimeout(() => setVisible(false), HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white ${
        hiding ? "splash-screen-out" : ""
      }`}
    >
      <div className="relative w-[130px] h-[146px]">
        <div className="splash-shadow absolute bottom-0 left-1/2 -ml-[38px] w-[76px] h-[11px] rounded-full bg-[#DEDAD3]" />
        <div className="absolute top-0 left-0 w-[130px] h-[130px]">
          <svg viewBox="0 -7 200 207" className="w-full h-full">
            <path
              className="splash-blob"
              d="M169.5 49 C172.5 62 174 74 173.5 88 C173 103 172 116 169 130 C164.5 152 155 168 141 178 C126 189 108 196.5 91 197 C71 197.5 52.5 190 40.5 177.5 C28.5 165 21 150 21 135 C21 119.5 27 104.5 34.5 93 C43.5 79.5 56.5 69.5 70.5 63.5 C84 58 98 55.5 110 54 C130 51.5 147.5 44.5 157.5 41 C163.5 39 167.5 43 169.5 49 Z"
              fill="#E8735F"
            />
            <circle className="splash-dot" cx="155" cy="14" r="16.5" fill="#E8735F" />
          </svg>
        </div>
      </div>
      <p
        className={`${quicksand.className} splash-text mt-4 text-[24px] leading-none tracking-wide text-[#4A4A4A]`}
      >
        Machip
      </p>
    </div>
  );
}
