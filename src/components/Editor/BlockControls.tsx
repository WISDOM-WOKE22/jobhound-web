"use client";

import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
} from "react";
import type { Editor } from "@tiptap/react";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import { GripVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type BlockControlsProps = {
  editor: Editor | null;
  onAddBlock?: (options: { editor: Editor; pos: number; nodeType: string }) => void;
};

type BlockState = {
  nodeType: string;
  pos: number;
  rect: DOMRect;
  dom: HTMLElement;
};

export function BlockControls({ editor, onAddBlock }: BlockControlsProps) {
  const isEditable = editor?.isEditable ?? false;

  const [block, setBlock] = useState<BlockState | null>(null);
  const [hoveringControls, setHoveringControls] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimeout();
    hideTimeoutRef.current = window.setTimeout(() => {
      setBlock(null);
      hideTimeoutRef.current = null;
    }, 180);
  }, [clearHideTimeout]);
  const markBlockNodes = useCallback(() => {
    if (!editor || !isEditable) return;

    const { doc } = editor.state;
    doc.descendants((node, pos) => {
      if (!node.isBlock || node.type.name === "doc") return true;
      const dom = editor.view.nodeDOM(pos) as HTMLElement | null;
      if (dom) {
        dom.dataset.nodeType = node.type.name;
        dom.dataset.nodePos = String(pos);
        dom.classList.add("tiptap-block-node");
      }
      return true;
    });
  }, [editor, isEditable]);

  useEffect(() => {
    if (!editor || !isEditable) return;

    markBlockNodes();

    const reapply = () => {
      markBlockNodes();
    };

    editor.on("transaction", reapply);
    editor.on("selectionUpdate", reapply);
    editor.on("create", reapply);
    editor.on("update", reapply);

    return () => {
      editor.off("transaction", reapply);
      editor.off("selectionUpdate", reapply);
      editor.off("create", reapply);
      editor.off("update", reapply);
    };
  }, [editor, isEditable, markBlockNodes]);

  const updateBlockFromDom = useCallback(
    (dom: HTMLElement | null) => {
      clearHideTimeout();

      if (!editor || !dom) {
        setBlock(prev => (hoveringControls ? prev : null));
        return;
      }

      const nodeTypeName = dom.dataset.nodeType;
      const posFromDom = dom.dataset.nodePos ? Number(dom.dataset.nodePos) : null;

      if (!nodeTypeName) {
        setBlock(prev => (hoveringControls ? prev : null));
        return;
      }

      const schemaNode = editor.schema.nodes[nodeTypeName];
      if (!schemaNode?.isBlock || nodeTypeName === "doc") {
        setBlock(prev => (hoveringControls ? prev : null));
        return;
      }

      let pos: number;
      if (typeof posFromDom === "number" && !Number.isNaN(posFromDom)) {
        pos = posFromDom;
      } else {
        try {
          pos = editor.view.posAtDOM(dom, 0);
        } catch {
          return;
        }
      }

      const rect = dom.getBoundingClientRect();
      setBlock(prev => {
        if (prev?.dom === dom && prev.rect.top === rect.top && prev.rect.left === rect.left) {
          return prev;
        }

        return {
          nodeType: nodeTypeName,
          pos,
          rect,
          dom,
        };
      });
    },
    [editor, hoveringControls, clearHideTimeout]
  );

  useEffect(() => {
    if (!editor || !isEditable) {
      return;
    }

    const root = editor.view.dom;

    const handlePointerMove = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-node-type]");
      if (!target || !root.contains(target)) {
        if (!hoveringControls) {
          scheduleHide();
        }
        return;
      }
      updateBlockFromDom(target);
    };

    const handlePointerLeave = (event: MouseEvent) => {
      const nextTarget = event.relatedTarget as HTMLElement | null;
      const movingToControls = nextTarget?.closest(".block-controls") != null;
      if (!root.contains(nextTarget as Node) && !movingToControls) {
        if (!hoveringControls) {
          scheduleHide();
        }
      }
    };

    root.addEventListener("mousemove", handlePointerMove);
    root.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      root.removeEventListener("mousemove", handlePointerMove);
      root.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [editor, isEditable, hoveringControls, updateBlockFromDom, scheduleHide]);

  useEffect(() => {
    if (!editor || !isEditable) return;

    const updateFromSelection = () => {
      const selection = editor.state.selection;
      let dom: Node;
      try {
        dom = editor.view.domAtPos(selection.from).node;
      } catch {
        return;
      }
      const blockElement = (dom as HTMLElement | null)?.closest<HTMLElement>("[data-node-type]");
      if (blockElement) {
        updateBlockFromDom(blockElement);
      }
    };

    editor.on("selectionUpdate", updateFromSelection);
    editor.on("transaction", updateFromSelection);

    return () => {
      editor.off("selectionUpdate", updateFromSelection);
      editor.off("transaction", updateFromSelection);
    };
  }, [editor, isEditable, updateBlockFromDom]);

  useEffect(() => {
    if (!block) return;

    block.dom.classList.add("has-block-controls");

    const updateRect = () => {
      setBlock(prev => {
        if (!prev) return prev;
        if (!prev.dom.isConnected) {
          return null;
        }
        const rect = prev.dom.getBoundingClientRect();
        return {
          ...prev,
          rect,
        };
      });
    };

    const obs = new ResizeObserver(updateRect);
    obs.observe(block.dom);

    window.addEventListener("scroll", updateRect, true);

    return () => {
      block.dom.classList.remove("has-block-controls");
      obs.disconnect();
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [block]);

  useEffect(() => {
    if (block && !block.dom.isConnected) {
      setBlock(null);
    }
  }, [block]);

  const handleAddBlock = useCallback(() => {
    if (!editor || !block) return;

    if (onAddBlock) {
      onAddBlock({ editor, pos: block.pos, nodeType: block.nodeType });
      return;
    }

    const { state } = editor;
    const $pos = state.doc.resolve(block.pos);
    const depth = $pos.depth;
    const insertPos = $pos.after(depth);
    if (insertPos == null) {
      return;
    }

    editor
      .chain()
      .focus()
      .insertContentAt(insertPos, { type: "paragraph" }, { updateSelection: true })
      // .insertText("/")
      .run();
  }, [editor, block, onAddBlock]);

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLButtonElement>) => {
      if (!editor || !block) return;

      clearHideTimeout();

      const node = editor.state.doc.nodeAt(block.pos);
      if (!node) return;

      try {
        if (node.type.spec.selectable !== false) {
          const tr = editor.state.tr.setSelection(
            NodeSelection.create(editor.state.doc, block.pos)
          );
          editor.view.dispatch(tr);
        } else {
          const start = block.pos;
          const end = start + node.nodeSize;
          const tr = editor.state.tr.setSelection(
            TextSelection.create(editor.state.doc, start, end)
          );
          editor.view.dispatch(tr);
        }
      } catch (error) {
        console.warn("Failed to prepare selection for drag", error);
      }

      editor.view.focus();

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", node.textContent ?? "");
        try {
          const rect = block.dom.getBoundingClientRect();
          event.dataTransfer.setDragImage(block.dom, rect.width / 2, rect.height / 2);
        } catch {
          // Ignore drag image errors in non-browser environments
        }
      }
    },
    [editor, block, clearHideTimeout]
  );

  const handleDragEnd = useCallback(() => {
    editor?.commands.focus();
    scheduleHide();
  }, [editor, scheduleHide]);

  const handleMouseEnterControls = useCallback(() => {
    clearHideTimeout();
    setHoveringControls(true);
  }, [clearHideTimeout]);

  const handleMouseLeaveControls = useCallback(() => {
    setHoveringControls(false);
    scheduleHide();
  }, [scheduleHide]);

  const style = useMemo<CSSProperties | undefined>(() => {
    if (!block) return undefined;
    const top = block.rect.top + window.scrollY + block.rect.height / 2;
    const left = Math.max(8, block.rect.left + window.scrollX - 36);
    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  }, [block]);

  useEffect(() => () => clearHideTimeout(), [clearHideTimeout]);

  if (typeof document === "undefined" || !isEditable || !editor || !block || !style) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "block-controls pointer-events-auto absolute z-50 -translate-x-full -translate-y-1/2 select-none left-0",
        hoveringControls ? "opacity-100" : "opacity-95"
      )}
      style={style}
      onMouseEnter={handleMouseEnterControls}
      onMouseLeave={handleMouseLeaveControls}
    >
      <button
        type="button"
        className="block-control-button"
        title="Move block"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <GripVertical className="size-4" />
      </button>
      <button
        type="button"
        className="block-control-button"
        title="Add below"
        onClick={handleAddBlock}
      >
        <Plus className="size-4" />
      </button>
    </div>,
    document.body
  );
}

export default BlockControls;
