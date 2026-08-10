"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ParentDashboardChild } from "../types";

const STORAGE_KEY = "threed-parent-current-child";

type ChildContextValue = {
  child: ParentDashboardChild | null;
  children: ParentDashboardChild[];
  childId: string;
  setChildId: (id: string) => void;
};

const ChildContext = createContext<ChildContextValue | null>(null);

export function ChildProvider({
  linkedChildren,
  children,
}: {
  linkedChildren: ParentDashboardChild[];
  children: ReactNode;
}) {
  const [childId, setChildId] = useState(linkedChildren[0]?.id ?? "");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && linkedChildren.some((child) => child.id === saved))
      setChildId(saved);
  }, [linkedChildren]);

  useEffect(() => {
    if (childId) window.localStorage.setItem(STORAGE_KEY, childId);
  }, [childId]);

  const child = useMemo(
    () =>
      linkedChildren.find((item) => item.id === childId) ??
      linkedChildren[0] ??
      null,
    [childId, linkedChildren],
  );

  const value = useMemo(
    () => ({
      child,
      children: linkedChildren,
      childId: child?.id ?? "",
      setChildId,
    }),
    [child, linkedChildren],
  );

  return (
    <ChildContext.Provider value={value}>{children}</ChildContext.Provider>
  );
}

export function useChild() {
  const context = useContext(ChildContext);
  if (!context) throw new Error("useChild must be used within ChildProvider");
  return context;
}
