"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const PROJECT_ID = "z3ou7nplel";

// Microsoft Clarity session analytics. Runs once in the browser; the dashboard (/admin) is not recorded.
export function ClarityAnalytics() {
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;
    Clarity.init(PROJECT_ID);
  }, []);
  return null;
}
