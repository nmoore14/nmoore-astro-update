import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
    id: z.number(),
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		author: z.string().optional(),
	}),
})

const project = defineCollection({
  schema: z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    repo: z.string(),
    startDate: z.coerce.date(),
    finishedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
})

export const collections = { blog, project };
