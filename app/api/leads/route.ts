import crypto from "crypto";
import { site } from "@/lib/site";
import { isAuthed, unauthorized } from "@/lib/db";
import { addLead, listLeads, type Lead } from "@/lib/leads";

export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Only http(s) links, so the admin list never renders a javascript: URL.
const safeUrl = (v: string) => {
  if (!v) return undefined;
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    return new URL(withScheme).protocol.startsWith("http") ? withScheme : undefined;
  } catch {
    return undefined;
  }
};

// Admin only: all leads, newest first.
export async function GET(req: Request) {
  if (!isAuthed(req)) return unauthorized();
  return Response.json(await listLeads());
}

// Public: the contact form posts here.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = str(body.name, 200);
  const email = str(body.email, 320);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log(`[leads] rejected: ${!name ? "missing name" : `invalid email "${email}"`}`);
    return Response.json({ error: !name ? "Please tell us your name." : "Please enter a valid email." }, { status: 400 });
  }

  const lead: Lead = {
    id: crypto.randomBytes(6).toString("hex"),
    createdAt: new Date().toISOString(),
    name,
    email,
    brand: str(body.brand, 200) || undefined,
    website: safeUrl(str(body.website, 500)),
    services: Array.isArray(body.services) ? body.services.map((s) => str(s, 100)).filter(Boolean).slice(0, 20) : [],
    timeline: str(body.timeline, 100) || undefined,
    message: str(body.message, 5000) || undefined,
  };
  try {
    await addLead(lead);
  } catch (e) {
    console.error("[leads] could not save", e);
    return Response.json({ error: "Sorry, we couldn't send that. Please try again in a minute." }, { status: 503 });
  }
  console.log(`[leads] saved ${lead.id} from ${lead.email}`);
  await notify(lead);
  return Response.json({ ok: true }, { status: 201 });
}

// Push a phone notification via ntfy. Set NTFY_TOPIC (and optionally NTFY_URL for a self-hosted server,
// NTFY_TOKEN for a protected topic). Never fails the request: the lead is already saved.
async function notify(l: Lead) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;
  const base = (process.env.NTFY_URL || "https://ntfy.sh").replace(/\/+$/, "");
  const audit = l.services.includes("Free audit");
  const body = [
    `${l.name} <${l.email}>${l.brand ? ` · ${l.brand}` : ""}`,
    l.website,
    l.services.length ? `Needs: ${l.services.join(", ")}` : "",
    l.timeline ? `When: ${l.timeline}` : "",
    l.message,
  ]
    .filter(Boolean)
    .join("\n");
  try {
    await fetch(`${base}/${encodeURIComponent(topic)}`, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
      headers: {
        // Header values must be ASCII, so the visitor's name stays in the body.
        Title: audit ? "New free audit request" : "New project enquiry",
        Tags: audit ? "mag" : "envelope",
        Priority: "high",
        Click: `${site.url}/admin`,
        ...(process.env.NTFY_TOKEN ? { Authorization: `Bearer ${process.env.NTFY_TOKEN}` } : {}),
      },
    });
  } catch (e) {
    console.error("ntfy notification failed", e);
  }
}
