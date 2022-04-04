import type { ShoppingItemProps } from '~/@types/ShoppingItem';

let data: ShoppingItemProps[];

declare global {
  var __db: ShoppingItemProps[];
}

if (!global.__db) {
  global.__db = [
    {
      id: '1',
      name: 'Potato',
      price: 0.99,
    },
    {
      id: '2',
      name: 'Strawberry',
      price: 1.99,
    },
  ];
}
data = global.__db;

export { data };
