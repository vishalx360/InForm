import Link from "next/link";
import React from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <MainNav />
      <Container minH="90vh" maxW={"7xl"} mt={16}>
        {children}
      </Container>
    </main>
  );
}

export default DashboardLayout;

import getGravatar from "@/utils/getGravatar";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

function MainNav() {
  const { data: session } = useSession();

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box
        position="fixed"
        top="0"
        w="full"
        zIndex={100}
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
      >
        <Container maxW={"7xl"}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <Link href="/dashboard">
              <Heading size="md">InForm</Heading>
            </Link>
            <Flex alignItems={"center"}>
              <Stack direction={"row"} spacing={7}>
                <Button onClick={toggleColorMode}>
                  {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                </Button>
                {session?.user ? (
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      <Avatar
                        size={"sm"}
                        src={
                          session?.user.image ??
                          getGravatar(session?.user.email ?? "")
                        }
                      />
                    </MenuButton>
                    <MenuList alignItems={"center"}>
                      <Box px="4">
                        <Text>Logged in as</Text>
                        <Text fontWeight={"bold"}>{session?.user.email}</Text>
                      </Box>
                      <MenuDivider />
                      <Link href="/dashboard">
                        <MenuItem fontWeight="bold">Dashboard</MenuItem>
                      </Link>
                      <Link href="/api/auth/signout">
                        <MenuItem color="red.500" fontWeight="bold">
                          Logout
                        </MenuItem>
                      </Link>
                    </MenuList>
                  </Menu>
                ) : (
                  <div className="flex items-center gap-5">
                    <Link className="hover:underline" href="/signin">
                      Signin
                    </Link>
                    <Link className="hover:underline" href="/signup">
                      Signup
                    </Link>
                  </div>
                )}
              </Stack>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
