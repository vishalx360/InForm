import DashboardLayout from "@/components/DashboardLayout";
import FormEditor from "@/modules/ManagePage/FormEditor";
import { api } from "@/utils/api";
import {
  Box,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { LucideArrowLeft, LucideLoader } from "lucide-react";
import Error from "next/error";
import NextLink from "next/link";
import { useRouter } from "next/router";

function MovieDetailsPage() {
  const router = useRouter();
  const { data: form, error } = api.form.get.useQuery(
    { formId: router.query?.formId as string },
    { enabled: Boolean(router.query.formId) }
  );

  if (error) {
    return (
      <Error statusCode={error.data?.httpStatus ?? 500} title={error.message} />
    );
  }
  return (
    <DashboardLayout>
      <Box className="p-5">
        <LinkBox>
          <HStack my="5">
            <LucideArrowLeft />
            <LinkOverlay
              as={NextLink}
              href="/dashboard"
              className=" hover:underline"
            >
              Go back
            </LinkOverlay>
          </HStack>
        </LinkBox>

        {form ? (
          <Box>
            <Box my="5">
              <Heading>{form.title}</Heading>
              <Text mt="3" fontSize="md">
                {" "}
                {form.description}
              </Text>
              <Text mt="3" fontSize="md">
                Created : {form.createdAt.toDateString()}
              </Text>
            </Box>
            <Tabs variant="line">
              <TabList>
                <Tab>Edit Form</Tab>
                <Tab>Responses</Tab>
                <Tab>Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <FormEditor form={form} />
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        ) : (
          <div className="flex h-screen items-center justify-center">
            <div className="animate-spin ">
              <LucideLoader />
            </div>
          </div>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default MovieDetailsPage;
