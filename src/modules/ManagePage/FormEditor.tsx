import { type RouterOutputs, api } from "@/utils/api";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { type Question } from "@prisma/client";
import {
  LucideLink,
  LucideListTodo,
  LucidePlus,
  LucideText,
} from "lucide-react";
import { default as QuestionEditor } from "./QuestionEditor";
export type GetForm = RouterOutputs["form"]["get"];

function FormEditor({ form }: { form: GetForm }) {
  if (!form) {
    return <Box>Loading...</Box>;
  }
  return (
    <div>
      <h1>{form.questions.length} Questions</h1>
      <Stack direction={"column"} gap="5">
        {form?.questions.map((question) => {
          return <QuestionEditor key={question.id} question={question} />;
        })}
      </Stack>
      <AddQuestionButton formId={form.id} />
    </div>
  );
}

function AddQuestionButton({ formId }: { formId: string }) {
  const utils = api.useContext();
  const AddQuestionMutation = api.question.add.useMutation();

  const HandelAdd = (type: Question["type"]) => {
    AddQuestionMutation.mutate(
      { formId, questionType: type },
      {
        onError(error, variables, context) {
          console.log(error);
        },
        onSuccess(data, variables, context) {
          console.log(data);
          utils.form.get.setData({ formId }, (previousForm) => {
            if (!previousForm) return previousForm;
            return {
              ...previousForm,
              questions: [...previousForm.questions, data],
            } as GetForm;
          });
        },
      }
    );
  };
  return (
    <Box mt="10">
      <Menu>
        <MenuButton
          as={Button}
          variant={"outline"}
          cursor={"pointer"}
          minW={0}
          colorScheme="teal"
          leftIcon={<LucidePlus />}
          isLoading={AddQuestionMutation.isLoading}
        >
          Add Question
        </MenuButton>
        <MenuList alignItems={"center"}>
          <Box px="4">
            <Text>Question Type</Text>
          </Box>
          <MenuDivider />
          <MenuItem
            onClick={() => {
              HandelAdd("TEXT");
            }}
          >
            <LucideText className="mr-2" /> Text
          </MenuItem>
          <MenuItem
            onClick={() => {
              HandelAdd("URL");
            }}
          >
            <LucideLink className="mr-2" /> URL
          </MenuItem>
          <MenuItem
            onClick={() => {
              HandelAdd("MULTIPLE_CHOICE");
            }}
          >
            <LucideListTodo className="mr-2" /> Multiple Choice
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}

export default FormEditor;
