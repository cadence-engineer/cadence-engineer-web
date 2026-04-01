"use client";

import { useEffect } from "react";

export default function SessionExpiredPage() {
  useEffect(() => {
    window.location.replace("/");
  }, []);

  return null;
}
