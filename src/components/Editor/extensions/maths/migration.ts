/**
 * Enhanced Math Migration Utility
 * 
 * Converts various LaTeX math delimiters to TipTap math nodes:
 * - \(...\) -> inline math
 * - \[...\] -> block math
 * - $...$ -> inline math (handled by migrateMathStrings)
 * - $$...$$ -> block math
 * 
 * This ensures compatibility with content from various sources that use
 * different LaTeX delimiter conventions.
 */

import type { Editor } from "@tiptap/react";

/**
 * Check if a position in HTML is inside an existing math node
 * Uses a simple approach: find all math nodes and check if position is within any
 * 
 * @param html - The HTML string
 * @param position - The position to check
 * @returns True if position is inside a math node
 */
function isInsideMathNode(html: string, position: number): boolean {
  // Find all inline math nodes
  const inlineMathRegex = /<span[^>]*data-type="inline-math"[^>]*>[\s\S]*?<\/span>/g;
  let match;
  while ((match = inlineMathRegex.exec(html)) !== null) {
    if (position >= match.index && position < match.index + match[0].length) {
      return true;
    }
  }
  
  // Find all block math nodes
  const blockMathRegex = /<div[^>]*data-type="block-math"[^>]*>[\s\S]*?<\/div>/g;
  while ((match = blockMathRegex.exec(html)) !== null) {
    if (position >= match.index && position < match.index + match[0].length) {
      return true;
    }
  }
  
  return false;
}

/**
 * Migrate LaTeX math expressions from various delimiter formats to TipTap math nodes
 * 
 * This function processes the editor's HTML content and converts:
 * - \(...\) -> inline math nodes
 * - \[...\] -> block math nodes
 * - $$...$$ -> block math nodes
 * 
 * NOTE: This should NOT process $...$ format as that's handled by migrateMathStrings
 * 
 * @param editor - The TipTap editor instance
 */
export function migrateAllMathFormats(editor: Editor): void {
  if (!editor) return;

  const html = editor.getHTML();
  if (!html) return;

  // Skip entirely if no unmigrated formats found
  const hasUnmigratedFormats = html.includes('\\(') || html.includes('\\[') || html.match(/\$\$[^$]+\$\$/);
  if (!hasUnmigratedFormats) {
    return;
  }

  // Collect all math matches with their positions and types
  interface MathMatch {
    start: number;
    end: number;
    latex: string;
    type: 'inline' | 'block';
    original: string;
  }

  const matches: MathMatch[] = [];

  // Find all \[...\] block math (only if not inside existing math nodes)
  const blockMathRegex = /\\\[([\s\S]*?)\\\]/g;
  let match;
  while ((match = blockMathRegex.exec(html)) !== null) {
    // Check if this match is inside an existing math node
    if (!isInsideMathNode(html, match.index)) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        latex: match[1].trim(),
        type: 'block',
        original: match[0],
      });
    }
  }

  // Find all $$...$$ block math (only if not inside existing math nodes)
  // But skip if it's a single $ (which is handled by migrateMathStrings)
  const doubleDollarBlockRegex = /\$\$([\s\S]*?)\$\$/g;
  while ((match = doubleDollarBlockRegex.exec(html)) !== null) {
    // Check if this match is inside an existing math node
    if (!isInsideMathNode(html, match.index)) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        latex: match[1].trim(),
        type: 'block',
        original: match[0],
      });
    }
  }

  // Find all \(...\) inline math (only if not inside existing math nodes)
  const inlineMathRegex = /\\\(([\s\S]*?)\\\)/g;
  while ((match = inlineMathRegex.exec(html)) !== null) {
    // Check if this match is inside an existing math node
    if (!isInsideMathNode(html, match.index)) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        latex: match[1].trim(),
        type: 'inline',
        original: match[0],
      });
    }
  }

  // If no matches found, return early
  if (matches.length === 0) {
    return;
  }

  // Sort matches by start position (descending) to replace from end to beginning
  // This ensures positions remain valid during replacement
  matches.sort((a, b) => b.start - a.start);

  // Replace matches from end to beginning
  let processed = html;
  for (const mathMatch of matches) {
    const escapedLatex = escapeHtmlForAttribute(mathMatch.latex);
    const replacement = mathMatch.type === 'block'
      ? `<div data-type="block-math" data-latex="${escapedLatex}"></div>`
      : `<span data-type="inline-math" data-latex="${escapedLatex}"></span>`;
    
    processed = processed.substring(0, mathMatch.start) + replacement + processed.substring(mathMatch.end);
  }

  // Only update if changes were made
  if (processed !== html) {
    try {
      // Use setContent with emitUpdate: false to avoid triggering update handlers
      // during migration
      editor.commands.setContent(processed, { emitUpdate: false });
    } catch (error) {
      console.warn("Error migrating math formats:", error);
    }
  }
}

/**
 * Process content string before it's loaded into the editor
 * This handles math delimiters in raw HTML strings
 * 
 * Converts:
 * - \(...\) -> inline math nodes
 * - \[...\] -> block math nodes
 * - $$...$$ -> block math nodes
 * 
 * NOTE: Does NOT process $...$ format as that's handled by TipTap's migrateMathStrings
 * 
 * @param content - The HTML content string
 * @returns Processed HTML with math delimiters converted
 */
export function preprocessMathContent(content: string): string {
  if (!content || typeof content !== "string") return content;

  // Skip processing if content already contains math nodes and no unmigrated formats
  const hasMathNodes = content.includes('data-type="inline-math"') || content.includes('data-type="block-math"');
  const hasUnmigratedFormats = content.includes('\\(') || content.includes('\\[') || content.match(/\$\$[^$]+\$\$/);
  
  if (hasMathNodes && !hasUnmigratedFormats) {
    return content;
  }

  // Collect all math matches with their positions and types
  interface MathMatch {
    start: number;
    end: number;
    latex: string;
    type: 'inline' | 'block';
    original: string;
  }

  const matches: MathMatch[] = [];

  // Find all \[...\] block math (only in plain text, not in HTML tags)
  const blockMathRegex = /\\\[([\s\S]*?)\\\]/g;
  let match;
  while ((match = blockMathRegex.exec(content)) !== null) {
    // Skip if inside HTML tags or existing math nodes
    const beforeMatch = content.substring(Math.max(0, match.index - 500), match.index);
    const isInTag = beforeMatch.match(/<[^>]*$/);
    const isInMathNode = beforeMatch.includes('data-type="block-math"') || 
                         beforeMatch.includes('data-type="inline-math"');
    
    if (!isInTag && !isInMathNode) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        latex: match[1].trim(),
        type: 'block',
        original: match[0],
      });
    }
  }

  // Find all $$...$$ block math (only in plain text, not in HTML tags)
  const doubleDollarBlockRegex = /\$\$([\s\S]*?)\$\$/g;
  while ((match = doubleDollarBlockRegex.exec(content)) !== null) {
    // Skip if inside HTML tags or existing math nodes
    const beforeMatch = content.substring(Math.max(0, match.index - 500), match.index);
    const isInTag = beforeMatch.match(/<[^>]*$/);
    const isInMathNode = beforeMatch.includes('data-type="block-math"') || 
                         beforeMatch.includes('data-type="inline-math"');
    
    if (!isInTag && !isInMathNode) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        latex: match[1].trim(),
        type: 'block',
        original: match[0],
      });
    }
  }

  // Find all \(...\) inline math (only in plain text, not in HTML tags)
  const inlineMathRegex = /\\\(([\s\S]*?)\\\)/g;
  while ((match = inlineMathRegex.exec(content)) !== null) {
    // Skip if inside HTML tags or existing math nodes
    const beforeMatch = content.substring(Math.max(0, match.index - 500), match.index);
    const isInTag = beforeMatch.match(/<[^>]*$/);
    const isInMathNode = beforeMatch.includes('data-type="block-math"') || 
                         beforeMatch.includes('data-type="inline-math"');
    
    if (!isInTag && !isInMathNode) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        latex: match[1].trim(),
        type: 'inline',
        original: match[0],
      });
    }
  }

  // If no matches found, return original content
  if (matches.length === 0) {
    return content;
  }

  // Sort matches by start position (descending) to replace from end to beginning
  // This ensures positions remain valid during replacement
  matches.sort((a, b) => b.start - a.start);

  // Replace matches from end to beginning
  let processed = content;
  for (const mathMatch of matches) {
    const escapedLatex = escapeHtmlForAttribute(mathMatch.latex);
    const replacement = mathMatch.type === 'block'
      ? `<div data-type="block-math" data-latex="${escapedLatex}"></div>`
      : `<span data-type="inline-math" data-latex="${escapedLatex}"></span>`;
    
    processed = processed.substring(0, mathMatch.start) + replacement + processed.substring(mathMatch.end);
  }

  return processed;
}

/**
 * Escape HTML for use in HTML attributes
 * 
 * @param text - The text to escape
 * @returns Escaped string safe for HTML attributes
 */
function escapeHtmlForAttribute(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
