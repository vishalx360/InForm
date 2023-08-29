import { type GetForm } from "@/pages/manage/[formId]";
import { api } from "@/utils/api";
import { Button, useToast } from "@chakra-ui/react";

export default function DeleteQuestionButton({
  questionId,
  formId,
}: {
  questionId: string;
  formId: string;
}) {
  const utils = api.useContext();
  const DeleteQuestionMutation = api.question.delete.useMutation();
  const toast = useToast();
  const HandelDelete = () => {
    DeleteQuestionMutation.mutate(
      { questionId },
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
          utils.form.get.setData({ formId }, (previousForm) => {
            if (!previousForm) return previousForm;
            return {
              ...previousForm,
              questions: previousForm.questions.filter(
                (question) => question.id !== questionId
              ),
            } as GetForm;
          });
          toast({
            title: "Deleted Question",
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
      isLoading={DeleteQuestionMutation.isLoading}
      size="xs"
      variant="outline"
    >
      Remove Question
    </Button>
  );
}
