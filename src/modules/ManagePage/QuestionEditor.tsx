import { UpdateQuestionSchemaLocal } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Tag,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { type Question } from "@prisma/client";
import {
  Field,
  Form,
  FormikProvider,
  useFormik,
  type FieldProps,
} from "formik";
import {
  LucideLink,
  LucideListTodo,
  LucideMail,
  LucideText,
} from "lucide-react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import DeleteQuestionButton from "./DeleteQuestionBtn";
import { OptionsEditor } from "./OptionsEditor";
import { type GetForm } from "@/pages/manage/[formId]";

export type QuestionType = {
  id: string;
  text: string;
  order: number;
  description: string | null | undefined;
  type: Question["type"];
  options: string[];
  formId: string;
};

export const QuestionTypeTagIconMap = {
  TEXT: {
    text: "Text",
    inputType: "text",
    icon: LucideText,
    answerHint: "Users can enter any text",
  },
  EMAIL: {
    text: "Email",
    inputType: "email",
    icon: LucideMail,
    answerHint: "Users can enter any email address",
  },
  URL: {
    text: "URL",
    inputType: "url",
    icon: LucideLink,
    answerHint: "Users can enter any URL",
  },
  MULTIPLE_CHOICE: {
    text: "Multiple Choice",
    inputType: "text",
    icon: LucideListTodo,
    answerHint: "Users can select any one option",
  },
};

export default function QuestionEditor({
  question,
}: {
  question: QuestionType;
}) {
  const initialValues = {
    type: question.type,
    questionId: question.id,
    text: question.text,
    options: question.options,
    description: question.description ?? undefined,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      UpdateQuestionMutation.mutate(values);
    },
    validationSchema: toFormikValidationSchema(
      question.type === "MULTIPLE_CHOICE"
        ? UpdateQuestionSchemaLocal
        : UpdateQuestionSchemaLocal.omit({ options: true })
    ),
  });

  const utils = api.useContext();
  const toast = useToast();
  const UpdateQuestionMutation = api.question.update.useMutation({
    onError(error) {
      console.log(error);
      toast({
        status: "error",
        title: error.message ?? "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSuccess(data) {
      utils.form.get.setData({ formId: question.formId }, (previousForm) => {
        if (!previousForm) return previousForm;
        const NewQuestion = previousForm.questions.map((question) => {
          if (question.id === data.id) {
            return data;
          }
          return question;
        });
        return {
          ...previousForm,
          questions: NewQuestion,
        } as GetForm;
      });
      // toast({
      //   title: "Updated Question",
      //   status: "info",
      // });
      formik.resetForm({
        values: {
          type: data.type,
          questionId: data.id,
          options: data.options,
          text: data.text,
          description: data.description ?? undefined,
        },
      });
    },
  });
  const TagIcon = QuestionTypeTagIconMap[question.type].icon || LucideText;

  return (
    <Box borderWidth="1px" bg="whiteAlpha.200" rounded="md" p="6">
      <HStack justifyContent="space-between">
        <Tag colorScheme="teal" mb="2">
          <TagIcon size="16" className="mr-2" />
          {QuestionTypeTagIconMap[question.type].text}
        </Tag>
        <DeleteQuestionButton
          formId={question.formId}
          questionId={question.id}
        />
      </HStack>
      <FormikProvider value={formik}>
        <Form onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
          <Stack dir="col" gap="2">
            <Field name="text">
              {({ field, meta }: FieldProps) => (
                <FormControl id="text">
                  {/* <pre>{JSON.stringify(form.errors, null, 2)}</pre> */}
                  <FormLabel fontSize="sm">Question</FormLabel>
                  <Input
                    type="text"
                    autoComplete="off"
                    placeholder="Question"
                    required
                    size="lg"
                    {...field}
                  />
                  {meta.touched && meta.error && (
                    <p className="ml-2 mt-2 text-sm text-red-500">
                      {meta.error}
                    </p>
                  )}
                </FormControl>
              )}
            </Field>
            <Field name="description">
              {({ field, meta }: FieldProps) => (
                <FormControl id="description">
                  <FormLabel fontSize="sm">Description (optional)</FormLabel>
                  <Textarea
                    autoComplete="off"
                    placeholder="Description"
                    {...field}
                  />
                  {meta.touched && meta.error && (
                    <p className="ml-2 mt-2 text-sm text-red-500">
                      {meta.error}
                    </p>
                  )}
                </FormControl>
              )}
            </Field>

            {question.type === "MULTIPLE_CHOICE" && <OptionsEditor />}
            <Box my="2">
              <Text fontStyle="italic">
                Answer: {QuestionTypeTagIconMap[question.type].answerHint}
              </Text>
            </Box>
            <Field name="reset">
              {({ form }: FieldProps) => (
                <FormControl id="reset">
                  {form.dirty && Object.keys(form.errors).length === 0 && (
                    <HStack justifyContent={"flex-end"}>
                      <Button
                        isDisabled={UpdateQuestionMutation.isLoading}
                        colorScheme="gray"
                        type="button"
                        onClick={() => {
                          form.resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        isLoading={UpdateQuestionMutation.isLoading}
                        colorScheme="teal"
                        type="submit"
                      >
                        Save Changes
                      </Button>
                    </HStack>
                  )}
                </FormControl>
              )}
            </Field>
          </Stack>
        </Form>
      </FormikProvider>
    </Box>
  );
}
