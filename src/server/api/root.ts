import { createTRPCRouter } from "@/server/api/trpc";
import { AuthenticationRouter } from "./routers/authentication";
import { FormRouter } from "./routers/form";
import { QuestionRouter } from "./routers/question";
import { SubmissionRouter } from "./routers/submission";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  authentication: AuthenticationRouter,
  form: FormRouter,
  question: QuestionRouter,
  submission: SubmissionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
