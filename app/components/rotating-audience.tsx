"use client";

import { useEffect, useState } from "react";

const AUDIENCES = ["Managers", "Clients", "Sales", "Executives"] as const;

type RotatingAudienceProps = {
  className?: string;
};

export function RotatingAudience({ className = "" }: RotatingAudienceProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((current) => (current + 1) % AUDIENCES.length);
    }, 1800);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <span
      key={AUDIENCES[index]}
      className={`inline-block min-w-[14ch] text-left text-[#FF2D55] [animation:audienceSwap_320ms_ease-out] ${className}`}
    >
      for {AUDIENCES[index]}.
    </span>
  );
}
