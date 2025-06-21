export interface AnswerOption {
  label: string;
  nextNodeId: string;
}

export interface QuestionNode {
  id: string;
  type: "question";
  text: string;
  options: AnswerOption[];
}

export interface EndNode {
  id: string;
  type: "end";
  text: string;
}

export interface CalloutNode {
  id: string;
  type: "callout";
  text: string;
  returnToNodeId: string; // Which node to return to after "Try Again"
  buttonLabel?: string; // Default: "Try Again"
}

export interface InfocardNode {
  id: string;
  type: "infocard";
  text: string;
  nextNodeId: string; // Where to go after "Continue"
  buttonLabel?: string; // Default: "Continue"
}

export type Node = QuestionNode | EndNode | CalloutNode | InfocardNode;

export interface FlowData {
  nodes: Record<string, Node>;
  startNodeId: string;
}

export interface Story {
  id: string;
  name: string;
  description?: string;
  flowData: FlowData;
  createdAt: string;
  updatedAt: string;
}

export interface StoriesData {
  stories: Record<string, Story>;
  currentStoryId: string; // Legacy field - kept for compatibility but no longer used
}

export interface PlayerState {
  currentNodeId: string;
  history: string[];
}

export interface HotcardCategory {
  id: string; // "economics", "education", etc.
  label: string; // Badge label like "ეკონომიკა", "განათლება"
  emoji: string; // e.g. "💵"
  createdAt: string;
  updatedAt: string;
}

// Hardcoded topical tags with styling
export type TopicalTag = "ragebait" | "popularDisinfo" | "latestHysteria";

export const TOPICAL_TAGS = {
  ragebait: {
    label: "ცხელ-ცხელი ბომბა",
    emoji: "💣",
    badgeVariant: "destructive" as const,
  },
  popularDisinfo: {
    label: "პოპულარული ტყუილი",
    emoji: "🚫",
    badgeVariant: "secondary" as const,
  },
  latestHysteria: {
    label: "შოკი-პიკი-პანიკა",
    emoji: "⚡",
    badgeVariant: "outline" as const,
  },
} as const;

export interface HotTopic {
  id: string;
  categoryId?: string; // References HotcardCategory.id (editable categories)
  category: string; // Keep for backward compatibility
  topicalTag?: TopicalTag | null; // Hardcoded topical styling
  title: string;
  answer: string;
  link?: string;
  // Computed/joined fields when category is loaded
  categoryData?: HotcardCategory;
}

export interface HotTopicsData {
  topics: Record<string, HotTopic>;
  categories: Record<string, HotcardCategory>;
}
