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

export const GetSubmissionSchema = z.object({
  submissionId: z.string(),
});

export const DeleteSubmissionSchema = z.object({
  submissionId: z.string(),
});

export const DeleteFormSchema = z.object({
  formId: z.string(),
});

const QUESTION_TYPE_ENUM = z.enum(["TEXT", "MULTIPLE_CHOICE", "URL", "EMAIL"]);

export const AddQuestionSchema = z.object({
  formId: z.string(),
  questionType: QUESTION_TYPE_ENUM,
});

export const UpdateQuestionSchemaLocal = z.object({
  questionId: z.string(),
  text: z.string().max(500),
  type: QUESTION_TYPE_ENUM,
  description: z.string().max(1000).optional(),
  options: z.array(z.string().max(500)).min(2).max(4),
});

export const UpdateQuestionSchema = z.object({
  questionId: z.string(),
  text: z.string().max(500),
  type: QUESTION_TYPE_ENUM,
  description: z.string().max(1000).optional(),
  options: z.array(z.string().max(500)).max(4).optional(),
});

export const DeleteQuestionSchema = z.object({
  questionId: z.string(),
});

export const FormSubmissionSchema = z.object({
  formId: z.string(),
  responses: z.record(z.any()),
});

export const searchSchema = z.object({
  query: z.string().optional(),
});

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
