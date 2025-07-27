import React from 'react';

export interface HighlightMatch {
  text: string;
  isMatch: boolean;
}

export function highlightSearchText(
  text: string,
  searchQuery: string,
  caseSensitive = false
): HighlightMatch[] {
  if (!searchQuery.trim()) {
    return [{ text, isMatch: false }];
  }

  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(`(${escapeRegExp(searchQuery.trim())})`, flags);
  const parts = text.split(regex);

  return parts.map((part, index) => ({
    text: part,
    isMatch: regex.test(part),
  }));
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface HighlightedTextProps {
  text: string;
  searchQuery: string;
  caseSensitive?: boolean;
  highlightClassName?: string;
  className?: string;
}

export function HighlightedText({
  text,
  searchQuery,
  caseSensitive = false,
  highlightClassName = 'bg-yellow-200 dark:bg-yellow-700 px-1 py-0.5 rounded text-foreground font-medium',
  className = '',
}: HighlightedTextProps): React.ReactElement {
  const matches = highlightSearchText(text, searchQuery, caseSensitive);

  return React.createElement(
    'span',
    { className },
    ...matches.map((match, index) =>
      match.isMatch
        ? React.createElement(
            'mark',
            { key: index, className: highlightClassName },
            match.text
          )
        : match.text
    )
  );
}

export function getSearchMatchCount(text: string, searchQuery: string, caseSensitive = false): number {
  if (!searchQuery.trim()) return 0;
  
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(escapeRegExp(searchQuery.trim()), flags);
  const matches = text.match(regex);
  
  return matches ? matches.length : 0;
}

export function hasSearchMatch(text: string, searchQuery: string, caseSensitive = false): boolean {
  if (!searchQuery.trim()) return false;
  
  const searchText = caseSensitive ? text : text.toLowerCase();
  const query = caseSensitive ? searchQuery.trim() : searchQuery.trim().toLowerCase();
  
  return searchText.includes(query);
}