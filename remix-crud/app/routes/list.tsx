import { useEffect, useRef } from 'react';
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useLoaderData,
  useTransition,
} from 'remix';

import { db } from '~/utils/db.server';
import { randomDelay } from '~/utils/delay';

import { ShoppingItem } from '~/components/ShoppingItem';

import { ShoppingItemProps } from '~/@types/ShoppingItem';

export const loader: LoaderFunction = async () => {
  return await db.shoppingItems.findMany();
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  // const { _action, values } = Object.fromEntries(formData);

  const _action = body.get('_action');

  switch (_action) {
    case 'create': {
      // Random delay to simulate real world
      await randomDelay();

      const name = String(body.get('name'));
      const price = Number(body.get('price'));
      const item = { name, price };

      return await db.shoppingItems.create({
        data: item,
      });
    }

    case 'delete': {
      // Random delay to simulate real world
      await randomDelay();

      try {
        // Random problem chance
        if (Math.random() > 0.8) throw new Error('Deleting...KABOOM!');

        const id = String(body.get('itemId'));

        return await db.shoppingItems.delete({ where: { id } });
      } catch (error) {
        return { error: true };
      }
    }
  }
};

export default function List() {
  const data = useLoaderData<ShoppingItemProps[]>();

  const transition = useTransition();

  const isAdding =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_action') === 'create';

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [isAdding]);

  return (
    <div>
      <h2>Shopping List:</h2>

      <ul>
        {data.map((item) => (
          <ShoppingItem key={item.id} item={item} />
        ))}

        {/* Optimistic UI */}
        {isAdding && (
          <ShoppingItem
            isOptimistic
            item={{
              id: Math.random().toString(32).slice(2),
              name: transition.submission.formData.get('name') as string,
              price: Number(transition.submission.formData.get('price')),
            }}
          />
        )}
      </ul>

      <Form replace method='post' ref={formRef}>
        <input type='text' name='name' placeholder='Item name' ref={inputRef} />{' '}
        <input type='number' name='price' placeholder='Price' step='any' />{' '}
        <button name='_action' value='create' disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </Form>
    </div>
  );
}
