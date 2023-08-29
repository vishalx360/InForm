import { type RouterOutputs } from "@/utils/api";
import {
  Button,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ReactTimeago from "react-timeago";
import ViewSubmissionModal from "./ViewSubmissionModal";
import Link from "next/link";
import { env } from "@/env.mjs";
export type GetSubmissions = RouterOutputs["form"]["getSubmissions"];

const SubmissionsTable = ({ submissions }: { submissions: GetSubmissions }) => {
  return (
    <Table variant="simple" colorScheme="teal">
      <TableCaption> Submissions List</TableCaption>
      <Thead>
        <Tr>
          <Th>Submitted At</Th>
          <Th>Submission ID</Th>
          <Th>Action</Th>
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
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default SubmissionsTable;
