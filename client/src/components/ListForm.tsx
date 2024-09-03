// ListForm.tsx
import React, { useState, useEffect } from "react";
import { Button, Input, FormControl, FormLabel } from "@chakra-ui/react";
import axios from "axios";

interface ListFormProps {
  list?: { id: string; name: string } | null;
  onSuccess: () => void;
}

const ListForm: React.FC<ListFormProps> = ({ list, onSuccess }) => {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (list) {
      setName(list.name);
    }
  }, [list]);

  const handleSubmit = async () => {
    try {
      if (list) {
        // Atualiza a lista existente
        await axios.put(`http://localhost:5000/api/lists/${list.id}`, { name });
      } else {
        // Cria uma nova lista
        await axios.post("http://localhost:5000/api/lists", { name });
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  return (
    <FormControl>
      <FormLabel>Nome da Lista</FormLabel>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome da lista"
      />
      <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
        {list ? "Atualizar Lista" : "Criar Lista"}
      </Button>
    </FormControl>
  );
};

export default ListForm;
