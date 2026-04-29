import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/login`, { password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch {
      setError("Password incorreta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl font-black tracking-tight mb-2">
            <span className="text-white">CRASH</span>
            <span className="text-[#DC2626]">PEÇAS</span>
          </div>
          <p className="text-[#A3A3A3] text-sm">Painel de Administração</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#171717] border border-[#262626] p-8">
          <h1 className="text-white font-bold text-xl mb-6">Entrar</h1>

          <div className="mb-4">
            <label className="block text-[#A3A3A3] text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-4 py-3 focus:outline-none focus:border-[#DC2626] transition-colors"
              placeholder="••••••"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-[#DC2626] text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold py-3 transition-colors disabled:opacity-50"
          >
            {loading ? "A entrar..." : "ENTRAR"}
          </button>
        </form>
      </div>
    </div>
  );
}
