import { Link } from 'remix';

export default function Index() {
  return (
    <div>
      <h1>REMIX CRUD</h1>

      <Link to={'/list'}>List</Link>
    </div>
  );
}
