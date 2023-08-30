import { FormRowSkeleton } from "@/components/FormGrid";
import { api } from "@/utils/api";
import Error from "next/error";
import SubmissionTable from "./SubmissionTable";

export default function SubmissionsTab({ formId }: { formId: string }) {
  const {
    data: submissions,
    error,
    isLoading,
  } = api.submission.getAll.useQuery({ formId }, { enabled: Boolean(formId) });
  if (error) {
    return (
      <Error statusCode={error.data?.httpStatus ?? 500} title={error.message} />
    );
  }
  if (isLoading) {
    return <FormRowSkeleton amount={5} />;
  }
  return (
    <div>
      <SubmissionTable formId={formId} submissions={submissions} />
    </div>
  );
}
