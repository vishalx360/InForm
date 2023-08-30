import { type GetServerSidePropsContext } from "next";
import { getSession, signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { SignUpSchema } from "@/utils/ValidationSchema";
import { useToast } from "@chakra-ui/react";
import { Field, Form, Formik, type FieldProps } from "formik";
import { LucideArrowRight } from "lucide-react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { api } from "@/utils/api";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";

export default function SimpleCard() {
  const toast = useToast();
  const router = useRouter();

  const mutation = api.authentication.signup.useMutation({
    onError(error) {
      toast({
        status: "error",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSuccess: async () => {
      toast({ title: "Account created successfully!", status: "success" });
      await router.push("/signin").catch((err) => console.log(err));
    },
  });

  async function handelOauthSignin(provider: string) {
    await signIn(provider);
  }
  return (
    <DashboardLayout>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Head>
          <title>InForm | Sign up</title>
        </Head>
        <Stack spacing={8} mx={"auto"} w="lg" maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create new account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              To create custom forms.
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
              }}
              validationSchema={toFormikValidationSchema(SignUpSchema)}
              onSubmit={(values) => {
                mutation.mutate(values);
              }}
            >
              <Form className="space-y-4 md:space-y-6">
                <Stack spacing={4}>
                  <Field name="name">
                    {({ field, meta }: FieldProps) => (
                      <FormControl id="name">
                        <FormLabel>Name</FormLabel>
                        <Input
                          type="text"
                          placeholder="Name"
                          required
                          {...field}
                        />
                        {meta.touched && meta.error && (
                          <p className="ml-2 mt-2 text-sm text-red-500">
                            {meta.error}
                          </p>
                        )}
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email">
                    {({ field, meta }: FieldProps) => (
                      <FormControl id="email">
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          placeholder="name@company.com"
                          required
                          {...field}
                        />
                        {meta.touched && meta.error && (
                          <p className="ml-2 mt-2 text-sm text-red-500">
                            {meta.error}
                          </p>
                        )}
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, meta }: FieldProps) => (
                      <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="password"
                          required
                          {...field}
                        />
                        {meta.touched && meta.error && (
                          <p className="ml-2 mt-2 text-sm text-red-500">
                            {meta.error}
                          </p>
                        )}
                      </FormControl>
                    )}
                  </Field>
                  <Stack spacing={10}>
                    <Button
                      type="submit"
                      colorScheme="teal"
                      leftIcon={<LucideArrowRight />}
                      isLoading={mutation.isLoading}
                      loadingText="Signing up..."
                    >
                      Sign up
                    </Button>
                  </Stack>
                  <Button
                    onClick={() => {
                      void handelOauthSignin("github");
                    }}
                    variant="outline"
                    size="md"
                    leftIcon={<FaGithub />}
                  >
                    Continue with Github
                  </Button>

                  <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                    Already have an account ?{" "}
                    <Link
                      href="/signin"
                      className="font-medium text-black hover:underline dark:text-teal-500"
                    >
                      Sign In
                    </Link>
                  </p>
                </Stack>
              </Form>
            </Formik>
          </Box>
        </Stack>
      </Flex>
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }
  return {
    props: { session },
  };
}
