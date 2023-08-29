import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  AddQuestionSchema,
  DeleteQuestionSchema,
  UpdateQuestionSchema,
} from "@/utils/ValidationSchema";

export const DEFAULT_OPTIONS = ["Option 1", "Option 2", "Option 3", "Option 4"];

export const QuestionRouter = createTRPCRouter({
  add: protectedProcedure
    .input(AddQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      const newOrder = await ctx.prisma.question.count({
        where: {
          formId: input.formId,
        },
      });
      return ctx.prisma.question.create({
        data: {
          formId: input.formId,
          text: "Untitled Question",
          type: input.questionType,
          order: newOrder,
          options:
            input.questionType === "MULTIPLE_CHOICE"
              ? DEFAULT_OPTIONS
              : undefined,
        },
      });
    }),

  update: protectedProcedure
    .input(UpdateQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.question.update({
        where: {
          id: input.questionId,
        },
        data: {
          text: input.text,
          options: input.options,
          description: input.description,
        },
      });
    }),

  delete: protectedProcedure
    .input(DeleteQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      // check for form
      return ctx.prisma.question.delete({
        where: {
          id: input.questionId,
          form: {
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
