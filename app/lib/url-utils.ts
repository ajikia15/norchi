/**
 * Utility functions for URL state management in Next.js 15
 * Optimized for performance and shareability
 */

export function createQueryString(
  searchParams: URLSearchParams,
  updates: Record<string, string | string[] | null>
): string {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    // Remove existing parameters with this key
    params.delete(key);

    if (value === null || value === undefined) {
      // Skip null/undefined values (effectively removes the parameter)
      return;
    }

    if (Array.isArray(value)) {
      // Add multiple values for the same key
      value.forEach((v) => params.append(key, v));
    } else {
      // Add single value
      params.set(key, value);
    }
  });

  return params.toString();
}

export function getTagsFromSearchParams(
  searchParams: URLSearchParams
): string[] {
  return searchParams.getAll("tags");
}

export function updateTagsInURL(
  searchParams: URLSearchParams,
  tags: string[]
): string {
  return createQueryString(searchParams, {
    tags: tags.length > 0 ? tags : null,
  });
}

/**
 * Parse URL search parameters for hot questions filtering
 */
export function parseHotQuestionsParams(searchParams: URLSearchParams) {
  return {
    tags: getTagsFromSearchParams(searchParams),
    // Add other params here as needed (e.g., search, sort, page)
  };
}

/**
 * Generate a shareable URL for hot questions with current filters
 */
export function generateShareableURL(baseURL: string, tags: string[]): string {
  if (tags.length === 0) {
    return baseURL;
  }

  const params = new URLSearchParams();
  tags.forEach((tag) => params.append("tags", tag));

  return `${baseURL}?${params.toString()}`;
}
