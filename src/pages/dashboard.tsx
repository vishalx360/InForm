import DashboardLayout from "@/components/DashboardLayout";
import FormGrid, { FormRowSkeleton } from "@/components/FormGrid";
import { type RouterOutputs, api } from "@/utils/api";
import { Button, HStack, useToast } from "@chakra-ui/react";
import { LucidePlus } from "lucide-react";
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

export type GetAllForms = RouterOutputs["form"]["getAll"];

function Dashboard() {
  const toast = useToast();
  const { data, isLoading } = api.form.getAll.useQuery();
  const CreateNewForm = api.form.create.useMutation();
  const router = useRouter();
  function handelCreateNewForm() {
    CreateNewForm.mutate(undefined, {
      onSuccess: (data) => {
        toast({
          title: "Created a black form",
          status: "success",
          description: "Taking you to your new form",
        });
        router.push(`/manage/${data.id}`).catch((err) => {
          toast({
            title: "Error Navigateing to new form",
            status: "warning",
          });
        });
      },
      onError: (error) => {
        toast({
          title: error.message ?? "Uh oh! Something went wrong.",
          status: "error",
        });
        console.log(error);
      },
    });
  }
  return (
    <DashboardLayout>
      <section className="container py-10">
        <HStack justify="space-between" gap="5" mb={5}>
          <h1 className=" text-2xl font-medium capitalize">My Forms</h1>
          <Button
            isLoading={CreateNewForm.isLoading}
            colorScheme="telegram"
            variant="solid"
            size="sm"
            leftIcon={<LucidePlus />}
            onClick={handelCreateNewForm}
          >
            Create New Form
          </Button>
        </HStack>
        {isLoading ? (
          <FormRowSkeleton amount={10} />
        ) : (
          <FormGrid forms={data} />
        )}
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;

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
