import { api } from "@/utils/api";
import { Button, useToast } from "@chakra-ui/react";
import { LucideTrash } from "lucide-react";

export default function DeleteSubmissionButton({
  submissionId,
  formId,
}: {
  formId: string;
  submissionId: string;
}) {
  const utils = api.useContext();
  const DeleteSubmissionMutation = api.submission.delete.useMutation();
  const toast = useToast();
  const HandelDelete = () => {
    DeleteSubmissionMutation.mutate(
      { submissionId },
      {
        onError(error) {
          console.log(error);
          toast({
            status: "error",
            title: error.message ?? "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            // action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        },
        onSuccess() {
          utils.submission.getAll.setData({ formId }, (previousSubmissions) => {
            if (!previousSubmissions) return previousSubmissions;
            return previousSubmissions.filter(
              (submission) => submission.id !== submissionId
            );
          });
          toast({
            title: "Deleted Submission",
            status: "info",
          });
        },
      }
    );
  };
  return (
    <Button
      onClick={HandelDelete}
      colorScheme="red"
      isLoading={DeleteSubmissionMutation.isLoading}
      size="xs"
      leftIcon={<LucideTrash />}
      variant="link"
    >
      Delete
    </Button>
  );
}
