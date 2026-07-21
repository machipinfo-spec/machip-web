"use client";

import { useEffect, useRef, useState } from "react";

// The splash video's motion finishes ~1.2s in and stays on the finished logo
// (the file itself runs 5s). Hold the logo a beat, then fade to the app.
const HOLD_MS = 2800;
const FADE_MS = 400;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
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
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white ${
        hiding ? "splash-screen-out" : ""
      }`}
    >
      <video
        ref={videoRef}
        src="/splash.mp4"
        autoPlay
        muted
        playsInline
        className="w-[min(78vw,340px)] h-[min(78vw,340px)] object-contain"
      />
    </div>
  );
}
