"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useMotionValue } from "motion/react";

type CounterProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-40px",
  });

  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const controls = animate(motionValue, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        setDisplayValue(Math.round(value));
      },
    });

    return () => {
      controls.stop();
    };
  }, [duration, isInView, motionValue, to]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
