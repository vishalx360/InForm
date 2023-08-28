import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { DeleteFormSchema, GetFormSchema } from "@/utils/ValidationSchema";
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
});