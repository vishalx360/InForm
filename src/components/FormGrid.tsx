import { type GetAllForms } from "@/pages/dashboard";
import { Box } from "@chakra-ui/react";
import FormPreview, { FormPreviewSkeleton } from "./FormPreview";

function FormGrid({ forms }: { forms: GetAllForms | undefined }) {
  if (!forms)
    return (
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-medium capitalize">Loading...</h1>
        <div className="flex flex-wrap items-center gap-5">
          <FormPreviewSkeleton />
        </div>
      </div>
    );
  return (
    <div className="my-8">
      {forms?.length > 0 ? (
        <div className="flex flex-wrap items-center gap-5">
          {forms?.map((form, index) => (
            <FormPreview key={index} form={form} />
          ))}
        </div>
      ) : (
        <Box
          bg={"Background"}
          className="flex h-[300px] items-center justify-center rounded-xl"
        >
          No Forms found
        </Box>
      )}
    </div>
  );
}

export default FormGrid;

export function FormRowSkeleton({ amount }: { amount: number }) {
  const FormSkeleton = [];
  for (let i = 0; i < amount; i++) {
    FormSkeleton.push(<FormPreviewSkeleton key={"skeleton" + i} />);
  }
  return (
    <div className="mb-8">
      <h1 className="mb-4 text-2xl font-medium capitalize">Loading...</h1>
      <div className="flex flex-wrap items-center gap-5">{FormSkeleton}</div>
    </div>
  );
}
