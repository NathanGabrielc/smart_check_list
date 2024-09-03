import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
} from "@chakra-ui/react";
import axios from "axios";

interface ItemFormProps {
  listId: string;
  item?: {
    id: string;
    name: string;
    status: boolean;
  } | null;
  onSuccess: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ listId, item, onSuccess }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setStatus(item.status);
    } else {
      setName("");
      setStatus(false);
    }
  }, [item]);

  const handleSubmit = async () => {
    try {
      if (item) {
        // Update item
        await axios.put(`http://localhost:5000/api/items/${item.id}`, {
          name,
          status,
        });
      } else {
        // Create new item
        await axios.post("http://localhost:5000/api/items", {
          name,
          status,
          listId,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  return (
    <FormControl>
      <FormLabel>Nome do Item</FormLabel>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do item"
      />
      <FormLabel>Status</FormLabel>
      <Select
        value={status ? "pego" : "nao_pego"}
        onChange={(e) => setStatus(e.target.value === "pego")}
      >
        <option value="nao_pego">Não Pego</option>
        <option value="pego">Pego</option>
      </Select>
      <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
        {item ? "Salvar" : "Adicionar"}
      </Button>
    </FormControl>
  );
};

export default ItemForm;
