import { responseSchemaGenerator } from "@/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  DeleteFormSchema,
  FormSubmissionSchema,
  GetFormSchema,
  searchSchema,
} from "@/utils/ValidationSchema";
import { TRPCError } from "@trpc/server";
import { DEFAULT_OPTIONS } from "./question";

export const FormRouter = createTRPCRouter({
  get: protectedProcedure.input(GetFormSchema).query(async ({ ctx, input }) => {
    console.log(ctx.session);
    return ctx.prisma.form.findUnique({
      where: {
        id: input.formId,
        userId: ctx.session.user.id,
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }),
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
  search: protectedProcedure
    .input(searchSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.form.findMany({
        where: {
          OR: [
            {
              title: {
                contains: input.query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: input.query,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          _count: true,
          id: true,
          createdAt: true,
          submissions: {
            select: {
              _count: true,
            },
          },
          title: true,
          description: true,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.form.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        _count: true,
        id: true,
        createdAt: true,
        submissions: {
          select: {
            _count: true,
          },
        },
        title: true,
        description: true,
      },
    });
  }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.prisma.form.create({
      data: {
        title: "Untitled Form",
        description: "Add Description",
        userId: ctx.session.user.id,
        questions: {
          create: {
            type: "MULTIPLE_CHOICE",
            text: "Untitled Question",
            order: 0,
            options: DEFAULT_OPTIONS,
          },
        },
      },
    });
  }),
  delete: protectedProcedure
    .input(DeleteFormSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.form.delete({
        where: {
          id: input.formId,
          userId: ctx.session.user.id,
        },
      });
    }),

  fill: publicProcedure
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
