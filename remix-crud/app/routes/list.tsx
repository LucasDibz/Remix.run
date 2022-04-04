import { useEffect, useRef } from 'react';
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useLoaderData,
  useTransition,
} from 'remix';

import type { ShoppingItemProps } from '~/@types/ShoppingItem';
import { ShoppingItem } from '~/components/ShoppingItem';

import { db } from '~/utils/fakeDb.server';

export const loader: LoaderFunction = async () => {
  return await db.findMany();
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  // const { _action, values } = Object.fromEntries(formData);

  const _action = body.get('_action');

  switch (_action) {
    case 'create': {
      const name = String(body.get('name'));
      const price = Number(body.get('price'));
      const id = name;
      const item = { id, name, price };

      return await db.create(item);
    }

    case 'delete': {
      try {
        const id = String(body.get('itemId'));

        return await db.delete(id);
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
    <div className='p-4'>
      <h1 className='font-bold text-lg'>Shopping List:</h1>

      <ul className='flex flex-col gap-2 justify-center items-end w-1/4 border-2 rounded-md'>
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

      <Form replace method='post' ref={formRef} className='flex gap-2 w-1/3'>
        <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type='text'
          name='name'
          placeholder='Item name'
          ref={inputRef}
        />
        <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type='number'
          name='price'
          placeholder='Price'
          step='0.01'
        />
        <button
          className='bg-transparent hover:bg-stone-500 text-stone-700 font-semibold hover:text-white ml-2 px-2 border border-stone-500 hover:border-transparent rounded'
          name='_action'
          value='create'
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </Form>
    </div>
  );
}
