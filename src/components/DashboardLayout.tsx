import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { SearchInput } from "./SearchInput";
import { UserMenu } from "./UserMenu";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <MainNav />
      {/* <div className="w-full bg-neutral-100 p-2 lg:hidden ">
        <SearchInput />
      </div> */}
      <Container maxW={"7xl"} mt={16}>
        {children}
      </Container>
    </main>
  );
}

export default DashboardLayout;

const pages = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Favorites", path: "/favorites" },
  {
    name: "Github",
    isExternal: true,
    path: "https://github.com/vishalx360/inform",
  },
];
function MainNavx() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <nav className="border-gray-200 bg-neutral-100 dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center">
          <span className="self-center whitespace-nowrap text-2xl font-medium dark:text-white">
            InForm
          </span>
        </Link>
        <div className="hidden lg:block">
          <SearchInput />
        </div>

        <div className="flex items-center justify-center gap-10">
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 p-4 font-medium dark:border-gray-700  dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8  md:border-0 md:p-0 md:dark:bg-gray-900">
              {pages.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center py-2 pl-3 pr-4 underline-offset-2  hover:underline ",
                      currentPath === item.path && "underline"
                    )}
                    target={item.isExternal ? "_blank" : undefined}
                    aria-current="page"
                  >
                    {item.name}
                    {item.isExternal && (
                      <ExternalLinkIcon className="ml-1 inline h-4 w-4" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}


import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
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
  useDisclosure
} from '@chakra-ui/react';
import { useSession } from "next-auth/react";
import getGravatar from "@/utils/getGravatar";

interface Props {
  children: React.ReactNode
}

const NavLink = (props: Props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Box>
  )
}

function MainNav() {
  const { data: session } = useSession();

  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box position="fixed" top="0" w="full" zIndex={100} bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Container maxW={'7xl'}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Link href="/dashboard">
              <Heading size="md">InForm</Heading>
            </Link>
            <Flex alignItems={'center'}>
              <Stack direction={'row'} spacing={7}>
                <Button onClick={toggleColorMode}>
                  {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                </Button>

                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Avatar
                      size={'sm'}
                      src={
                        session?.user.image ?? getGravatar(session?.user.email ?? "")
                      }
                    />
                  </MenuButton>
                  <MenuList alignItems={'center'}>
                    <Box px="4">
                      <Text>Logged in as</Text>
                      <Text fontWeight={"bold"}>{session?.user.email}</Text>
                    </Box>
                    <MenuDivider />
                    <Link href="/api/auth/signout"> <MenuItem color="red.500" fontWeight="bold">Logout</MenuItem> </Link>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </>
  )
}