export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "Full Stack" | "Frontend UI" | "AI / ML" | "DevOps" | "Mobile";
  tags: string[];
  featured: boolean;
  image: string;
  githubUrl: string;
  liveUrl: string;
  stars: number;
  metrics?: string;
  highlights: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  isCurrent: boolean;
  summary: string;
  achievements: string[];
  skillsUsed: string[];
}

export interface SkillCategory {
  categoryName: string;
  items: {
    name: string;
    level: number; // 0 - 100
    years: number;
    icon?: string;
    endorsements: number;
  }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  relationship: "Manager" | "Peer" | "Client";
}

export interface DeveloperProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  location: string;
  statusBadge: string;
  bio: string;
  aboutMe: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  stats: {
    yearsExperience: number;
    projectsCompleted: number;
    codeCommits: number;
    satisfactionRate: number;
  };
  skills: SkillCategory[];
  projects: Project[];
  experience: WorkExperience[];
  testimonials: Testimonial[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isFallback?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface TestMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "unread" | "read";
}
