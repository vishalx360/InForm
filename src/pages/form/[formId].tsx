import FormFillLayout from "@/components/FillFormLayout";
import FormFiller from "@/modules/FillPage/FormFiller";
import { api } from "@/utils/api";
import { Box, Heading, Text } from "@chakra-ui/react";
import { LucideLoader } from "lucide-react";
import Error from "next/error";
import { useRouter } from "next/router";

function FormFillPage() {
  const router = useRouter();
  const { data: FormData, error } = api.submission.getPublicForm.useQuery(
    { formId: router.query?.formId as string },
    { enabled: Boolean(router.query.formId) }
  );

  if (error) {
    return (
      <Error statusCode={error.data?.httpStatus ?? 500} title={error.message} />
    );
  }
  return (
    <FormFillLayout>
      <Box className="p-5">
        {FormData ? (
          <Box>
            <Box my="5">
              <Heading>{FormData.title}</Heading>
              <Text mt="3" fontSize="md">
                {" "}
                {FormData.description}
              </Text>
              <Text mt="3" fontSize="md">
                Created : {FormData.createdAt.toDateString()}
              </Text>
            </Box>
            {FormData && <FormFiller FormData={FormData} />}
          </Box>
        ) : (
          <div className="flex h-screen items-center justify-center">
            <div className="animate-spin ">
              <LucideLoader />
            </div>
          </div>
        )}
      </Box>
    </FormFillLayout>
  );
}

export default FormFillPage;
