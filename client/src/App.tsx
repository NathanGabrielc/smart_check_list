import React from "react";
import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListGrid from "./components/ListGrid";

function App() {
  return (
    <Box minH="100vh" bg="gray.100" pt="64px">
      <Navbar />
      <Box px={8} py={10}>
        <Routes>
          <Route path="/" element={<ListGrid />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
