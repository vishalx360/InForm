import { env } from "@/env.mjs";
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Link, Text, useClipboard } from '@chakra-ui/react';
import { LucideLink } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Center,
  IconButton,
  Stack
} from '@chakra-ui/react';


export default function SuccessPage() {
  const router = useRouter();
  const formId = router.query.formId as string;
  const formLink = `${env.NEXT_PUBLIC_HOST_URL}/form/${formId}`;
  const { onCopy, hasCopied } = useClipboard(formLink)

  return (
    <Center h="100vh">
      <Stack maxW="md" borderWidth="1px" borderRadius="lg" overflow="hidden">

        <Box p="6" textAlign="center">

          <CheckCircleIcon boxSize={'50px'} color={'green.500'} />

          <Heading as="h2" size="xl" mt={6} mb={2}>
            Form submitted successfully!
          </Heading>

          <Text>Want to submit another response?</Text>

          <Button variant="link" colorScheme="teal" mt={2}>
            Click here
          </Button>

        </Box>

        <Stack direction="column" align="center" bg="gray.50" p={6}>

          <Stack direction="row" align="center">
            <Text>Share this form with others</Text>

            <Button
              leftIcon={<LucideLink size="10" />}
              onClick={onCopy}
              variant={"link"}
              size="xs"
              colorScheme={hasCopied ? "green" : "gray"}
              aria-label={hasCopied ? "Copied link" : "Copy link"}
            >{hasCopied ? "Copied link" : "Copy link"}</Button>
          </Stack>

          <Text mt={2}>
            Want to create your own forms? <Link
              textDecoration="underline"
              as={NextLink} href="/signup">Sign up</Link>
          </Text>

        </Stack>

      </Stack>
    </Center>
  )
}