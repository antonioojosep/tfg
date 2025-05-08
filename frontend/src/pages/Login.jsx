import { useState, use } from "react";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/Authcontext.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { handleLogin } = use(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(username, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h2 className="text-center text-2xl font-bold mb-2">Login</h2>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <Input
        type="password" 
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button type="submit">Login</Button>
    </form>
  );
}