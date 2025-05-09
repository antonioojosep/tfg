import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Card from "../components/Card.jsx";
import Loader from "../components/Loader.jsx";
import Alert from "../components/Alert.jsx";
import PageContainer from "../components/PageContainer.jsx";

export default function UserLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.selectedUser;

  if (!user) {
    navigate("../");
    return null;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: user.username, 
          password 
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      navigate("../table");
    } catch (error) {
      setError("Network error");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("../");
  };

  return (
    <PageContainer>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">{user.username}</div>
          <div className="text-gray-500 capitalize mb-2">{user.role}</div>
        </div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <Alert type="error">{error}</Alert>}
        <div className="flex gap-2">
          <Button type="button" className="flex-1 bg-secondary" onClick={handleBack}>
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader /> : "Login"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}