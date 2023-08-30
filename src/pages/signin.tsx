import { type GetServerSidePropsContext } from "next";
import { getSession, signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { SigninSchema } from "@/utils/ValidationSchema";
import { useToast } from "@chakra-ui/react";
import { Field, Form, Formik, type FieldProps } from "formik";
import { LucideArrowRight } from "lucide-react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import DashboardLayout from "@/components/DashboardLayout";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

async function handelOauthSignin(provider: string) {
  await signIn(provider);
}

export default function SimpleCard() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handelCredentialSignin = useCallback(
    async (credentails: { email: string; password: string }) => {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: credentails.email,
        password: credentails.password,
        redirect: false,
      });
      setIsLoading(false);
      if (result?.ok) {
        toast({
          title: "Login successful!",
          status: "success",
          description: "Taking you to your dashboard",
        });
        await router.push("/dashboard").catch((err) => console.log(err));
      } else {
        toast({
          status: "error",
          title: result?.error ?? "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          // action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    },
    [router, toast]
  );
  return (
    <DashboardLayout>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Head>
          <title>InForm | Sign in</title>
        </Head>
        <Stack spacing={8} mx={"auto"} w="lg" maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              To manage your forms
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
                email: "",
                password: "",
              }}
              validationSchema={toFormikValidationSchema(SigninSchema)}
              onSubmit={handelCredentialSignin}
            >
              <Form className="space-y-4 md:space-y-6">
                <Stack spacing={4}>

                  <Field name="test-login-btn">
                    {({ field, meta, form }: FieldProps) => {
                      return (
                        <FormControl id="test-login">
                          <FormHelperText>Want to test the application ? Click on the button below</FormHelperText>
                          <Button size="sm" mt="2" onClick={() => {
                            form.setFieldValue("email", "test@test.com").catch(err => { console.log(err) })
                            form.setFieldValue("password", "test@test.com").catch(err => { console.log(err) })
                          }}>
                            Fill Test credentials
                          </Button>
                        </FormControl>
                      )
                    }}
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
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      align={"start"}
                      justify={"space-between"}
                    >
                      <Checkbox>Remember me</Checkbox>
                      <Text color={"teal.400"}>Forgot password?</Text>
                    </Stack>
                    <Button
                      type="submit"
                      colorScheme="teal"
                      leftIcon={<LucideArrowRight />}
                      isLoading={isLoading}
                      loadingText="Checking credentials..."
                    >
                      Sign in
                    </Button>
                  </Stack>
                  <Button
                    onClick={() => {
                      void handelOauthSignin("github");
                    }}
                    variant="outline"
                    // className="text-md flex w-full items-center justify-center gap-4"
                    size="md"
                    leftIcon={<FaGithub />}
                  >
                    Continue with Github
                  </Button>

                  <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                    Dont have an account yet ?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-black hover:underline dark:text-teal-500"
                    >
                      Sign Up
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
