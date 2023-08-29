import { env } from "@/env.mjs";
import { type GetAllForms } from "@/pages/dashboard";
import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { LucideLink } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import TimeAgo from "react-timeago";

function FormPreview({ form }: { form: GetAllForms[0] }) {
  const router = useRouter();
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
      <Text fontSize={"sm"} color="GrayText" noOfLines={2} mb="3">
        {form.description}
      </Text>

      <Box fontSize={"sm"} color="GrayText">
        {form._count.questions} Questions
      </Box>
      <Box fontSize={"sm"} color="GrayText">
        {form._count.submissions} Submissions
      </Box>
      <Box fontSize={"sm"} color="GrayText">
        Created <TimeAgo date={form.createdAt} />
      </Box>
      <Divider my="5" />
      <HStack justifyContent="flex-end">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<LucideLink size="16" />}
          onClick={onCopy}
          colorScheme="teal"
          fontWeight="bold"
        >
          {hasCopied ? "Copied!" : "Copy Form Link"}
        </Button>

        <Button
          size="sm"
          variant="solid"
          leftIcon={<LucideLink size="16" />}
          onClick={() => {
            router.push(`/manage/${form.id}`).catch((err) => {
              console.log(err);
            });
          }}
          colorScheme="teal"
          fontWeight="bold"
        >
          Manage
        </Button>
      </HStack>
    </LinkBox>
  );
}

export default FormPreview;

export function FormPreviewSkeleton() {
  return (
    <Box
      minW="xs"
      maxW="sm"
      h="200px"
      borderWidth="1px"
      rounded="xl"
      borderColor="gray.400"
      bg="gray.400"
      bgGradient="radial(gray.400/50, transparent)"
      p="2"
      px="4"
      py="3"
      boxShadow="base"
      animation="pulse 2s infinite"
    />
  );
}
