// Sample career profiles used to guide assessments and power demo mode.
export type CareerProfile = {
  id: string;
  title: string;
  summary: string;
  requiredSkills: { name: string; level: number }[];
};

export const CAREERS: CareerProfile[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    summary: "Builds fast, accessible user interfaces for the web.",
    requiredSkills: [
      { name: "HTML & CSS", level: 4 },
      { name: "JavaScript", level: 4 },
      { name: "TypeScript", level: 3 },
      { name: "React", level: 4 },
      { name: "Git", level: 3 },
      { name: "Testing", level: 3 },
      { name: "Accessibility", level: 3 },
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    summary: "Turns raw data into decisions using SQL, stats and dashboards.",
    requiredSkills: [
      { name: "SQL", level: 4 },
      { name: "Excel", level: 4 },
      { name: "Python", level: 3 },
      { name: "Statistics", level: 3 },
      { name: "Data Visualization", level: 4 },
      { name: "Communication", level: 3 },
    ],
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    summary: "Designs, trains and ships machine learning models to production.",
    requiredSkills: [
      { name: "Python", level: 5 },
      { name: "Linear Algebra", level: 3 },
      { name: "Machine Learning", level: 4 },
      { name: "Deep Learning", level: 3 },
      { name: "SQL", level: 3 },
      { name: "MLOps", level: 3 },
    ],
  },
  {
    id: "backend",
    title: "Backend Developer",
    summary: "Builds APIs, databases and the services behind apps.",
    requiredSkills: [
      { name: "Node.js or Python", level: 4 },
      { name: "SQL", level: 4 },
      { name: "API Design", level: 4 },
      { name: "Git", level: 3 },
      { name: "Cloud & Docker", level: 3 },
      { name: "System Design", level: 3 },
    ],
  },
  {
    id: "ux-designer",
    title: "UX / Product Designer",
    summary: "Researches users and designs intuitive product experiences.",
    requiredSkills: [
      { name: "User Research", level: 4 },
      { name: "Figma", level: 4 },
      { name: "Wireframing", level: 4 },
      { name: "Visual Design", level: 3 },
      { name: "Prototyping", level: 3 },
      { name: "Communication", level: 4 },
    ],
  },
];

export const findCareer = (title: string) =>
  CAREERS.find((c) => c.title.toLowerCase() === title.toLowerCase());

export type SkillEntry = { name: string; level: number };

export type Plan = {
  summary: string;
  readiness: number;
  strengths: string[];
  gaps: { skill: string; current: number; required: number; priority: "high" | "medium" | "low"; note: string }[];
  milestones: {
    id: string;
    title: string;
    weeks: number;
    description: string;
    topics: { id: string; title: string; hours: number }[];
    project: string;
  }[];
  resources: { title: string; type: "course" | "tutorial" | "docs" | "project" | "video"; url: string; skill: string }[];
  careerPaths: { title: string; match: number; reason: string }[];
};

// Demo-only illustrative data, clearly labelled as a sample in the UI.
export const DEMO = {
  targetRole: "Frontend Developer",
  skills: [
    { name: "HTML & CSS", level: 4 },
    { name: "JavaScript", level: 3 },
    { name: "React", level: 2 },
    { name: "Git", level: 2 },
  ],
  completed: ["m1-t1", "m1-t2"],
  plan: {
    summary: "Sample: solid foundations in HTML/CSS; focus next on TypeScript, React depth and testing.",
    readiness: 52,
    strengths: ["HTML & CSS", "JavaScript basics"],
    gaps: [
      { skill: "TypeScript", current: 0, required: 3, priority: "high", note: "Not yet started" },
      { skill: "React", current: 2, required: 4, priority: "high", note: "Learn hooks & state patterns" },
      { skill: "Testing", current: 0, required: 3, priority: "medium", note: "Start with Vitest" },
      { skill: "Accessibility", current: 1, required: 3, priority: "medium", note: "Learn ARIA & semantics" },
      { skill: "JavaScript", current: 3, required: 4, priority: "low", note: "Async & modules" },
      { skill: "Git", current: 2, required: 3, priority: "low", note: "Branching & PRs" },
    ],
    milestones: [
      {
        id: "m1", title: "Modern JavaScript & TypeScript", weeks: 3, description: "Strengthen JS and add types.",
        topics: [
          { id: "m1-t1", title: "Async/await & promises", hours: 6 },
          { id: "m1-t2", title: "ES modules", hours: 3 },
          { id: "m1-t3", title: "TypeScript fundamentals", hours: 10 },
        ],
        project: "Type a small utility library",
      },
      {
        id: "m2", title: "React in depth", weeks: 4, description: "Hooks, state and data fetching.",
        topics: [
          { id: "m2-t1", title: "Hooks & effects", hours: 8 },
          { id: "m2-t2", title: "State management", hours: 6 },
          { id: "m2-t3", title: "Data fetching", hours: 6 },
        ],
        project: "Build a movie search app",
      },
      {
        id: "m3", title: "Quality & accessibility", weeks: 2, description: "Ship reliable, inclusive UIs.",
        topics: [
          { id: "m3-t1", title: "Unit testing with Vitest", hours: 6 },
          { id: "m3-t2", title: "Accessibility audit", hours: 4 },
        ],
        project: "Add tests + a11y fixes to your app",
      },
    ],
    resources: [
      { title: "TypeScript Handbook", type: "docs", url: "https://www.typescriptlang.org/docs/handbook/intro.html", skill: "TypeScript" },
      { title: "React.dev Learn", type: "tutorial", url: "https://react.dev/learn", skill: "React" },
      { title: "Vitest Guide", type: "docs", url: "https://vitest.dev/guide/", skill: "Testing" },
      { title: "web.dev Accessibility", type: "course", url: "https://web.dev/learn/accessibility", skill: "Accessibility" },
    ],
    careerPaths: [
      { title: "Frontend Developer", match: 52, reason: "Strong HTML/CSS base" },
      { title: "UX Engineer", match: 41, reason: "Visual skills + code" },
    ],
  } satisfies Plan,
};
