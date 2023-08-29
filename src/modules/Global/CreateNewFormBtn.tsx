import { api } from "@/utils/api";
import { Button, useToast } from "@chakra-ui/react";
import { LucidePlus } from "lucide-react";
import { useRouter } from "next/router";

export default function CreateNewFormBtn() {
  const toast = useToast();
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
    <Button
      isLoading={CreateNewForm.isLoading}
      colorScheme="teal"
      variant="solid"
      size="sm"
      rounded="md"
      leftIcon={<LucidePlus />}
      onClick={handelCreateNewForm}
    >
      Create New Form
    </Button>
  );
}
