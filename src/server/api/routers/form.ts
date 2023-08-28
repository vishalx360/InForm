import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { DeleteFormSchema, GetFormSchema } from "@/utils/ValidationSchema";

export const FormRouter = createTRPCRouter({
  get: protectedProcedure
    .input(GetFormSchema)
    .query(async ({ ctx, input }) => {
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
            include: {
              options: {
                orderBy: {
                  order: "asc",
                }
              }
            }
          }
        }
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
          }
        },
        title: true,
        description: true,
      }
    });
  }),
  create: protectedProcedure
    .mutation(async ({ ctx }) => {
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
                    },
                  ]
                }
              }
            }
          }
        }
      })
    }),
  delete: protectedProcedure
    .input(DeleteFormSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.favroite.delete({
        where: {
          id: input.formId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
