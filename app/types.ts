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
  // Saved status for the current user (prevents N+1 queries)
  isSaved?: boolean;
}

export interface HotTopicsData {
  topics: Record<string, HotTopic>;
  tags: Record<string, Tag>;
}

// Centralized pagination types for hot topics
export interface HotTopicsPaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedHotTopicsResult {
  topics: HotTopic[];
  tags: Record<string, Tag>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
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

export interface Video {
  id: string;
  ytVideoId: string;
  title: string;
  type: string; // 'promise', 'roast', 'livestream', etc.
  status: string; // 'verified', 'pending'
  startTime?: number; // Start time in seconds (optional)
  endTime?: number; // End time in seconds (optional)
  upvoteCount: number;
  algorithmPoints: number;
  createdAt: string;
  updatedAt: string;
  // Computed fields
  totalUpvotes?: number; // upvoteCount + algorithmPoints
  hasUpvoted?: boolean; // Current user's upvote status
}

// Legacy interface for backward compatibility
export interface VideoPromise {
  id: string;
  ytVideoId: string;
  title: string;
  upvoteCount: number;
  algorithmPoints: number;
  createdAt: string;
  updatedAt: string;
  // Computed fields
  totalUpvotes?: number; // upvoteCount + algorithmPoints
  hasUpvoted?: boolean; // Current user's upvote status
}

export interface VideosData {
  videos: Record<string, Video>;
}

// Centralized pagination types for videos
export interface VideosPaginationParams {
  page?: number;
  limit?: number;
  type?: string; // Filter by video type
  status?: string; // Filter by video status
}

export interface PaginatedVideosResult {
  videos: Video[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Legacy interfaces for backward compatibility
export interface VideoPromisesData {
  videoPromises: Record<string, VideoPromise>;
}

// Centralized pagination types for video promises
export interface VideoPromisesPaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedVideoPromisesResult {
  videoPromises: VideoPromise[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
