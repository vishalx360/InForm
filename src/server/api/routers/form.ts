import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  DeleteFormSchema,
  GetFormSchema,
  UpdateFormSchema,
  searchSchema,
} from "@/utils/ValidationSchema";
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
  update: protectedProcedure
    .input(UpdateFormSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.form.update({
        where: {
          id: input.formId,
        },
        data: {
          title: input.title,
          description: input.description,
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
