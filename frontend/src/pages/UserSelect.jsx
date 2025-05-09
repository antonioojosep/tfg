import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUsers from "../hooks/useUsers.jsx";
import Card from "../components/Card.jsx";
import Loader from "../components/Loader.jsx";
import PageContainer from "../components/PageContainer.jsx";

export default function UserSelect() {
  const { users, loading } = useUsers();
  const navigate = useNavigate();

  const handleUserSelect = (user) => {
    navigate("login", { state: { selectedUser: user } });
  };

  if (loading) return <Loader />;

  return (
    <PageContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {users.map(user => (
          <Card
            key={user._id}
            className="cursor-pointer hover:shadow-xl transition"
            onClick={() => handleUserSelect(user)}
          >
            <div className="text-xl font-semibold text-primary">{user.username}</div>
            <div className="text-gray-500 capitalize">{user.role}</div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}