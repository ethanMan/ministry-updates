import type { Element, ElementContent } from 'hast';
import type { HastPluginDefinition } from 'satteri';

/**
 * Captions under photos in an update.
 *
 * Markdown lets you put a line in quotes after the path of an image:
 *
 *     ![Who is in the photo](../photos/day-camp.jpg 'The last morning of camp.')
 *
 * On its own, markdown turns that into a tooltip — something you only see if
 * you happen to rest the mouse on the photo, and never on a phone. This turns
 * it into a caption printed under the photo instead, the way a caption works
 * in a newsletter.
 *
 * Any photo written on its own line becomes a `<figure>`, whether or not it
 * has a caption, so every photo in an update has the same shape in the page
 * and one set of rules in the stylesheet can cover all of them. (A photo in
 * the middle of a sentence is left alone — there is nowhere to hang a caption.)
 *
 * This runs before Astro's own image handling, so the resized, modern-format
 * photos still come out the other side.
 */
export function markdownFigures(): HastPluginDefinition {
  return {
    name: 'markdown-figures',
    element: {
      // Markdown wraps a photo on its own line in a paragraph, and several
      // photos on consecutive lines in one paragraph together. A <figure>
      // cannot live inside a <p> — browsers would throw the paragraph away —
      // so the paragraph is what gets replaced.
      filter: ['p'],
      visit(node, ctx) {
        const content = (node.children ?? []).filter((child) => !isBlank(child));

        if (content.length === 0) return;
        if (!content.every(isImage)) return;

        ctx.replaceNode(node, content.map(toFigure));
      },
    },
  };
}

/** The line break markdown leaves between two photos in the same paragraph. */
function isBlank(node: ElementContent): boolean {
  return node.type === 'text' && node.value.trim() === '';
}

function isImage(node: ElementContent): node is Element {
  return node.type === 'element' && node.tagName === 'img';
}

function toFigure(image: Element): Element {
  // `title` is dropped from the photo itself: left on, it would show the
  // caption a second time as a tooltip.
  const { title, ...properties } = image.properties ?? {};
  const caption = typeof title === 'string' ? title.trim() : '';

  return {
    type: 'element',
    tagName: 'figure',
    properties: {},
    children: [
      { ...image, properties },
      ...(caption
        ? [
            {
              type: 'element' as const,
              tagName: 'figcaption',
              properties: {},
              children: [{ type: 'text' as const, value: caption }],
            },
          ]
        : []),
    ],
  };
}
