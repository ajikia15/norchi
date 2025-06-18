# Swipeable Game Card UI Components

This module provides interactive swipeable card components for the Norchi ideological decision-tree game experience.

## Components

### 1. `GameCard` - Simple Version

**Location**: `app/components/GameCard.tsx`

A clean, minimalist card component with basic swipe functionality:

- **Features**: Basic drag-to-swipe, click-to-select, shake animation for challenges
- **Design**: Clean card layout with subtle animations
- **Performance**: Lightweight, minimal animations

### 2. `GameCardAnimated` - Enhanced Version

**Location**: `app/components/GameCardAnimated.tsx`

A feature-rich card component with sophisticated animations:

- **Features**: Enhanced enter/exit animations, card stacking effects, immersive backgrounds
- **Design**: Full-screen experience with decorative elements and smooth transitions
- **Performance**: More animation-heavy, premium feel

### 3. `GameDemo` - Switchable Demo

**Location**: `app/components/GameDemo.tsx`

A wrapper component that allows switching between both card versions:

- **Features**: Toggle button to switch between Simple and Enhanced modes
- **Use Case**: Perfect for testing both experiences or offering user preference

## Game Mechanics

### Swipe Interactions

- **Left Swipe**: Selects the first (left) answer option
- **Right Swipe**: Selects the second (right) answer option
- **Tap/Click**: Direct button selection for all options
- **Challenge Option**: Third option (if exists) triggers a "shake" animation and loops back

### Node Types Support

- **Question Nodes**: Interactive cards with 2-3 answer options
- **End Nodes**: Final conclusion cards (no interactions)
- **Callout Nodes**: Challenge/feedback cards with "Try Again" functionality
- **Info Cards**: Information display with "Continue" button

### Animation Features

- **Card Transitions**: Smooth enter/exit animations when moving between nodes
- **Swipe Feedback**: Visual feedback during drag interactions
- **Shake Animation**: For challenge/incorrect answers that loop back
- **Hover Effects**: Subtle scale and shadow effects on interactive elements

## Usage

### Basic Implementation

```tsx
import GameCard from "../components/GameCard";

<GameCard
  node={currentNode}
  onAnswer={handleAnswer}
  isTransitioning={isTransitioning}
/>;
```

### Enhanced Implementation

```tsx
import GameCardAnimated from "../components/GameCardAnimated";

<GameCardAnimated
  node={currentNode}
  onAnswer={handleAnswer}
  isTransitioning={isTransitioning}
  nodeHistory={history}
/>;
```

### Demo Implementation (Recommended)

```tsx
import GameDemo from "../components/GameDemo";

<GameDemo
  node={currentNode}
  onAnswer={handleAnswer}
  isTransitioning={isTransitioning}
  nodeHistory={history}
/>;
```

## Styling

### Design Philosophy

- **Card-Game Aesthetic**: Inspired by dating apps but adapted for ideological content
- **Georgian Context**: Tailored for libertarian political discussions
- **Modern UI**: Uses Tailwind CSS with custom gradients and glass-morphism effects

### Color Coding

- **Questions**: Blue gradients (primary interaction)
- **Endings**: Green gradients (completion)
- **Callouts**: Orange gradients (challenges/warnings)
- **Info Cards**: Purple gradients (information)

## Technical Notes

### Dependencies

- **Framer Motion**: For animations and gesture handling
- **Tailwind CSS**: For styling and responsive design
- **Lucide React**: For icons
- **Next.js 15**: SSR-compatible implementation

### Performance Considerations

- **Lazy Loading**: Animations only trigger when needed
- **Memory Efficient**: Proper cleanup of animation timers
- **Mobile Optimized**: Touch-friendly gesture thresholds

### Browser Support

- **Modern Browsers**: Full feature support
- **Mobile Devices**: Optimized touch gestures
- **Fallbacks**: Click interactions work when gestures aren't supported

## Future Enhancements

- Add sound effects for swipe interactions
- Implement card deck shuffling animations
- Add progress indicators for multi-step flows
- Include accessibility features (keyboard navigation)
- Add analytics tracking for interaction patterns
