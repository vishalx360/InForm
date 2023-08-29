import DashboardLayout from "@/components/DashboardLayout";
import { env } from "@/env.mjs";
import FormEditor from "@/modules/ManagePage/FormEditor";
import SettingsTab from "@/modules/SettingsTab";
import SubmissionsTab from "@/modules/SubmissionsTab";
import { api, type RouterOutputs } from "@/utils/api";
import {
  Box,
  Button,
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
  useClipboard,
} from "@chakra-ui/react";
import { LucideArrowLeft, LucideLink, LucideLoader } from "lucide-react";
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Error from "next/error";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ReactTimeago from "react-timeago";

export type GetForm = RouterOutputs["form"]["get"];

function FormManagePage() {
  const router = useRouter();
  const { data: FormData, error } = api.form.get.useQuery(
    { formId: router.query?.formId as string },
    { enabled: Boolean(router.query.formId) }
  );
  const { onCopy, hasCopied } = useClipboard(
    `${env.NEXT_PUBLIC_HOST_URL}/form/${router.query.formId as string}`
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
              <HStack justifyContent="space-between">
                <Text mb="3" fontSize="md">
                  Created :{" "}
                  <ReactTimeago date={FormData.createdAt.toDateString()} />
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  mt="2"
                  leftIcon={<LucideLink size="16" />}
                  onClick={onCopy}
                  colorScheme="teal"
                  fontWeight="bold"
                >
                  {hasCopied ? "Copied!" : "Copy Form Link"}
                </Button>
              </HStack>
              <Box my="4">
                <Heading>{FormData?.title}</Heading>
                <Text mt="3" fontSize="md">
                  {FormData?.description}
                </Text>
              </Box>
            </Box>
            <Tabs colorScheme="teal" variant="line">
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
                  <SubmissionsTab formId={FormData.id} />
                </TabPanel>
                <TabPanel>
                  <SettingsTab FormData={FormData} />
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
