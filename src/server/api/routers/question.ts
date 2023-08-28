import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { AddQuestionSchema, DeleteQuestionSchema, UpdateQuestionSchema } from "@/utils/ValidationSchema";

export const QuestionRouter = createTRPCRouter({
  add: protectedProcedure
    .input(AddQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      const newOrder = await ctx.prisma.question.count({
        where: {
          formId: input.formId,
        }
      });
      return ctx.prisma.question.create({
        data: {
          formId: input.formId,
          text: "Untitled Question",
          order: newOrder,
          options: {
            createMany: {
              data: [
                {
                  text: "Option 1",
                  order: 0,
                },
                {
                  text: "Option 2",
                  order: 1,
                },
                {
                  text: "Option 3",
                  order: 2,
                },
                {
                  text: "Option 4",
                  order: 3,
                }
              ]
            }
          }
        }
      });
    }),

  update: protectedProcedure
    .input(UpdateQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      const updateQuestion = ctx.prisma.question.update({
        where: {
          id: input.questionId,
        },
        data: {
          text: input.text,
        }
      });
      const updateOptions = input.options.map((option, index) => {
        if (option.id) {
          return ctx.prisma.option.update({
            where: {
              id: option.id,
            },
            data: {
              order: index,
              text: option.text,
            }
          });
        }

        return ctx.prisma.option.create({
          data: {
            order: index,
            text: option.text,
            questionId: input.questionId,
          }
        });
      })
      return ctx.prisma.$transaction([updateQuestion, ...updateOptions]);
    }),

  delete: protectedProcedure
    .input(DeleteQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.question.delete({
        where: {
          id: input.questionId,
        }
      });
    }),
});
