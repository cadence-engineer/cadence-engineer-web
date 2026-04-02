"use client";

import { startTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL_MS = 60_000;
const MAX_REFRESH_ATTEMPTS = 10;

type DailiesAutoRefreshProps = {
  enabled: boolean;
};

export function DailiesAutoRefresh({ enabled }: DailiesAutoRefreshProps) {
  const router = useRouter();
  const enabledRef = useRef(enabled);
  const refreshCountRef = useRef(0);

  useEffect(() => {
    enabledRef.current = enabled;

    if (!enabled) {
      refreshCountRef.current = 0;
    }
  }, [enabled]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (!enabledRef.current || refreshCountRef.current >= MAX_REFRESH_ATTEMPTS) {
        return;
      }

      refreshCountRef.current += 1;
      startTransition(() => {
        router.refresh();
      });
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [router]);

  return null;
}
