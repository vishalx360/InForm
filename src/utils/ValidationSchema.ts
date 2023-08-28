import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Must contain at least 8 characters")
  .max(16, "Must contain less than 16 characters")
  .regex(/^\S*$/, { message: "Password must not contain whitespace" });


// form

export const CreateFormSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(500),
});

export const UpdateFormSchema = z.object({
  formId: z.string(),
  title: z.string().max(100),
  description: z.string().max(500),
});

export const GetFormSchema = z.object({
  formId: z.string(),
});

export const DeleteFormSchema = z.object({
  formId: z.string(),
});

export const AddQuestionSchema = z.object({
  formId: z.string(),
});

export const UpdateQuestionSchema = z.object({
  questionId: z.string(),
  text: z.string().max(500),
  options: z.array(
    z.object({
      id: z.string().optional(),
      text: z.string().max(500),
    })
  ),
});

export const DeleteQuestionSchema = z.object({
  questionId: z.string(),
});

export const FormSubmissionSchema = z.object({
  formId: z.string(),
  responses: z.array(
    z.object({
      questionId: z.string(),
      optionId: z.string().optional(),
      text: z.string().optional(),
    })
  ),
});


// export const searchSchemaLocal = z.object({
//   query: z.string().optional(),
// });

export const SigninSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const SignUpSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
  password: z
    .string()
    .regex(/^\S*$/, { message: "Password must not contain whitespace" }),
});
