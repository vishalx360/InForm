import { responseSchemaGenerator } from "@/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  DeleteSubmissionSchema,
  FormSubmissionSchema,
  GetFormSchema,
  GetSubmissionSchema,
} from "@/utils/ValidationSchema";
import { TRPCError } from "@trpc/server";

export const SubmissionRouter = createTRPCRouter({
  getPublicForm: publicProcedure
    .input(GetFormSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.form.findUnique({
        where: { id: input.formId },
        include: {
          questions: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    }),
  getAll: protectedProcedure
    .input(GetFormSchema)
    .query(async ({ ctx, input }) => {
      const exist = await ctx.prisma.form.count({
        where: {
          id: input.formId,
          userId: ctx.session.user.id,
        },
      });
      if (!exist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please Check your Inputs",
        });
      }

      return ctx.prisma.formSubmission.findMany({
        where: {
          formId: input.formId,
        },
        select: {
          id: true,
          submittedAt: true,
        },
        orderBy: {
          submittedAt: "desc",
        },
      });
    }),
  get: protectedProcedure
    .input(GetSubmissionSchema)
    .query(async ({ ctx, input }) => {
      const exist = await ctx.prisma.formSubmission.findUnique({
        where: {
          id: input.submissionId,
        },
        select: {
          formId: true,
        },
      });
      if (!exist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Please Check your Inputs",
        });
      }
      const formExist = await ctx.prisma.form.count({
        where: {
          id: exist.formId,
          userId: ctx.session.user.id,
        },
      });
      if (!formExist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Please Check your Inputs",
        });
      }

      return ctx.prisma.formSubmission.findUnique({
        where: {
          id: input.submissionId,
        },
        include: {
          responses: {
            select: {
              id: true,
              text: true,
              question: {
                select: {
                  id: true,
                  description: true,
                  type: true,
                  text: true,
                },
              },
            },
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(DeleteSubmissionSchema)
    .mutation(async ({ ctx, input }) => {
      const exist = await ctx.prisma.formSubmission.findUnique({
        where: {
          id: input.submissionId,
        },
        select: {
          formId: true,
        },
      });
      if (!exist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission does not exist",
        });
      }
      const formExist = await ctx.prisma.form.count({
        where: {
          id: exist.formId,
          userId: ctx.session.user.id,
        },
      });
      if (!formExist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Please Check your Inputs",
        });
      }

      return ctx.prisma.formSubmission.delete({
        where: {
          id: input.submissionId,
        },
      });
    }),
  create: publicProcedure
    .input(FormSubmissionSchema)
    .mutation(async ({ ctx, input }) => {
      // fetch questions
      const questions = await ctx.prisma.question.findMany({
        where: {
          formId: input.formId,
        },
        select: {
          id: true,
          type: true,
        },
      });

      // validate answers
      const schmea = responseSchemaGenerator(questions);
      const result = schmea.safeParse(input.responses);

      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid form submission",
        });
      }

      // save answers
      return ctx.prisma.formSubmission.create({
        data: {
          formId: input.formId,
          responses: {
            createMany: {
              data: Object.keys(input.responses).map((questionId) => {
                return {
                  questionId,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  text: input.responses[questionId],
                };
              }),
            },
          },
        },
      });
    }),
});
