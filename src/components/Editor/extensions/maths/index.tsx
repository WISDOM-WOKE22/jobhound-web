"use client";

import Math from "@tiptap/extension-mathematics";
import type { AnyExtension } from "@tiptap/core";

/**
 * Math Extension Configuration
 * 
 * This extension enables LaTeX math rendering in the editor using KaTeX.
 * It supports both inline math (e.g., $x^2 + y^2 = z^2$) and block math expressions.
 * 
 * Features:
 * - Inline math: Math expressions that appear within a line of text
 * - Block math: Math expressions displayed as separate blocks
 * - Click to edit: Click on any math expression to edit it
 * - LaTeX syntax: Full LaTeX support via KaTeX
 * 
 * Note: The onClick handlers are configured to work with the editor instance
 * that TipTap provides through the extension's view at runtime.
 */

// Store editor reference for onClick handlers
// This is set when the editor is created in the Editor component
let editorInstance: any = null;

export const MathsExtension = Math.configure({
  /**
   * Configuration for block-level math expressions
   * Block math appears as separate, centered blocks
   */
  blockOptions: {
    /**
     * Handler for when a block math node is clicked
     * Opens a prompt to edit the LaTeX expression
     * 
     * @param node - The math node that was clicked
     * @param pos - The position of the node in the document
     */
    onClick: (node: any, pos: number) => {
      const currentLatex = node.attrs.latex || "";
      const newCalculation = window.prompt("Enter new calculation:", currentLatex);
      
      if (newCalculation !== null && newCalculation.trim() && editorInstance) {
        editorInstance
          .chain()
          .setNodeSelection(pos)
          .updateBlockMath({ latex: newCalculation.trim() })
          .focus()
          .run();
      }
    },
  },

  /**
   * Configuration for inline math expressions
   * Inline math appears within a line of text
   */
  inlineOptions: {
    /**
     * Handler for when an inline math node is clicked
     * Opens a prompt to edit the LaTeX expression
     * 
     * @param node - The math node that was clicked (contains pos property)
     */
    onClick: (node: any) => {
      const currentLatex = node.attrs.latex || "";
      const newCalculation = window.prompt("Enter new calculation:", currentLatex);
      
      if (newCalculation !== null && newCalculation.trim() && editorInstance && node.pos !== undefined) {
        editorInstance
          .chain()
          .setNodeSelection(node.pos)
          .updateInlineMath({ latex: newCalculation.trim() })
          .focus()
          .run();
      }
    },
  },
}) satisfies AnyExtension;

/**
 * Set the editor instance for onClick handlers
 * This is called from the Editor component when the editor is created
 * 
 * @param editor - The TipTap editor instance
 */
export const setMathEditorInstance = (editor: any) => {
  editorInstance = editor;
};

export default MathsExtension;
