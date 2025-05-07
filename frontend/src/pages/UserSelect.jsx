import useUsers from "../hooks/useUsers.jsx";
import Card from "../components/Card.jsx";
import Loader from "../components/Loader.jsx";

export default function UserSelect({ onSelect }) {
  const { users, loading } = useUsers();

  if (loading) return <Loader />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {users.map(user => (
        <Card
          key={user._id}
          className="cursor-pointer hover:shadow-xl transition"
          onClick={() => onSelect(user)}
        >
          <div className="text-xl font-semibold text-primary">{user.username}</div>
          <div className="text-gray-500 capitalize">{user.role}</div>
        </Card>
      ))}
    </div>
  );
}