// Editable content of the /about page. Stored in db.json (edited from /admin); these defaults apply until then.

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  // e.g. "/uploads/…" from the dashboard, or a file in /public. Without one the card shows the initial.
  photo: string;
};

export type AboutContent = {
  hero: { headline: [string, string]; intro: string };
  story: { statement: string; paragraphs: string[] };
  beliefs: { title: string; text: string }[];
  team: TeamMember[];
  cta: { heading: string; text: string };
};

export const defaultAbout: AboutContent = {
  hero: {
    headline: ["Strategy and creative,", "in the same room."],
    intro:
      "Reeveri is a creative marketing agency for ambitious brands. We work out what to say, make the work that says it, and put it in front of the people who matter.",
  },
  story: {
    statement: "Creative without strategy is decoration. Strategy without creativity is invisible.",
    paragraphs: [
      "Good marketing used to be one thing done well. Now it takes five things done together (strategy, creative, content, technology and distribution), and most brands end up juggling them across different people who never meet.",
      "We put them in the same room, so the idea, the making and the getting-it-seen never lose track of each other. That is the whole company.",
    ],
  },
  beliefs: [
    {
      title: "Useful over loud",
      text: "Attention is easy to rent and hard to keep. We would rather make one thing people remember than ten they scroll past.",
    },
    {
      title: "Curious over certain",
      text: "The real problem is rarely the one in the brief. We ask a lot of questions before we make a single frame.",
    },
    {
      title: "Honest about what works",
      text: "We keep what performs, cut what does not, and tell you plainly which is which. No vanity numbers.",
    },
    {
      title: "Craft, shown not claimed",
      text: "Our own site, audits and work are the portfolio. If we say we can build it, there is usually something you can click.",
    },
  ],
  team: [
    { name: "Arnab Chatterjee", role: "", bio: "", photo: "" },
    { name: "Kinnori Bhattacharya", role: "", bio: "", photo: "/team/kinnori.jpg" },
  ],
  cta: {
    heading: "Let's make something worth noticing.",
    text: "Tell us about your brand. We will tell you what we would change, and show you.",
  },
};

// Fills any missing field from the defaults, so older or partial saves never break the page.
export function withAboutDefaults(saved: Partial<AboutContent> | undefined): AboutContent {
  const d = defaultAbout;
  return {
    hero: { ...d.hero, ...saved?.hero },
    story: { ...d.story, ...saved?.story },
    beliefs: saved?.beliefs ?? d.beliefs,
    team: saved?.team ?? d.team,
    cta: { ...d.cta, ...saved?.cta },
  };
}
