import { Link } from "react-router-dom";

const dummyUsers = [
  { id: 1, name: "John" },
  { id: 2, name: "James" },
];

const UsersListPage = () => {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Users List</h2>
      <ul className="space-y-2">
        {dummyUsers.map((user) => (
          <li key={user.id}>
            <Link
              to={`/users/${user.id}`}
              className="text-blue-600 hover:underline"
            >
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersListPage;
