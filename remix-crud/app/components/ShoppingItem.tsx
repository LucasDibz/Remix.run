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

  const isFailedDeletion = fetcher.data?.error; // since Try/Catch returns { error: true } on list.tsx

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
    </li>
  );
}
