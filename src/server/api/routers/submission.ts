import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { FormSubmissionSchema } from "@/utils/ValidationSchema";

export const SubmissionRouter = createTRPCRouter({
  new: publicProcedure
    .input(FormSubmissionSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.formSubmission.create({
        data: {
          formId: input.formId,
          responses: {
            createMany: {
              data: input.responses.map((response) => {
                return {
                  questionId: response.questionId,
                  optionId: response.optionId,
                  text: response.text ?? "__OPTION__",
                }
              }
              )
            }
          }
        }
      });
    }),
});
