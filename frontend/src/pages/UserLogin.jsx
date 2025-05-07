import { useState } from "react";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Card from "../components/Card.jsx";
import Loader from "../components/Loader.jsx";
import Alert from "../components/Alert.jsx";

export default function UserLogin({ user, onLogin, onBack }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      const data = await res.json();
      onLogin(data.role);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
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
        <Button type="button" className="flex-1 bg-secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? <Loader /> : "Login"}
        </Button>
      </div>
    </form>
  );
}