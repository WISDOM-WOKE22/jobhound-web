import Highlight from "@tiptap/extension-highlight";

export const HighlightExtension = Highlight.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      multicolor: true,
      HTMLAttributes: {
        class: "bg-yellow-200 text-foreground rounded-sm px-0.5",
      },
    };
  },
});

export default HighlightExtension;
