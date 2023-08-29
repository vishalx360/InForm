import { Container } from "@chakra-ui/react";
import React from "react";

export default function FormFillLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Container minH="90vh" maxW={"7xl"}>
        {children}
      </Container>
    </main>
  );
}

