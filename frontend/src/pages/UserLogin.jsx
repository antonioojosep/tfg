import { useState, use, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/Authcontext.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Loader from "../components/Loader.jsx";
import Alert from "../components/Alert.jsx";
import PageContainer from "../components/PageContainer.jsx";

export default function UserLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin } = use(AuthContext);
  const user = location.state?.selectedUser;

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await handleLogin(user.username, password);
      
      if (!success) {
        throw new Error("Credenciales incorrectas");
      }
      
      navigate("../table", { relative: "path" });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/restaurant/${user.company.email}`);
  };

  return (
    <PageContainer>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {user.username}
          </div>
          <div className="text-gray-500 capitalize mb-2">{user.role}</div>
        </div>
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <Alert type="error">{error}</Alert>}
        <div className="flex gap-2">
          <Button
            type="button"
            className="flex-1 bg-secondary"
            onClick={handleBack}
          >
            Volver
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader /> : "Iniciar sesión"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}