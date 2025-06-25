# Hot Questions URL-Based Filtering

This implementation uses URL search parameters to manage filtering state, making the application more shareable and performant.

## Features

- 🔗 **Shareable URLs**: All filter states are reflected in the URL
- ⚡ **Fast Performance**: Uses `useTransition` and `router.replace` for optimal performance
- 🎨 **Smooth UI**: Optimistic updates provide immediate visual feedback
- 📱 **Mobile Optimized**: Horizontal scrolling tags layout
- 🎯 **12 Items per Page**: 3 rows × 4 columns pagination layout

## URL Structure

```
/hot-questions?tags=economics&tags=education&tags=healthcare
```

- `tags`: Array of selected tag IDs (can have multiple values)

## Implementation Details

### Performance Optimizations

1. **useTransition**: Wraps URL updates to prevent blocking UI
2. **router.replace**: Avoids creating new history entries
3. **scroll: false**: Prevents unwanted page scrolling
4. **Debounced Updates**: URL changes are batched for performance
5. **Memoized Filtering**: Expensive filter operations are cached

### Key Components

- `HotQuestionsClient`: Main coordinator with URL state management
- `TagFilter`: Stateless UI component with optimistic updates
- `url-utils.ts`: Reusable URL manipulation utilities

### Browser Compatibility

- ✅ Modern browsers with URLSearchParams support
- ✅ Next.js 15 App Router
- ✅ React 19 features (`useTransition`, `useMemo`)

## Usage Examples

### Programmatic Filtering

```typescript
// Select economics and education tags
router.replace("/hot-questions?tags=economics&tags=education");

// Clear all filters
router.replace("/hot-questions");
```

### Sharing URLs

Users can copy the current URL to share their exact filter state with others.

## Best Practices Applied

1. **Shallow Routing**: Fast URL updates without full page reloads
2. **Optimistic Updates**: Immediate UI feedback while waiting for navigation
3. **State Coordination**: URL as single source of truth
4. **Clean URLs**: Empty parameters are removed automatically
5. **Type Safety**: Full TypeScript support with proper typing
