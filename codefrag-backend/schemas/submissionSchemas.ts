import { z } from "zod";
export const SubmitSchema = z.object({
  code: z.string().min(1),
  language: z.enum(["cpp", "java"]),
  problemId: z.string(),
});
