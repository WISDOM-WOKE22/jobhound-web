"use client";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, all } from "lowlight";
import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Enhanced Code Block Extension with full language support and LaTeX/Math rendering
 * 
 * This extension provides syntax highlighting for code blocks using lowlight.
 * It supports all major programming languages available in highlight.js via lowlight.
 * 
 * Special features:
 * - LaTeX/Math rendering: When language is set to "latex" or "math", the content
 *   is rendered using KaTeX instead of syntax highlighting
 * - Full language support: All highlight.js languages are available
 * 
 * Supported languages include (but not limited to):
 * - Web: JavaScript, TypeScript, JSX, TSX, HTML, CSS, SCSS, SASS, JSON, XML
 * - Backend: Python, Java, C, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, Scala
 * - Scripting: Bash, Shell, PowerShell, Perl, Lua
 * - Database: SQL, MongoDB, GraphQL
 * - Config: YAML, TOML, INI, Markdown
 * - Functional: Haskell, Elixir, Erlang, Clojure, F#
 * - Math: LaTeX, Math (rendered with KaTeX)
 * - Other: Dart, Dockerfile, Makefile, Git, Diff, MATLAB, R, Julia, Vue, Svelte
 * - And many more via highlight.js
 */

// Create lowlight instance with all languages registered
// Using 'all' imports all available languages from highlight.js
const lowlight = createLowlight(all);

export const CodeExtension = CodeBlockLowlight.extend({
    addNodeView() {
        return ({ node, HTMLAttributes, getPos, editor }) => {
            const dom = document.createElement("div");
            const language = node.attrs.language || "plaintext";
            const content = node.textContent;
            const isMathBlock = language === "latex" || language === "math" || language === "tex";

            // Apply base HTML attributes
            Object.entries(HTMLAttributes).forEach(([key, value]) => {
                if (value && key !== "class") {
                    dom.setAttribute(key, value);
                }
            });

            if (isMathBlock) {
                // Render LaTeX/Math using KaTeX
                dom.className = "rounded-xl border border-border bg-muted/60 p-4 shadow-inner overflow-x-auto";
                const mathContainer = document.createElement("div");
                mathContainer.className = "katex-render-container text-center py-2";
                
                try {
                    katex.render(content, mathContainer, {
                        throwOnError: false,
                        displayMode: true,
                        strict: false,
                    });
                    dom.appendChild(mathContainer);
                } catch (error) {
                    // Fallback: show as plain text if KaTeX fails
                    const pre = document.createElement("pre");
                    const code = document.createElement("code");
                    code.textContent = content;
                    code.className = `language-${language}`;
                    pre.appendChild(code);
                    dom.appendChild(pre);
                }
            } else {
                // Regular code block with syntax highlighting
                const pre = document.createElement("pre");
                const code = document.createElement("code");
                
                pre.className = HTMLAttributes.class || "rounded-xl border border-border bg-muted/60 p-4 font-mono text-sm leading-relaxed shadow-inner overflow-x-auto";
                code.className = `language-${language}`;
                code.textContent = content;
                
                // Apply syntax highlighting
                if (language && language !== "plaintext") {
                    try {
                        const highlighted = lowlight.highlight(language, content);
                        if (highlighted && highlighted.children) {
                            const renderNode = (node: any): string => {
                                if (typeof node === "string") {
                                    return node;
                                }
                                if (node.type === "text") {
                                    return node.value || "";
                                }
                                const className = node.properties?.className?.join(" ") || "";
                                const children = node.children?.map(renderNode).join("") || "";
                                return className ? `<span class="${className}">${children}</span>` : children;
                            };
                            code.innerHTML = highlighted.children.map(renderNode).join("");
                        }
                    } catch (error) {
                        // If highlighting fails, keep plain text
                        code.textContent = content;
                    }
                }
                
                pre.appendChild(code);
                dom.appendChild(pre);
            }

            // Handle updates
            return {
                dom,
                update: (node) => {
                    if (node.type.name !== "codeBlock") {
                        return false;
                    }
                    
                    const newLanguage = node.attrs.language || "plaintext";
                    const newContent = node.textContent;
                    const newIsMathBlock = newLanguage === "latex" || newLanguage === "math" || newLanguage === "tex";

                    if (newIsMathBlock) {
                        const mathContainer = dom.querySelector(".katex-render-container") as HTMLElement;
                        if (mathContainer) {
                            try {
                                mathContainer.innerHTML = "";
                                katex.render(newContent, mathContainer, {
                                    throwOnError: false,
                                    displayMode: true,
                                    strict: false,
                                });
                            } catch (error) {
                                mathContainer.textContent = newContent;
                            }
                        }
                    } else {
                        const code = dom.querySelector("code");
                        if (code) {
                            code.textContent = newContent;
                            code.className = `language-${newLanguage}`;
                            
                            if (newLanguage && newLanguage !== "plaintext") {
                                try {
                                    const highlighted = lowlight.highlight(newLanguage, newContent);
                                    if (highlighted && highlighted.children) {
                                        const renderNode = (node: any): string => {
                                            if (typeof node === "string") return node;
                                            if (node.type === "text") return node.value || "";
                                            const className = node.properties?.className?.join(" ") || "";
                                            const children = node.children?.map(renderNode).join("") || "";
                                            return className ? `<span class="${className}">${children}</span>` : children;
                                        };
                                        code.innerHTML = highlighted.children.map(renderNode).join("");
                                    }
                                } catch (error) {
                                    code.textContent = newContent;
                                }
                            }
                        }
                    }
                    return true;
                },
            };
        };
    },
}).configure({
    lowlight,
    defaultLanguage: "plaintext",
    HTMLAttributes: {
        class: "rounded-xl border border-border bg-muted/60 p-4 font-mono text-sm leading-relaxed shadow-inner overflow-x-auto",
        spellcheck: "false",
    },
});
