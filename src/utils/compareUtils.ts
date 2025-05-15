import { ComparisonOptions, ComparisonResult, TextStats } from '../types';

/**
 * Calculate text statistics including character count, word count, and line count
 * @param text - The input text to analyze
 * @returns TextStats object containing character, word, and line counts
 */
export function calculateStats(text: string): TextStats {
  const lines = text.split('\n').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const characters = text.length;

  return {
    characters,
    words,
    lines,
  };
}

/**
 * Normalize text based on comparison options
 * @param text - The input text to normalize
 * @param options - Comparison options including case and whitespace settings
 * @returns Normalized text string
 */
function normalizeText(text: string, options: ComparisonOptions): string {
  let normalized = text;
  
  if (options.ignoreCase) {
    normalized = normalized.toLowerCase();
  }
  
  if (options.ignoreWhitespace) {
    normalized = normalized.replace(/\s+/g, ' ').trim();
  }
  
  return normalized;
}

/**
 * Compare two texts character by character
 * @param left - The left text to compare
 * @param right - The right text to compare
 * @returns ComparisonResult containing highlights and statistics
 */
function compareCharacters(left: string, right: string): ComparisonResult {
  const leftHighlights: number[] = [];
  const rightHighlights: number[] = [];
  
  const maxLength = Math.max(left.length, right.length);
  const minLength = Math.min(left.length, right.length);
  
  // Compare characters up to the minimum length
  for (let i = 0; i < minLength; i++) {
    if (left[i] !== right[i]) {
      leftHighlights.push(i);
      rightHighlights.push(i);
    }
  }
  
  // Add remaining characters as differences
  for (let i = minLength; i < maxLength; i++) {
    if (i < left.length) leftHighlights.push(i);
    if (i < right.length) rightHighlights.push(i);
  }
  
  const leftStats = calculateStats(left);
  const rightStats = calculateStats(right);
  
  const totalChars = Math.max(left.length, right.length);
  const diffChars = Math.max(leftHighlights.length, rightHighlights.length);
  const diffPercentage = totalChars === 0 ? 0 : (diffChars / totalChars) * 100;
  
  return {
    leftHighlights,
    rightHighlights,
    leftStats,
    rightStats,
    diffPercentage,
  };
}

/**
 * Compare two texts word by word
 * @param left - The left text to compare
 * @param right - The right text to compare
 * @returns ComparisonResult containing highlights and statistics
 */
function compareWords(left: string, right: string): ComparisonResult {
  const leftWords = left.split(/(\s+)/);
  const rightWords = right.split(/(\s+)/);
  
  const leftHighlights: number[] = [];
  const rightHighlights: number[] = [];
  
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Create sets of unique words for faster lookup
  const leftWordSet = new Set(leftWords);
  const rightWordSet = new Set(rightWords);
  
  // Find words that are in one text but not the other
  const leftOnlyWords = new Set([...leftWordSet].filter(word => !rightWordSet.has(word)));
  const rightOnlyWords = new Set([...rightWordSet].filter(word => !leftWordSet.has(word)));
  
  // Mark differences in left text
  for (let i = 0; i < leftWords.length; i++) {
    const leftWord = leftWords[i];
    
    if (leftOnlyWords.has(leftWord)) {
      // Mark all characters in this word
      for (let j = 0; j < leftWord.length; j++) {
        leftHighlights.push(leftIndex + j);
      }
    }
    
    leftIndex += leftWord.length;
  }
  
  // Mark differences in right text
  for (let i = 0; i < rightWords.length; i++) {
    const rightWord = rightWords[i];
    
    if (rightOnlyWords.has(rightWord)) {
      // Mark all characters in this word
      for (let j = 0; j < rightWord.length; j++) {
        rightHighlights.push(rightIndex + j);
      }
    }
    
    rightIndex += rightWord.length;
  }
  
  const leftStats = calculateStats(left);
  const rightStats = calculateStats(right);
  
  const totalWords = Math.max(leftStats.words, rightStats.words);
  const diffWords = leftOnlyWords.size + rightOnlyWords.size;
  const diffPercentage = totalWords === 0 ? 0 : (diffWords / totalWords) * 100;
  
  return {
    leftHighlights,
    rightHighlights,
    leftStats,
    rightStats,
    diffPercentage,
  };
}

/**
 * Compare two texts line by line
 * @param left - The left text to compare
 * @param right - The right text to compare
 * @returns ComparisonResult containing highlights and statistics
 */
function compareLines(left: string, right: string): ComparisonResult {
  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  
  const leftHighlights: number[] = [];
  const rightHighlights: number[] = [];
  
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Create sets of unique lines for faster lookup
  const leftLineSet = new Set(leftLines);
  const rightLineSet = new Set(rightLines);
  
  // Find lines that are in one text but not the other
  const leftOnlyLines = new Set([...leftLineSet].filter(line => !rightLineSet.has(line)));
  const rightOnlyLines = new Set([...rightLineSet].filter(line => !leftLineSet.has(line)));
  
  // Mark differences in left text
  for (let i = 0; i < leftLines.length; i++) {
    const leftLine = leftLines[i];
    
    if (leftOnlyLines.has(leftLine)) {
      // Mark all characters in this line
      for (let j = 0; j < leftLine.length; j++) {
        leftHighlights.push(leftIndex + j);
      }
    }
    
    leftIndex += leftLine.length + 1; // +1 for the newline character
  }
  
  // Mark differences in right text
  for (let i = 0; i < rightLines.length; i++) {
    const rightLine = rightLines[i];
    
    if (rightOnlyLines.has(rightLine)) {
      // Mark all characters in this line
      for (let j = 0; j < rightLine.length; j++) {
        rightHighlights.push(rightIndex + j);
      }
    }
    
    rightIndex += rightLine.length + 1; // +1 for the newline character
  }
  
  const leftStats = calculateStats(left);
  const rightStats = calculateStats(right);
  
  const totalLines = Math.max(leftStats.lines, rightStats.lines);
  const diffLines = leftOnlyLines.size + rightOnlyLines.size;
  const diffPercentage = totalLines === 0 ? 0 : (diffLines / totalLines) * 100;
  
  return {
    leftHighlights,
    rightHighlights,
    leftStats,
    rightStats,
    diffPercentage,
  };
}

/**
 * Compare two texts based on the provided options
 * @param leftText - The left text to compare
 * @param rightText - The right text to compare
 * @param options - Comparison options including mode, case sensitivity, and whitespace settings
 * @returns ComparisonResult containing highlights and statistics
 */
export function compareTexts(
  leftText: string,
  rightText: string,
  options: ComparisonOptions
): ComparisonResult {
  const normalizedLeft = normalizeText(leftText, options);
  const normalizedRight = normalizeText(rightText, options);
  
  switch (options.compareMode) {
    case 'word':
      return compareWords(normalizedLeft, normalizedRight);
    case 'line':
      return compareLines(normalizedLeft, normalizedRight);
    case 'character':
    default:
      return compareCharacters(normalizedLeft, normalizedRight);
  }
}