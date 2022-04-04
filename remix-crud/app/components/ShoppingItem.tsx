import { useFetcher } from 'remix';

import { ShoppingItemProps } from '~/@types/ShoppingItem';

export function ShoppingItem({
  item,
  isOptimistic,
}: {
  item: ShoppingItemProps;
  isOptimistic?: boolean;
}) {
  const fetcher = useFetcher();

  const isDeleting = fetcher.submission?.formData.get('itemId') === item.id;

  const isFailedDeletion = fetcher.data?.error;

  return (
    <li
      hidden={isDeleting}
      key={item.id}
      style={{
        color: isFailedDeletion && 'red',
      }}
    >
      {item.name} - {item.price} €
      <fetcher.Form replace method='post' style={{ display: 'inline-block' }}>
        <input type='hidden' name='itemId' value={item.id} />
        <button
          className='border-2 font-bold hover:brightness-75'
          disabled={isOptimistic}
          name='_action'
          value='delete'
          aria-label='delete'
          style={{
            marginLeft: '.5rem',
            cursor: 'pointer',
          }}
        >
          {isFailedDeletion ? 'Retry' : '✖'}
        </button>
      </fetcher.Form>
      <span>{isFailedDeletion && isFailedDeletion}</span>
    </li>
  );
}
