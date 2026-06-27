import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api, setToken, getToken } from "@/services/api";
import elegiaLogo from "@/assets/elegia-logo.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (getToken()) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post<{ token: string; user: { id: string; email: string; role: string } }>(
        "/auth/login",
        { email, password }
      );

      setToken(data.token);

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta.",
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao fazer login",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(348_83%_47%_/_0.08)_0%,_transparent_55%)] pointer-events-none" />
      <div className="w-full max-w-md">
        <div className="bg-card/85 border border-border p-8 rounded-sm section-frame">
          <div className="mb-8 text-center">
            <img
              src={elegiaLogo}
              alt="Elegia L.C."
              className="w-48 mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold uppercase tracking-tight">
              Login Administrativo
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background border-border"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wider hover:bg-primary/90 lift-hover"
            >
              {loading ? "Aguarde..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
