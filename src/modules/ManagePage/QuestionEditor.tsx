import { UpdateQuestionSchemaLocal } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Stack,
  Tag,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { type Question } from "@prisma/client";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  FormikProvider,
  useFormik,
  type FieldArrayRenderProps,
  type FieldProps,
} from "formik";
import {
  LucideLink,
  LucideListTodo,
  LucideMail,
  LucideText,
} from "lucide-react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { type GetForm } from "./FormEditor";

type QuestionType = {
  id: string;
  text: string;
  description: string | null;
  type: Question["type"];
  options: string[];
  formId: string;
};

export const QuestionTypeTagIconMap = {
  TEXT: {
    text: "Text",
    icon: LucideText,
  },
  EMAIL: {
    text: "Email",
    icon: LucideMail,
  },
  URL: {
    text: "URL",
    icon: LucideLink,
  },
  MULTIPLE_CHOICE: {
    text: "Multiple Choice",
    icon: LucideListTodo,
  },
};

function getReadableQuestionType(type: Question["type"]) {
  return QuestionTypeTagIconMap[type].text || "Unknown";
}

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
    description: question.description,
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
    onSuccess(data: QuestionType) {
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
      toast({
        title: "Updated Question",
        status: "info",
      });
      formik.resetForm({
        values: {
          type: data.type,
          questionId: data.id,
          options: data.options,
          text: data.text,
          description: data.description,
        },
      });
    },
  });
  const TagIcon = QuestionTypeTagIconMap[question.type].icon || LucideText;

  return (
    <Box borderWidth="1px" bg="whiteAlpha.200" rounded="xl" p="6">
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
              {({ field, meta, form }: FieldProps) => (
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
              {({ field, meta, form }: FieldProps) => (
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

            {question.type === "MULTIPLE_CHOICE" && (
              <FieldArray name="options">
                {({ push, remove, form }: FieldArrayRenderProps) => (
                  <FormControl id="options">
                    <FormLabel fontSize="sm">Options</FormLabel>
                    {form.values?.options?.length > 0 ? (
                      <VStack alignItems="start" spacing="1">
                        {form.values.options.map((option, index) => (
                          <FormControl
                            id={`options[${index}]`}
                            key={index}
                            isInvalid={
                              form.touched &&
                              form.touched.options &&
                              form.touched.options[index] &&
                              form.errors?.options?.[index]
                            }
                          >
                            <HStack>
                              <Input
                                autoComplete="off"
                                name={`options[${index}]`}
                                value={option}
                                placeholder={`Option ${index + 1}`}
                                onChange={(event) => {
                                  form.setFieldValue(
                                    `options[${index}]`,
                                    event.target.value
                                  );
                                  form.setTouched({
                                    ...form.touched,
                                    options: {
                                      ...form.touched.options,
                                      [index]: true,
                                    },
                                  });
                                }}
                              />
                              <IconButton
                                aria-label="Delete Option"
                                type="button"
                                variant={"outline"}
                                colorScheme="red"
                                icon={<DeleteIcon />}
                                onClick={() => remove(index)}
                                ml="2"
                              />
                            </HStack>
                            <ErrorMessage
                              name={`options[${index}]`}
                              component={FormErrorMessage}
                            />
                          </FormControl>
                        ))}
                      </VStack>
                    ) : (
                      <Alert rounded="xl" status="warning">
                        <AlertIcon />
                        No options added
                      </Alert>
                    )}

                    {form.values?.options?.length > 0 &&
                      form.values?.options?.length < 2 && (
                        <Box my="2">
                          <Alert size="sm" rounded="xl" status="warning">
                            <AlertIcon />
                            Must have at least 2 options
                          </Alert>
                        </Box>
                      )}
                    {form.values?.options?.length < 4 && (
                      <Button
                        mt="2"
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => push("")}
                      >
                        Add Option
                      </Button>
                    )}
                  </FormControl>
                )}
              </FieldArray>
            )}
            <Field name="reset">
              {({ field, meta, form }: FieldProps) => (
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
                        colorScheme="green"
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

function DeleteQuestionButton({
  questionId,
  formId,
}: {
  questionId: string;
  formId: string;
}) {
  const utils = api.useContext();
  const DeleteQuestionMutation = api.question.delete.useMutation();
  const toast = useToast();
  const HandelDelete = () => {
    DeleteQuestionMutation.mutate(
      { questionId },
      {
        onError(error) {
          console.log(error);
          toast({
            status: "error",
            title: error.message ?? "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            // action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        },
        onSuccess(data) {
          utils.form.get.setData({ formId }, (previousForm) => {
            if (!previousForm) return previousForm;
            return {
              ...previousForm,
              questions: previousForm.questions.filter(
                (question) => question.id !== questionId
              ),
            } as GetForm;
          });
          toast({
            title: "Deleted Question",
            status: "info",
          });
        },
      }
    );
  };
  return (
    <Button
      onClick={HandelDelete}
      colorScheme="red"
      isLoading={DeleteQuestionMutation.isLoading}
      size="xs"
      variant="outline"
      // leftIcon={<LucideTrash />}
    >
      Remove Question
    </Button>
  );
}
