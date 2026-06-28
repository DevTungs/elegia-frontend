import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api, setToken, getToken } from "@/services/api";
import elegiaLogo from "@/assets/elegia-logo.png";
import { Loader2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao fazer login",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden page-gradient">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(348_83%_47%_/_0.08)_0%,_transparent_55%)] pointer-events-none" />
      <div className="glow-orb top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/[0.05]" />
      <div className="glow-orb bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/[0.03]" />

      <AnimatedSection animation="scale" className="w-full max-w-md relative z-10">
        <Card className="surface-elevated border-white/[0.08]">
          <CardHeader className="text-center pb-4">
            <img
              src={elegiaLogo}
              alt="Elegia L.C."
              className="w-40 mx-auto mb-6"
            />
            <CardTitle className="text-2xl font-bold uppercase tracking-tight">
              Login Administrativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-white/[0.08]"
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
                  className="bg-background border-white/[0.08]"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary text-primary-foreground font-bold uppercase tracking-wider hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] rounded-md transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Aguarde...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Voltar ao site
              </Link>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
};

export default Auth;
