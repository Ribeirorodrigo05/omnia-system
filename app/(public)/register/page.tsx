"use client";

import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { registerValidation } from "@/server/validators/register-validation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError([]); // Limpa erros anteriores
    setIsLoading(true); // Inicia loading

    try {
      const result = registerValidation({
        fullName,
        email,
        password,
        confirmPassword,
        acceptTerms,
      });

      if (!result.success) {
        setError(result.errors || []);
        return;
      }

      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
          acceptTerms,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar conta. Tente novamente.");
      }

      const data = await response.json();

      if (!data.success) {
        setError(data.errors || ["Erro ao criar conta"]);
        return;
      }

      // Sucesso - poderia redirecionar ou mostrar mensagem de sucesso
      console.log("User created successfully:", data);
    } catch (error) {
      console.error("Error creating user:", error);
      setError(["Erro interno. Tente novamente mais tarde."]);
    } finally {
      setIsLoading(false); // Finaliza loading sempre
    }
  };

  const handleGoogleRegister = () => {
    // TODO: Implementar cadastro com Google
  };

  const handleFacebookRegister = () => {
    // TODO: Implementar cadastro com Facebook
  };

  // Função para limpar erros quando o usuário começar a digitar
  const clearErrors = () => {
    if (error.length > 0) {
      setError([]);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="font-bold text-2xl">Bem-vindo</CardTitle>
            <CardDescription>Crie sua conta para começar</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Messages */}
          {error.length > 0 && (
            <div className="space-y-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive text-sm">
                  Verifique os seguintes erros:
                </span>
              </div>
              <ul className="space-y-1">
                {error.map((err) => (
                  <li key={err} className="ml-6 text-destructive/80 text-sm">
                    • {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <div className="relative">
                <User className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearErrors();
                  }}
                  className="pl-10"
                  required
                  data-testid="fullname-input"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearErrors();
                  }}
                  className="pl-10"
                  required
                  data-testid="email-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearErrors();
                  }}
                  className="pr-10 pl-10"
                  required
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="-translate-y-1/2 absolute top-1/2 right-3 transform text-muted-foreground transition-colors hover:text-foreground"
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearErrors();
                  }}
                  className="pr-10 pl-10"
                  required
                  data-testid="confirm-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="-translate-y-1/2 absolute top-1/2 right-3 transform text-muted-foreground transition-colors hover:text-foreground"
                  data-testid="toggle-confirm-password-visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => {
                  setAcceptTerms(checked === true);
                  clearErrors();
                }}
                className="mt-0.5"
                data-testid="terms-checkbox"
              />
              <Label
                htmlFor="terms"
                className="cursor-pointer text-muted-foreground text-sm leading-relaxed"
              >
                Aceito os{" "}
                <Link
                  href="/terms"
                  className="text-primary transition-colors hover:text-primary/80"
                  data-testid="terms-link"
                >
                  termos de uso
                </Link>{" "}
                e{" "}
                <Link
                  href="/privacy"
                  className="text-primary transition-colors hover:text-primary/80"
                  data-testid="privacy-link"
                >
                  política de privacidade
                </Link>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 font-medium"
              data-testid="register-submit-button"
              disabled={
                isLoading ||
                !fullName ||
                !email ||
                !password ||
                !confirmPassword ||
                !acceptTerms
              }
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-label="Loading"
                  >
                    <title>Loading</title>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Criando conta...</span>
                </div>
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-muted-foreground text-sm">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-medium text-primary transition-colors hover:text-primary/80"
                data-testid="login-link"
              >
                Entre aqui
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative mt-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className=" px-3 text-muted-foreground text-sm">
                OU CADASTRE-SE COM
              </span>
            </div>
          </div>

          {/* Social Registration */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleRegister}
              data-testid="google-register-button"
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
                aria-label="Google logo"
              >
                <title>Google</title>
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleFacebookRegister}
              data-testid="facebook-register-button"
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-label="Facebook logo"
              >
                <title>Facebook</title>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-muted-foreground/60 text-xs">
              © 2024 Sua Empresa. Todos os direitos reservados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
