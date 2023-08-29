import { type GetForm } from "@/pages/manage/[formId]";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

function DeleteFormSection({ formId }: { formId: string }) {
  const [inputText, setInputText] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const DeleteFormMutation = api.form.delete.useMutation({
    onError(error) {
      console.log(error);
      toast({
        status: "error",
        title: error.message ?? "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSuccess: async () => {
      toast({ title: "Deleted Form Successfully", status: "success" });
      await router.push("/dashboard").catch((err) => console.log(err));
    },
  });

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);
    setIsButtonEnabled(text === "DELETE FORM");
  };

  const handleDeleteClick = () => {
    // Implement your delete form logic here
    console.log("Form deleted!");
    DeleteFormMutation.mutate({ formId });
  };

  return (
    <Box mt="8">
      <Text fontWeight="bold">Danger Zone</Text>
      <Divider my="3" />
      <FormControl>
        <FormLabel>Delete Form Confirmation</FormLabel>
        <HStack>
          <Input type="text" value={inputText} onChange={handleInputChange} />
          <Button
            isLoading={DeleteFormMutation.isLoading}
            colorScheme="red"
            onClick={handleDeleteClick}
            isDisabled={!isButtonEnabled}
          >
            Delete Form
          </Button>
        </HStack>
        <FormHelperText>
          Please write &quot;DELETE FORM&quot; to delete form{" "}
        </FormHelperText>
      </FormControl>
    </Box>
  );
}

export default DeleteFormSection;
