import type { FrameArtVariant } from "@/components/FrameArt";

export type Media = {
  type: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
};

export type Service = {
  n: string;
  title: string;
  line: string;
  description: string;
  art: FrameArtVariant;
};

export const services: Service[] = [
  {
    n: "02",
    title: "Social Media",
    line: "Channels run like publications.",
    description:
      "Platform strategy, content calendars, community management, and a voice that sounds like a person, not a press release.",
    art: "grid",
  },
  {
    n: "03",
    title: "Content & Creative",
    line: "Work that earns the second look.",
    description:
      "Campaign concepts, shoots, short-form video, design, and copy. Ideas first, then the craft to make them land.",
    art: "halftone",
  },
  {
    n: "04",
    title: "Performance Marketing",
    line: "Paid media with better creative.",
    description:
      "Paid social and search, testing plans, and creative iteration, tied to the numbers that matter to your business.",
    art: "bars",
  },
  {
    n: "05",
    title: "Website & Digital Experiences",
    line: "Sites that feel as good as they look.",
    description:
      "Websites, landing pages, and launch experiences designed and built to be fast, clear, and hard to forget.",
    art: "phone",
  },
  {
    n: "06",
    title: "Growth Strategy",
    line: "Connecting attention to revenue.",
    description:
      "Funnels, channel mix, and a steady rhythm of experiments to find what compounds, and cut what doesn't.",
    art: "stack",
  },
];

export type Project = {
  n: string;
  frame: string;
  title: string;
  category: string;
  description: string;
  year: string;
  art: FrameArtVariant;
  placeholder: boolean;
  href?: string;
  media?: Media;
};

// TODO(owner): replace each placeholder with a real project. Add `media` for an image/video and `href` for a case study.
export const projects: Project[] = [
  {
    n: "01",
    frame: "12A",
    title: "Brand Launch",
    category: "Brand identity · Launch campaign",
    description:
      "Placeholder for a launch story: a new brand taken from first idea to launch day.",
    year: "2026",
    art: "launch",
    placeholder: true,
  },
  {
    n: "02",
    frame: "19",
    title: "Social Campaign",
    category: "Social · Short-form video",
    description:
      "One sharp idea, a content system built around it, and a plan to make it travel across every feed.",
    year: "2026",
    art: "pov",
    placeholder: true,
  },
  {
    n: "03",
    frame: "24A",
    title: "Digital Experience",
    category: "Website · Interactive",
    description:
      "Placeholder for a digital build: a site or experience designed to be felt, not just visited.",
    year: "2026",
    art: "browser",
    placeholder: true,
  },
  {
    n: "04",
    frame: "31",
    title: "Growth Campaign",
    category: "Performance · Growth strategy",
    description:
      "Placeholder for a growth programme: the strategy, the creative testing, and what we learned.",
    year: "2026",
    art: "stairs",
    placeholder: true,
  },
];

export const steps = [
  {
    n: "01",
    title: "Understand",
    text: "We get to know the brand, the audience, the market, and the real problem, which is rarely the one in the brief.",
  },
  {
    n: "02",
    title: "Strategize",
    text: "We build the creative and growth direction: what to say, who to say it to, and where it will be noticed.",
  },
  {
    n: "03",
    title: "Create",
    text: "We turn the strategy into campaigns, content, experiences, and systems your team can keep using.",
  },
  {
    n: "04",
    title: "Launch",
    text: "We put the work in front of the right people, on the right channels, at the right moment.",
  },
  {
    n: "05",
    title: "Learn",
    text: "We look closely at what happened, keep what works, fix what doesn't, and go again.",
  },
];

export type ContentKind = "Reel" | "Post" | "Campaign concept" | "Short-form" | "Ad";

export type ContentItem = {
  kind: ContentKind;
  title: string;
  shape: "story" | "portrait" | "square" | "wide";
  art: FrameArtVariant;
  media?: Media;
};

// TODO(owner): replace concept frames with real posts, reels, and ads.
export const contentItems: ContentItem[] = [
  { kind: "Reel", title: "Day one, unfiltered", shape: "story", art: "pov" },
  { kind: "Post", title: "Carousel: the brief nobody writes", shape: "portrait", art: "carousel" },
  { kind: "Campaign concept", title: "Out of home: say less", shape: "wide", art: "signal" },
  { kind: "Short-form", title: "Fifteen-second hook test", shape: "story", art: "halftone" },
  { kind: "Post", title: "Launch teaser grid", shape: "square", art: "grid" },
  { kind: "Ad", title: "Static ad, three angles", shape: "portrait", art: "split" },
  { kind: "Reel", title: "Behind the shoot", shape: "story", art: "viewfinder" },
  { kind: "Campaign concept", title: "Product drop countdown", shape: "square", art: "countdown" },
];

export const faqs = [
  {
    q: "What does Reeveri do?",
    a: "We're a creative marketing agency. We help brands work out what to say, make the work that says it, and put it in front of the right people. That covers social media, content and creative, performance marketing, websites and digital experiences, and growth strategy.",
  },
  {
    q: "Who do you work with?",
    a: "Ambitious brands: startups, creators, and established companies that want to be noticed for the right reasons. The common thread is ambition, not size.",
  },
  {
    q: "Do you work with startups?",
    a: "Yes. Early on, every first impression counts, which is exactly when strategy and creative matter most. We shape the engagement around where you are right now.",
  },
  {
    q: "Do you handle both strategy and execution?",
    a: "Yes. Creative without strategy is decoration, and strategy without creativity is invisible, so we do both and carry the idea from plan to launch.",
  },
  {
    q: "How does a project start?",
    a: "Tell us about your brand and what you want to achieve. We'll have a conversation, ask a lot of questions, and come back with a proposed approach and scope.",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on scope, timeline, and what you need. Every project is quoted individually after that first conversation, so you only pay for work that moves you forward.",
  },
];
