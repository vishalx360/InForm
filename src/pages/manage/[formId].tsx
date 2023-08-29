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
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Error from "next/error";
import NextLink from "next/link";
import { useRouter } from "next/router";


function FormManagePage() {
  const router = useRouter();
  const { data: FormData, error } = api.form.get.useQuery(
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
            <Tabs variant="line">
              <TabList>
                <Tab>Edit Form</Tab>
                <Tab>Responses</Tab>
                <Tab>Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <FormEditor FormData={FormData} />
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

export default FormManagePage;

// make server call to redirect to /signin if not authenticated nextauth
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
