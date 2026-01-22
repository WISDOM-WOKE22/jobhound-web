import Bold from "@tiptap/extension-bold";

/**
 * Slightly customised Bold extension so we can tweak defaults
 * and keep all editor marks registered in a single place.
 */
export const BoldExtension = Bold.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: "font-semibold",
      },
    };
  },
});

export default BoldExtension;
