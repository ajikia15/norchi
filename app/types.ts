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
  currentStoryId: string;
}

export interface PlayerState {
  currentNodeId: string;
  history: string[];
}

export interface HotTopic {
  id: string;
  category: string;
  title: string;
  answer: string;
  link?: string;
}

export interface HotTopicsData {
  topics: Record<string, HotTopic>;
}
