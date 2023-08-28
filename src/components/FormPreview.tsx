import { type GetAllForms } from "@/pages/dashboard";
import {
  Box,
  Button,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import TimeAgo from "react-timeago";

function FormPreview({ form }: { form: GetAllForms[0] }) {
  return (
    <LinkBox
      _hover={{ shadow: "md", bg: "whiteAlpha.200" }}
      bg="whiteAlpha.100"
      as="article"
      minW="xs"
      maxW="sm"
      p="5"
      borderWidth="1px"
      rounded="md"
    >
      <Box>
        <TimeAgo date={form.createdAt} />
      </Box>
      <Heading size="md" my="2">
        <LinkOverlay as={NextLink} href={`/manage/${form.id}`}>
          {form.title}
        </LinkOverlay>
      </Heading>
      <Text noOfLines={2} mb="3">
        {form.description}
      </Text>
      <Button color="teal.400" fontWeight="bold">
        Copy Link
      </Button>
    </LinkBox>
  );
}

export default FormPreview;

export function FormPreviewSkeleton() {
  return (
    <div className="border-1 h-64  min-h-[60px] w-32 animate-pulse rounded-xl border-gray-400 bg-gray-400/50 p-2  px-4 py-3 shadow" />
  );
}
