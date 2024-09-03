import React from "react";
import { Flex, Heading } from "@chakra-ui/react";

const Navbar: React.FC = () => {
  return (
    <Flex
      as="nav"
      p={4}
      bg="teal.500"
      color="white"
      align="center"
      boxShadow="md"
      position="fixed"
      width="100%"
      top="0"
      zIndex="sticky"
      justify="space-between"
    >
      <Heading size="lg" fontFamily="Segoe UI" fontWeight="bold">
        Smart Check List
      </Heading>
    </Flex>
  );
};

export default Navbar;
