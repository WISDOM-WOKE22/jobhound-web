import { z } from "zod";

export const userTagsSchema = z.object({
    focusedTags: z.array(z.string()),
});

export type UserTagsType = z.infer<typeof userTagsSchema>;