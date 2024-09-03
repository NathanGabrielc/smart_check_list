export interface List {
  id: string;
  name: string;
  items: Item[];
}

export interface Item {
  id: string;
  list_id: string;
  name: string;
  status: boolean;
}
