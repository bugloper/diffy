/** Options for text comparison */
export interface ComparisonOptions {
  /** Whether to ignore case when comparing texts */
  ignoreCase: boolean;
  /** Whether to ignore whitespace when comparing texts */
  ignoreWhitespace: boolean;
  /** The mode to use for comparison */
  compareMode: 'character' | 'word' | 'line';
}

/** Result of text comparison */
export interface ComparisonResult {
  /** Indices of highlighted characters in the left text */
  leftHighlights: number[];
  /** Indices of highlighted characters in the right text */
  rightHighlights: number[];
  /** Statistics for the left text */
  leftStats: TextStats;
  /** Statistics for the right text */
  rightStats: TextStats;
  /** Percentage of difference between texts */
  diffPercentage: number;
}

/** Statistics for a text */
export interface TextStats {
  /** Number of characters in the text */
  characters: number;
  /** Number of words in the text */
  words: number;
  /** Number of lines in the text */
  lines: number;
}