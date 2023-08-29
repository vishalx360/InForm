import { api, type RouterOutputs } from "@/utils/api";
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
import { LucidePlus } from "lucide-react";
import {
  default as QuestionEditor,
  QuestionTypeTagIconMap,
} from "./QuestionEditor";
import { type GetForm } from "@/pages/manage/[formId]";

function FormEditor({ FormData }: { FormData: GetForm }) {
  if (!FormData) {
    return <Box>Loading...</Box>;
  }
  return (
    <div>
      <Text my="3">
        Total{" "}
        <Text as="span" fontWeight="bold">
          {" "}
          {FormData.questions.length}{" "}
        </Text>{" "}
        Questions Added
      </Text>
      <Stack direction={"column"} gap="5">
        {FormData?.questions.map((question) => {
          return <QuestionEditor key={question.id} question={question} />;
        })}
      </Stack>
      <AddQuestionButton formId={FormData.id} />
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
          {Object.entries(QuestionTypeTagIconMap).map(([key, value]) => {
            const Icon = value.icon;
            return (
              <MenuItem
                key={key}
                onClick={() => {
                  HandelAdd(key as Question["type"]);
                }}
              >
                <Icon className="mr-2" /> {value.text}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Box>
  );
}

export default FormEditor;
