# Norchi - Logical Challenge System

A non-quiz logical challenge system that presents provocative statements to explore belief-based reasoning patterns and ideological traps. This is a proof-of-concept with emphasis on user flow, simple editing, and visual structure.

## 🎯 Features

### Player Interface

- **Question Cards**: Single question displayed center screen
- **Answer Options**: Two main answers left/right, optional third "Challenge" option below
- **Navigation**: Click answers to progress through the flow
- **Loop Logic**: "Challenge" answers can loop back to same question
- **End States**: Reach conclusion screens with restart option
- **Progress Tracking**: Visual step counter

### Admin Interface

- **Node Management**: Create, edit, delete question and end nodes
- **Drag & Drop Reordering**: Reorder answer options with drag-and-drop or arrow buttons
- **Graph Visualization**: Interactive flow chart showing node connections and structure
- **Data Export/Import**: Save and load flows as JSON files
- **Real-time Preview**: Test flow directly from admin interface

### Technical Features

- **LocalStorage Persistence**: All data stored in browser localStorage
- **Modular Storage Layer**: Easy to swap storage for API calls later
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Data Model

### Question Node

```json
{
  "id": "q1",
  "type": "question",
  "text": "Do you think military service should be mandatory?",
  "options": [
    { "label": "Yes", "nextNodeId": "q2" },
    { "label": "No", "nextNodeId": "q3" },
    { "label": "Challenge", "nextNodeId": "q1" }
  ]
}
```

### End Node

```json
{
  "id": "end1",
  "type": "end",
  "text": "You believe in state authority over individual freedom."
}
```

### Flow Data

```json
{
  "startNodeId": "q1",
  "nodes": {
    "q1": {
      /* question node */
    },
    "end1": {
      /* end node */
    }
  }
}
```

## 🛠️ Architecture

### Component Structure

```
app/
├── components/
│   ├── Player.tsx          # Main game interface
│   ├── QuestionCard.tsx    # Individual question display
│   ├── EndCard.tsx         # Conclusion screens
│   ├── Admin.tsx           # Admin panel with tabs
│   ├── NodeList.tsx        # List of all nodes
│   ├── NodeEditor.tsx      # Edit individual nodes
│   └── FlowGraph.tsx       # React Flow visualization
├── lib/
│   └── storage.ts          # LocalStorage utilities
├── types.ts                # TypeScript definitions
└── page.tsx                # Main app with view switching
```

### Storage Layer

The storage layer is designed to be easily replaceable. Currently uses localStorage:

```typescript
// Current localStorage implementation
export function saveFlowData(data: FlowData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFlowData(): FlowData | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}
```

**To swap for API storage:**

1. Update `app/lib/storage.ts` functions
2. Replace localStorage calls with API endpoints
3. Add error handling and loading states
4. Consider adding authentication if needed

Example API replacement:

```typescript
export async function saveFlowData(data: FlowData): Promise<void> {
  await fetch("/api/flows", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function loadFlowData(): Promise<FlowData | null> {
  const response = await fetch("/api/flows");
  return response.ok ? response.json() : null;
}
```

## 🎨 Design Philosophy

- **Not a Quiz**: No right/wrong answers, explores belief contradictions
- **Ideological Traps**: Users face implications of their choices
- **Dead Ends Welcome**: Loops and contradictions are features, not bugs
- **Challenge Options**: Soft loops that return to same question with potential pushback
- **Visual Clarity**: Simple, focused interface puts content first

## 🔧 Development

### Key Dependencies

- **Next.js 15**: React framework with app router
- **React Flow**: Interactive node graph visualization
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type safety and better DX

### Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## 🗺️ Roadmap

### Completed ✅

- [x] Basic player interface with question/answer flow
- [x] Admin panel for creating and editing nodes
- [x] LocalStorage persistence
- [x] Option reordering with drag-and-drop
- [x] Interactive graph visualization
- [x] Export/import functionality

### Future Enhancements 🔮

- [ ] Swipe-based interaction (left/right gestures)
- [ ] Animation and visual feedback
- [ ] Branching complexity with infocards
- [ ] Analytics and user journey tracking
- [ ] Multi-user support with authentication
- [ ] Advanced graph editing capabilities
- [ ] Custom styling themes

## 📝 License

This project is a proof-of-concept for educational purposes.

## 🤝 Contributing

This is currently a proof-of-concept. Feel free to fork and experiment with your own ideological challenge flows!
