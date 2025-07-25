"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleGoogleLogin = () => {};

  const handleFacebookLogin = () => {};

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="font-bold text-2xl text-white">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-slate-400">
              Entre na sua conta para continuar
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="border-slate-600 bg-slate-700/50 pl-10 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  required
                  data-testid="email-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Senha
              </Label>
              <div className="relative">
                <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className="border-slate-600 bg-slate-700/50 pr-10 pl-10 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  required
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="-translate-y-1/2 absolute top-1/2 right-3 transform text-slate-400 transition-colors hover:text-white"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                  className="border-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                  data-testid="remember-me-checkbox"
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-slate-400 text-sm"
                >
                  Lembrar de mim
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-blue-400 text-sm transition-colors hover:text-blue-300"
                data-testid="forgot-password-link"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              data-testid="login-submit-button"
            >
              Entrar
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-400 transition-colors hover:text-blue-300"
                data-testid="register-link"
              >
                Crie uma conta
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative mt-6">
            <Separator className="bg-slate-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-slate-800 px-3 text-slate-400 text-sm">
                OU CONTINUE COM
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="border-slate-600 bg-slate-700/50 text-white transition-colors hover:bg-slate-700"
              data-testid="google-login-button"
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
              onClick={handleFacebookLogin}
              className="border-slate-600 bg-slate-700/50 text-white transition-colors hover:bg-slate-700"
              data-testid="facebook-login-button"
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
            <p className="text-slate-500 text-xs">
              © 2024 Sua Empresa. Todos os direitos reservados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
