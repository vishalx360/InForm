import { type GetForm } from "@/pages/manage/[formId]";
import { searchSchema } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, type FieldProps } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import DeleteFormSection from "./DeleteFormSection";

export default function SettingsTab({ FormData }: { FormData: GetForm }) {
  const utils = api.useContext();
  const toast = useToast();
  const UpdateFormMutation = api.form.update.useMutation({
    onError(error) {
      console.log(error);
      toast({
        status: "error",
        title: error.message ?? "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onMutate(data) {
      utils.form.get.setData({ formId: FormData?.id ?? "" }, (previousForm) => {
        if (!previousForm) return previousForm;
        return {
          ...previousForm,
          title: data.title,
          description: data.description,
        } as GetForm;
      });
    },
    onSuccess: (data) => {
      utils.form.get
        .refetch()
        .then((returenData) => {
          toast({
            title: "Updated Form Data",
            status: "info",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  if (!FormData) {
    return <Box>Loading....</Box>;
  }

  return (
    <div>
      <Text fontWeight="bold">Edit Form Details</Text>
      <Divider my="3" />

      <Formik
        initialValues={{
          formId: FormData.id,
          title: FormData?.title,
          description: FormData?.description,
        }}
        validationSchema={toFormikValidationSchema(searchSchema)}
        onSubmit={(values) => {
          console.log(values);
          UpdateFormMutation.mutate(values);
        }}
      >
        <Form>
          <Stack dir="col" gap="2">
            <Field name="title">
              {({ field, meta, form }: FieldProps) => (
                <FormControl
                  id="title"
                  isInvalid={Boolean(meta.touched && meta.error)}
                >
                  <FormLabel>Form Title</FormLabel>
                  <Input
                    type={"text"}
                    autoComplete="off"
                    placeholder="Form Title"
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
                <FormControl
                  id="description"
                  isInvalid={Boolean(meta.touched && meta.error)}
                >
                  <FormLabel>Form Description</FormLabel>
                  <Textarea
                    autoComplete="off"
                    placeholder="Form Description"
                    required
                    // size="lg"
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

            <Field name="reset">
              {({ form }: FieldProps) => (
                <FormControl id="reset">
                  <Button
                    isDisabled={!form.isValid}
                    isLoading={UpdateFormMutation.isLoading}
                    colorScheme="teal"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </FormControl>
              )}
            </Field>
          </Stack>
        </Form>
      </Formik>

      <DeleteFormSection formId={FormData.id} />
    </div>
  );
}
