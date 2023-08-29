import {
  Container,
  IconButton,
  Link,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "lucide-react";
import NextLink from "next/link";
import React from "react";

export default function FormFillLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <main>
      <div className="fixed top-0 z-50 flex w-full items-center  justify-between bg-teal-700 px-5 ">
        <Link
          as={NextLink}
          className="p-2 font-bold"
          color={colorMode === "light" ? "white" : "white"}
          href="/"
        >
          InForm{" "}
          <span className="font-normal"> | Open Source Form Creator </span>
        </Link>
        <IconButton
          variant="ghost"
          aria-label="change theme"
          colorScheme="whiteAlpha"
          color="white"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          size="xs"
          onClick={toggleColorMode}
        />
      </div>
      <Container minH="90vh" my="10" maxW={"7xl"}>
        {children}
      </Container>
      <div className="flex items-center justify-center bg-teal-900 p-2 ">
        <Text color={colorMode === "light" ? "white" : "white"}>
          Created by
          <NextLink
            target="_blank"
            className="font-bold"
            href="https://vishalx360.dev"
          >
            {" "}
            Vishal Kumar
          </NextLink>{" "}
          |{" "}
          <NextLink target="_blank" href="https://github.com/vishalx360/inform">
            Github
          </NextLink>
        </Text>
      </div>
    </main>
  );
}
