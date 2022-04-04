import type { ShoppingItemProps } from '~/@types/ShoppingItem';

import { data } from './inMemoryDb.server';
import { randomDelay } from './delay';

const db = {
  findMany: async () => {
    // Random delay to simulate real world
    await randomDelay();

    return data;
  },
  create: async (item: ShoppingItemProps) => {
    // Random delay to simulate real world
    await randomDelay();

    return data.push(item);
  },
  delete: async (itemId: string) => {
    // Random delay to simulate real world
    await randomDelay();

    // Random problem chance
    if (Math.random() > 0.7) throw new Error('Deleting...KABOOM!');

    const id = data.findIndex((item) => item.id === itemId);

    return data.splice(id, 1);
  },
};

export { db };
