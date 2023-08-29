import { type QuestionType } from "@/modules/ManagePage/QuestionEditor";
import { type Question } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
type ResponseGeneratorType = {
  id: string;
  type: string; // Change to the appropriate type for "type"
} & Partial<Question>;

export function responseSchemaGenerator(questions: ResponseGeneratorType[]) {
  console.log("generating schema...");
  const schema = Object.fromEntries(
    questions.map((question) => {
      const propertyName = question.id;
      let propertySchema;
      switch (question.type) {
        case "TEXT":
          propertySchema = z.string();
          break;
        case "MULTIPLE_CHOICE":
          propertySchema = z.string();
          break;
        case "URL":
          propertySchema = z.string().url();
          break;
        case "EMAIL":
          propertySchema = z.string().email();
          break;
        // Add cases for other question types if needed
        default:
          propertySchema = z.any();
          break;
      }
      return [propertyName, propertySchema];
    })
  );
  return z.object(schema);
}

export function initialValuesGenerator(questions: QuestionType[]) {
  console.log("generating inital values...");
  const initialValues: Record<string, string> = {};
  questions.forEach((question) => {
    initialValues[question.id] = "";
  });
  return initialValues;
}
