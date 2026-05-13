"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type BeforeAfterProps = {
  before: string;
  after: string;
};

export function BeforeAfter({ before, after }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);

  const clipStyle = useMemo(
    () => ({
      clipPath: `inset(0 ${100 - position}% 0 0)`,
    }),
    [position]
  );

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[40px] border border-stone bg-white">
      <Image
        src={before}
        alt="Original image"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0" style={clipStyle}>
        <Image
          src={after}
          alt="AI try-on"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center">
        <input
          aria-label="Before and after slider"
          type="range"
          min={10}
          max={90}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="w-3/4 accent-[#8C9A84]"
        />
      </div>
      <div
        className="absolute top-0 h-full w-[2px] bg-white/60"
        style={{ left: `calc(${position}% - 1px)` }}
      />
    </div>
  );
}
