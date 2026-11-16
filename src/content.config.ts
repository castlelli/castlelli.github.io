import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per project and language. Files starting with "_" are
// ignored, so _template.md documents the format without being published.
// Every project links out to its own live site; the portfolio never hosts the tool.
const work = defineCollection({
  // Keyed by filename: <slug>.en.md and <slug>.pt.md share a slug, so the slug cannot be the id.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/work', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    lang: z.enum(['en', 'pt']),
    slug: z.string(),
    order: z.number().default(100),
    kind: z.enum(['project', 'collection']).default('project'),
    domain: z.enum(['research-software', 'synthetic-biology', 'product', 'mechanics', 'digital-hardware', 'image-processing']),
    year: z.string(),
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    dates: z.string(),
    /** honest status, in words: live, shipped, in progress, in preparation */
    status: z.string(),
    /** the project's own live site; the primary action on its page */
    site: z.object({ label: z.string(), href: z.string().url() }),
    /** a screenshot of the live site in public/work/<slug>/, without the -800/-1600 suffix */
    image: z.string(),
    imageAlt: z.string(),
    stack: z.array(z.string()).max(12).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    /** tools inside a collection, each with its own live link */
    items: z.array(z.object({
      title: z.string(),
      summary: z.string(),
      href: z.string().url(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
    })).default([]),
  }),
});

export const collections = { work };
