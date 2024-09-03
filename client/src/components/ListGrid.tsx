import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Box,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
  Flex,
  Text,
  Badge,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  AddIcon,
  CheckIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import ListForm from "./ListForm";
import ItemForm from "./ItemForm";
import axios from "axios";

interface List {
  id: string;
  name: string;
}

interface Item {
  id: string;
  name: string;
  status: boolean; // true for "Pego", false for "Não Pego"
}

const ListGrid: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemsByList, setItemsByList] = useState<{ [key: string]: Item[] }>({});
  const [listFilters, setListFilters] = useState<{ [key: string]: string }>({});
  const {
    isOpen: isListOpen,
    onOpen: openListModal,
    onClose: closeListModal,
  } = useDisclosure();
  const {
    isOpen: isItemOpen,
    onOpen: openItemModal,
    onClose: closeItemModal,
  } = useDisclosure();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const result = await axios.get("http://localhost:5000/api/lists");
      const listsData: List[] = result.data;

      const itemsPromises = listsData.map(async (list: List) => {
        const itemsResult = await axios.get(
          `http://localhost:5000/api/lists/${list.id}/items`
        );
        return { listId: list.id, items: itemsResult.data };
      });

      const itemsData = await Promise.all(itemsPromises);
      const itemsByListData = itemsData.reduce<{ [key: string]: Item[] }>(
        (acc, { listId, items }) => {
          acc[listId] = items;
          return acc;
        },
        {}
      );

      setLists(listsData);
      setItemsByList(itemsByListData);

      // Set default filters for each list
      const defaultFilters = listsData.reduce<{ [key: string]: string }>(
        (acc, list) => {
          acc[list.id] = "all"; // Set default filter to "all"
          return acc;
        },
        {}
      );
      setListFilters(defaultFilters);
    } catch (error) {
      console.error("Failed to fetch lists:", error);
    }
  };

  const handleListAction = (list?: List) => {
    setSelectedList(list || null);
    openListModal();
  };

  const handleItemAction = (item?: Item) => {
    setSelectedItem(item || null);
    openItemModal();
  };

  const handleListSuccess = () => {
    fetchLists();
    closeListModal();
  };

  const handleItemSuccess = () => {
    fetchLists();
    closeItemModal();
  };

  const updateItemStatus = async (item: Item) => {
    try {
      const updatedStatus = !item.status;
      await axios.put(`http://localhost:5000/api/items/${item.id}`, {
        name: item.name,
        status: updatedStatus,
      });
      fetchLists();
    } catch (error) {
      console.error("Failed to update item status:", error);
    }
  };

  const handleFilterChange = (listId: string, value: string) => {
    setListFilters((prevFilters) => ({ ...prevFilters, [listId]: value }));
  };

  return (
    <>
      <Flex direction="column" align="center" mb={4}>
        <Button leftIcon={<AddIcon />} onClick={() => handleListAction()}>
          Criar Nova Lista
        </Button>
      </Flex>

      <Grid
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        gap={4}
        mt={4}
      >
        {lists.map((list) => (
          <Box
            key={list.id}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            bg="white"
          >
            <Flex justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold">
                {list.name}
              </Text>
              <Flex>
                <IconButton
                  aria-label="Editar Lista"
                  icon={<EditIcon />}
                  onClick={() => handleListAction(list)}
                />
                <IconButton
                  aria-label="Deletar Lista"
                  icon={<DeleteIcon />}
                  ml={2}
                  onClick={async () => {
                    try {
                      await axios.delete(
                        `http://localhost:5000/api/lists/${list.id}`
                      );
                      fetchLists();
                    } catch (error) {
                      console.error("Failed to delete list:", error);
                    }
                  }}
                />
              </Flex>
            </Flex>
            <Button
              mt={2}
              colorScheme="teal"
              onClick={() => {
                setSelectedList(list);
                openItemModal();
              }}
            >
              Adicionar Item
            </Button>
            <Flex mb={2} mt={2} align="center">
              <Text mr={2}>Filtrar:</Text>
              <Select
                value={listFilters[list.id] || "all"}
                onChange={(e) => handleFilterChange(list.id, e.target.value)}
                width="auto"
              >
                <option value="all">Todos</option>
                <option value="completed">Pegos</option>
                <option value="notCompleted">Não Pegos</option>
              </Select>
            </Flex>
            <Grid
              templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
              gap={2}
              mt={2}
            >
              {(itemsByList[list.id] || [])
                .filter(
                  (item) =>
                    listFilters[list.id] === "all" ||
                    (listFilters[list.id] === "completed"
                      ? item.status
                      : !item.status)
                )
                .map((item) => (
                  <Box
                    key={item.id}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    bg="gray.100"
                  >
                    <Flex justify="space-between" align="center">
                      <Text>{item.name}</Text>
                      <Badge
                        colorScheme={item.status ? "green" : "red"}
                        fontSize="sm"
                      >
                        {item.status ? "Pegos" : "Não Pegos"}
                      </Badge>
                    </Flex>
                    <Flex justify="space-between" mt={2}>
                      <IconButton
                        aria-label="Editar Item"
                        icon={<EditIcon />}
                        onClick={() => handleItemAction(item)}
                      />
                      <IconButton
                        aria-label={
                          item.status
                            ? "Marcar como Não Pego"
                            : "Marcar como Pego"
                        }
                        icon={item.status ? <CloseIcon /> : <CheckIcon />}
                        ml={2}
                        onClick={() => updateItemStatus(item)}
                      />
                      <IconButton
                        aria-label="Deletar Item"
                        icon={<DeleteIcon />}
                        ml={2}
                        onClick={async () => {
                          try {
                            await axios.delete(
                              `http://localhost:5000/api/items/${item.id}`
                            );
                            fetchLists();
                          } catch (error) {
                            console.error("Failed to delete item:", error);
                          }
                        }}
                      />
                    </Flex>
                  </Box>
                ))}
            </Grid>
          </Box>
        ))}
      </Grid>

      <Modal isOpen={isListOpen} onClose={closeListModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedList ? "Editar Lista" : "Nova Lista"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ListForm list={selectedList} onSuccess={handleListSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isItemOpen} onClose={closeItemModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedItem ? "Editar Item" : "Novo Item"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ItemForm
              item={selectedItem}
              listId={selectedList?.id || ""}
              onSuccess={handleItemSuccess}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListGrid;
