import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per project and language. Files starting with "_" are
// ignored, so _template.md documents the format without being published.
const work = defineCollection({
  // Keyed by filename: <slug>.en.md and <slug>.pt.md share a slug, so the slug cannot be the id.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/work', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    lang: z.enum(['en', 'pt']),
    slug: z.string(),
    order: z.number().default(100),
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    dates: z.string(),
    status: z.string(),
    pending: z.boolean().default(false),
    /** what is drawn inside the package window */
    icon: z.enum(['package', 'oscillation']).default('package'),
    /** up to 10 pin labels: interfaces, stack, collaborators */
    pins: z.array(z.string()).max(10).default([]),
    /** up to 3 numbers with units, drawn as dimension lines */
    dims: z.array(z.object({ label: z.string(), value: z.string(), unit: z.string() })).max(3).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  }),
});

export const collections = { work };
