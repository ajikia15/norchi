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

export interface Tag {
  id: string;
  label: string; // Display name like "ეკონომიკა", "განათლება"
  emoji: string; // e.g. "💵"
  color: string; // Hex color for styling
  createdAt: string;
  updatedAt: string;
}

export interface HotTopic {
  id: string;
  tags: string[]; // Array of tag IDs
  title: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  // Computed/joined fields when tags are loaded
  tagData?: Tag[];
}

export interface HotTopicsData {
  topics: Record<string, HotTopic>;
  tags: Record<string, Tag>;
}

// Legacy interfaces - will be removed after migration
export interface HotcardCategory {
  id: string; // "economics", "education", etc.
  label: string; // Badge label like "ეკონომიკა", "განათლება"
  emoji: string; // e.g. "💵"
  createdAt: string;
  updatedAt: string;
}

// Legacy topical tags - will be removed after migration
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
