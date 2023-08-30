import { type RouterOutputs } from "@/utils/api";
import {
  HStack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ReactTimeago from "react-timeago";
import DeleteSubmissionButton from "./DeleteSubmissionBtn";
import ViewSubmissionModal from "./ViewSubmissionModal";
export type GetSubmissions = RouterOutputs["submission"]["getAll"];

const SubmissionsTable = ({
  submissions,
  formId,
}: {
  submissions: GetSubmissions;
  formId: string;
}) => {
  return (
    <Table variant="simple" colorScheme="teal">
      <TableCaption>
        {" "}
        Submissions List {submissions.length === 0 && "Empty"}
      </TableCaption>
      <Thead>
        <Tr>
          <Th>Submitted At</Th>
          <Th>Submission ID</Th>
          <Th>View</Th>
          <Th>Delete</Th>
        </Tr>
      </Thead>
      <Tbody>
        {submissions.map((submission) => (
          <Tr key={submission.id}>
            <Td>
              <ReactTimeago date={submission.submittedAt} />
            </Td>
            <Td>{submission.id}</Td>
            <Td>
              <ViewSubmissionModal submissionId={submission.id} />
            </Td>
            <Td>
              <DeleteSubmissionButton
                formId={formId}
                submissionId={submission.id}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default SubmissionsTable;
