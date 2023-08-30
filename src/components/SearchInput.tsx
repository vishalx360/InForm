import { searchSchema } from "@/utils/ValidationSchema";
import { Button, Input } from "@chakra-ui/react";
import { Field, Form, Formik, type FieldProps } from "formik";
import { LucideSearch } from "lucide-react";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";

export function SearchInput() {
  const router = useRouter();

  if (!router.isReady) {
    return (
      <div className="border-1 min-h-[60px] w-full max-w-[310px] animate-pulse rounded-xl border-gray-400 bg-gray-400/50 px-4 py-3 shadow" />
    );
  }
  return (
    <div>
      <Formik
        initialValues={{ query: router.query?.query ?? "" }}
        validationSchema={toFormikValidationSchema(searchSchema)}
        onSubmit={async (values) => {
          if (values.query === "") {
            await router.push(`/dashboard`);
          } else {
            await router.push(`/search/${values.query as string}`);
          }
        }}
      >
        <Form>
          <div className="flex w-full  items-center gap-2">
            <Field name="query">
              {({ field }: FieldProps) => (
                <Input
                  size="sm"
                  rounded="md"
                  px="5"
                  type="text"
                  placeholder="Search for a form"
                  id="query"
                  {...field}
                />
              )}
            </Field>
            <Button
              colorScheme="teal"
              variant="solid"
              size="sm"
              rounded="md"
              type="submit"
              leftIcon={<LucideSearch size="15" />}
              px="10"
            >
              Search
            </Button>
          </div>

          {/* <div className="ml-2 mt-2 text-sm text-red-500">
            <ErrorMessage name="name" />
          </div> */}
        </Form>
      </Formik>
    </div>
  );
}
