"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OPEN_BEFORE_MS = 5 * 60 * 1000;

function sessionDateTimeMs(date: string, time: string) {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return new Date(`${date}T${normalizedTime}+01:00`).getTime();
}

type JoinState = "before" | "open" | "after" | "unavailable";

function getJoinState(
  sessionDate: string,
  startTime: string,
  endTime: string,
  status: string,
  nowMs: number,
): JoinState {
  if (status !== "scheduled") return "unavailable";

  const startMs = sessionDateTimeMs(sessionDate, startTime);
  const endMs = sessionDateTimeMs(sessionDate, endTime);

  if (nowMs < startMs - OPEN_BEFORE_MS) return "before";
  if (nowMs > endMs) return "after";
  return "open";
}

function getDisabledMessage(state: JoinState) {
  switch (state) {
    case "before":
      return "The meeting opens 5 minutes before the scheduled start time.";
    case "after":
      return "This meeting's join window has closed. You can no longer join this session.";
    case "unavailable":
      return "This session is not currently available to join.";
    default:
      return "";
  }
}

export function SessionJoinButton({
  sessionId,
  sessionDate,
  startTime,
  endTime,
  status,
  className,
  role = "teacher",
}: {
  sessionId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: string;
  className?: string;
  role?: "teacher" | "parent";
}) {
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    const updateNow = () => setNowMs(Date.now());
    updateNow();
    const interval = window.setInterval(updateNow, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const joinState = useMemo(
    () =>
      nowMs === null
        ? "unavailable"
        : getJoinState(sessionDate, startTime, endTime, status, nowMs),
    [endTime, nowMs, sessionDate, startTime, status],
  );

  if (joinState === "open") {
    return (
      <Button asChild className={className}>
        <a
          href={`/api/${role}/sessions/${encodeURIComponent(sessionId)}/join`}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink />
          Join meeting
        </a>
      </Button>
    );
  }

  const message = getDisabledMessage(joinState);

  return (
    <span
      className={cn("inline-flex", className)}
      onClick={() => toast.info(message)}
      title={message}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toast.info(message);
        }
      }}
      aria-label={message}
    >
      <Button type="button" disabled>
        <ExternalLink />
        Join meeting
      </Button>
    </span>
  );
}
