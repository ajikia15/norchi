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

- **Turso SQLite Database**: All data stored in production-ready SQLite database
- **Server Actions**: Modern Next.js 15 server-side operations
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
│   ├── StoryClient.tsx           # Story playing interface
│   ├── AdminClient.tsx           # Admin panel client component
│   ├── StoryManagerClient.tsx    # Story management interface
│   ├── HotQuestionsManagerClient.tsx # Hot questions management
│   ├── StoryEditClient.tsx       # Story editing interface
│   ├── NodeList.tsx              # Node list component
│   ├── NodeEditor.tsx            # Node editing component
│   ├── FlowGraph.tsx             # React Flow visualization
│   └── VisualEditor.tsx          # Visual flow editor
├── lib/
│   ├── storage.ts          # Database utilities
│   └── actions.ts          # Server actions for CRUD operations
├── types.ts                # TypeScript definitions
├── page.tsx                # Main homepage
├── admin/page.tsx          # Admin panel server component
├── story/[id]/page.tsx     # Story playing server component
└── story/edit/[id]/page.tsx # Story editing server component
```

### Database Architecture

Modern Next.js 15 architecture with Turso SQLite and server actions:

```typescript
// Server-side database operations
export async function loadStoriesData(): Promise<StoriesData> {
  const result = await db.select().from(stories);
  // Transform database results to application format
  return { stories: storiesMap, currentStoryId: "" };
}

// Server actions for all mutations
export async function createStory(formData: FormData) {
  await db.insert(stories).values({
    id: `story-${Date.now()}`,
    name: formData.get("name"),
    flowData: JSON.stringify({ startNodeId: "", nodes: {} }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/admin");
  return { success: true };
}
```

**Architecture Benefits:**

1. **Server Components**: Initial data loaded server-side for better performance
2. **Server Actions**: Type-safe mutations with automatic revalidation
3. **Client Components**: Used only where interactivity is needed
4. **Database-first**: No localStorage dependencies, production-ready persistence

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
- [x] Turso SQLite database with server actions
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
