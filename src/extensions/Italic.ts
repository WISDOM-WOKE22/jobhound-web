import Italic from "@tiptap/extension-italic";

export const ItalicExtension = Italic.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: "italic",
      },
    };
  },
});

export default ItalicExtension;
