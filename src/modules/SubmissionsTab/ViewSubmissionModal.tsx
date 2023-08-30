import { api } from "@/utils/api";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { type $Enums } from "@prisma/client";
import { LucideEye, LucideLoader, LucideText } from "lucide-react";
import Error from "next/error";
import ReactTimeago from "react-timeago";
import { QuestionTypeTagIconMap } from "../ManagePage/QuestionEditor";

export default function ViewSubmissionModal({
  submissionId,
}: {
  submissionId: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    data: submission,
    error,
    isLoading,
  } = api.submission.get.useQuery(
    { submissionId },
    { enabled: Boolean(submissionId && isOpen) }
  );

  if (error) {
    return (
      <Error statusCode={error.data?.httpStatus ?? 500} title={error.message} />
    );
  }
  return (
    <>
      <Button variant="link" leftIcon={<LucideEye />} onClick={onOpen}>
        View Submission
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={"4xl"}>
          <ModalHeader>Submission Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0">
            {isLoading || !submission ? (
              <div className="flex h-52 items-center justify-center">
                <div className="animate-spin ">
                  <LucideLoader />
                </div>
              </div>
            ) : (
              <Box>
                <Box px="6">
                  <Text fontSize="sm" color={"CaptionText"}>
                    {" "}
                    Submitted : <ReactTimeago date={submission.submittedAt} />
                  </Text>
                  <Text fontSize="sm" color={"CaptionText"}>
                    Note: Please be aware that if you delete the original
                    question at the time of this response submission, you will
                    only have access to the answer without the context.
                  </Text>
                </Box>
                {/* <pre>
                  {JSON.stringify(submission?.responses, null, 2)}
                </pre> */}
                <Stack
                  p="5"
                  maxH={"70vh"}
                  overflowY="scroll"
                  direction={"column"}
                  gap="5"
                >
                  {submission?.responses.map((response) => {
                    return (
                      <ResponseBox key={response.id} response={response} />
                    );
                  })}
                </Stack>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
type ResponseType = {
  question: {
    type: $Enums.QuestionType;
    id: string;
    description: string | null;
    text: string;
  } | null;
  id: string;
  text: string;
};
function ResponseBox({ response }: { response: ResponseType }) {
  const question = response.question;
  const TagIcon = question
    ? QuestionTypeTagIconMap[question.type].icon
    : LucideText;

  return (
    <Box borderWidth="1px" bg="whiteAlpha.200" rounded="md" p="4">
      {question ? (
        <>
          <HStack justifyContent="space-between">
            <Tag colorScheme="teal" mb="2">
              <TagIcon size="16" className="mr-2" />
              {QuestionTypeTagIconMap[question.type]?.text}
            </Tag>
          </HStack>
          <Stack dir="col" gap="2">
            <Text>{question.text}</Text>
            {question.description && (
              <Text fontSize="sm" color={"GrayText"}>
                {question.description}
              </Text>
            )}
          </Stack>
        </>
      ) : (
        <Tag colorScheme="red" mb="2">
          <Text color={"CaptionText"}>Question was deleted</Text>
        </Tag>
      )}
      <Text color={"CaptionText"}>Answer: {response.text}</Text>
    </Box>
  );
}
