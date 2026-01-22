import React from "react";
import Image, { type ImageOptions } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "@/components/Editor/ImageNodeView";

export type UploadImageFn = (file: File) => Promise<string>;

export interface EnhancedImageOptions extends ImageOptions {
  uploadImage?: UploadImageFn;
}

export const EnhancedImage = Image.extend<EnhancedImageOptions>({
  draggable: true,

  addOptions() {
    return {
      ...this.parent?.(),
      allowBase64: true,
      inline: false,
      HTMLAttributes: {
        class: "editor-image-node",
      },
      uploadImage: undefined,
    } satisfies EnhancedImageOptions;
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      (props) =>
        React.createElement(ImageNodeView, {
          ...props,
          uploadImage: this.options.uploadImage,
        }),
      {
        stopEvent: ({ event }) => event.target instanceof HTMLInputElement,
      }
    );
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 100,
        renderHTML: attributes => ({
          "data-width": attributes.width,
        }),
      },
      imageWidth: {
        default: null,
        renderHTML: attributes => {
          if (attributes.imageWidth) {
            return {
              width: attributes.imageWidth,
            };
          }
          return {};
        },
      },
      imageHeight: {
        default: null,
        renderHTML: attributes => {
          if (attributes.imageHeight) {
            return {
              height: attributes.imageHeight,
            };
          }
          return {};
        },
      },
      align: {
        default: "center",
        renderHTML: attributes => ({
          "data-align": attributes.align,
        }),
      },
      caption: {
        default: "",
      },
    };
  },

});

export default EnhancedImage;
