import { env } from "@/env.mjs";
import { type GetAllForms } from "@/pages/dashboard";
import {
  Box,
  Button,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { LucideLink } from "lucide-react";
import NextLink from "next/link";
import TimeAgo from "react-timeago";

function FormPreview({ form }: { form: GetAllForms[0] }) {
  const { onCopy, hasCopied } = useClipboard(
    `${env.NEXT_PUBLIC_HOST_URL}/form/${form.id}`
  );

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
      <Heading size="md" my="2">
        <LinkOverlay as={NextLink} href={`/manage/${form.id}`}>
          {form.title}
        </LinkOverlay>
      </Heading>
      <Text noOfLines={2} mb="3">
        {form.description}
      </Text>
      <Box>
        <TimeAgo date={form.createdAt} />
      </Box>
      <HStack justifyContent="flex-end">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<LucideLink size="16" />}
          onClick={onCopy}
          color="teal.400"
          fontWeight="bold"
        >
          {hasCopied ? "Copied!" : "Copy Form Link"}
        </Button>
      </HStack>
    </LinkBox>
  );
}

export default FormPreview;

export function FormPreviewSkeleton() {
  return (
    <div className="border-1 h-64  min-h-[60px] w-32 animate-pulse rounded-xl border-gray-400 bg-gray-400/50 p-2  px-4 py-3 shadow" />
  );
}
