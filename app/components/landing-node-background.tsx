"use client";

import { NodeNetworkBackground } from "./node-network-bg";

export function LandingNodeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <NodeNetworkBackground />
      <div className="absolute inset-0 bg-white/55" />
    </div>
  );
}
