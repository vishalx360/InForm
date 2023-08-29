import DashboardLayout from "@/components/DashboardLayout";
import FormGrid, { FormRowSkeleton } from "@/components/FormGrid";
import { SearchInput } from "@/components/SearchInput";
import CreateNewFormBtn from "@/modules/Global/CreateNewFormBtn";
import { api, type RouterOutputs } from "@/utils/api";
import { HStack, LinkBox, LinkOverlay, Stack } from "@chakra-ui/react";
import { LucideArrowLeft } from "lucide-react";
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

export type GetAllForms = RouterOutputs["form"]["getAll"];

function SearchResultPage() {
  const router = useRouter();
  const { query } = router.query;
  const { data, isLoading } = api.form.search.useQuery({
    query: query as string,
  });
  return (
    <DashboardLayout>
      <section className="container py-10">
        <LinkBox>
          <HStack my="5">
            <LucideArrowLeft />
            <LinkOverlay
              as={NextLink}
              href="/dashboard"
              className=" hover:underline"
            >
              My Forms
            </LinkOverlay>
          </HStack>
        </LinkBox>
        <Stack
          direction={["column", "column", "row", "row"]}
          justify="space-between"
          gap="5"
          mb={5}
        >
          <Stack direction={["column", "column", "row", "row"]} gap="5">
            <h1 className=" text-2xl font-medium capitalize">Search Results</h1>
            <SearchInput />
          </Stack>
          <CreateNewFormBtn />
        </Stack>
        {isLoading ? (
          <FormRowSkeleton amount={10} />
        ) : (
          <FormGrid forms={data} />
        )}
      </section>
    </DashboardLayout>
  );
}

export default SearchResultPage;

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
