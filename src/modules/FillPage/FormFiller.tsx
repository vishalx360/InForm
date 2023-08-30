import { initialValuesGenerator, responseSchemaGenerator } from "@/lib/utils";
import { api, type RouterOutputs } from "@/utils/api";
import {
  Box,
  Button,
  FormControl,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import AnswerFiller from "./AnswerFiller";

import { env } from "@/env.mjs";
import { Field, Form, Formik, type FieldProps } from "formik";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { type GetForm } from "@/pages/manage/[formId]";

export default function FormFiller({ FormData }: { FormData: GetForm }) {
  const router = useRouter();
  const successPageLink = `${env.NEXT_PUBLIC_HOST_URL}/success/${FormData?.id}`;

  const validationSchema = useMemo(() => {
    return toFormikValidationSchema(
      responseSchemaGenerator(FormData?.questions ?? [])
    );
  }, [FormData?.questions]);

  const initialValues = useMemo(() => {
    return initialValuesGenerator(FormData?.questions ?? []);
  }, [FormData?.questions]);

  const toast = useToast();
  const FillFormMutation = api.submission.create.useMutation({
    onError(error) {
      console.log(error);
      toast({
        status: "error",
        title: error.message ?? "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSuccess(data) {
      toast({
        title: "Form Filled Successfully",
        status: "success",
      });
      router.push(successPageLink).catch((err) => {
        console.log(err);
      });
    },
  });

  if (!FormData) {
    return <Box>Loading...</Box>;
  }
  console.log("rerender");
  return (
    <div>
      <Text my="3">
        Total{" "}
        <Text as="span" fontWeight="bold">
          {" "}
          {FormData.questions.length}{" "}
        </Text>{" "}
        Questions
      </Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
          FillFormMutation.mutate({ formId: FormData.id, responses: values });
        }}
      >
        <Form>
          <Stack direction={"column"} gap="5">
            {FormData?.questions.map((question) => {
              return (
                <AnswerFiller
                  key={"answer" + question.id}
                  question={question}
                />
              );
            })}
            <Field name="submit_and_reset">
              {({ form }: FieldProps) => (
                <FormControl id="submit_and_reset">
                  <HStack my="5" justifyContent={"flex-start"}>
                    <Button
                      isDisabled={
                        FillFormMutation.isLoading ??
                        !form.isValid ??
                        !form.dirty
                      }
                      isLoading={FillFormMutation.isLoading}
                      colorScheme="teal"
                      type="submit"
                    >
                      Submit Form
                    </Button>
                    <Button
                      isDisabled={FillFormMutation.isLoading}
                      colorScheme="gray"
                      type="button"
                      onClick={() => {
                        form.resetForm();
                      }}
                    >
                      Clear Form
                    </Button>
                  </HStack>
                </FormControl>
              )}
            </Field>
          </Stack>
        </Form>
      </Formik>
    </div>
  );
}
