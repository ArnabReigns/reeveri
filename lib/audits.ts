// Audits: public teardown + rebuild concepts for brands. Every figure here was measured by us on
// the date shown; keep it that way. Never add numbers we have not measured.

import { apiGet } from "./api";

export type Finding = {
  n: string;
  title: string;
  found: string;
  why: string;
  did: string;
};

export type Stat = {
  label: string;
  before: string;
  after: string;
  note?: string;
};

export type Audit = {
  slug: string;
  n: string;
  brand: string;
  wordmark: string;
  category: string;
  date: string;
  headline: [string, string];
  summary: string;
  lead: string;
  site: string;
  cover: { src: string; alt: string }[];
  logo: string;
  demo: { src: string; label: string };
  stats: Stat[];
  findings: Finding[];
  next: { title: string; line: string }[];
  notes: string[];
};

export const getAudits = () => apiGet<Audit[]>("/api/audits", []);

export async function getAudit(slug: string): Promise<Audit | undefined> {
  return (await getAudits()).find((a) => a.slug === slug);
}
