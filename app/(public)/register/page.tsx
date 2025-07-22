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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError([]); // Limpa erros anteriores

		const result = registerValidation({
			fullName,
			email,
			password,
			confirmPassword,
			acceptTerms,
		});

		if (!result.success) {
			setError(result.errors || []);
		} else {
			// TODO: Implementar lógica de cadastro bem-sucedido
			// Redirecionar para dashboard ou página de confirmação
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
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
				<CardHeader className="text-center space-y-4">
					<div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
						<Lock className="w-8 h-8 text-white" />
					</div>
					<div>
						<CardTitle className="text-2xl font-bold text-white">
							Bem-vindo
						</CardTitle>
						<CardDescription className="text-slate-400">
							Crie sua conta para começar
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Error Messages */}
					{error.length > 0 && (
						<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-2">
							<div className="flex items-center space-x-2">
								<AlertCircle className="w-4 h-4 text-red-400" />
								<span className="text-sm font-medium text-red-400">
									Verifique os seguintes erros:
								</span>
							</div>
							<ul className="space-y-1">
								{error.map((err) => (
									<li key={err} className="text-sm text-red-300 ml-6">
										• {err}
									</li>
								))}
							</ul>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Full Name Field */}
						<div className="space-y-2">
							<Label htmlFor="fullName" className="text-slate-300">
								Nome completo
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
								<Input
									id="fullName"
									type="text"
									placeholder="Seu nome completo"
									value={fullName}
									onChange={(e) => {
										setFullName(e.target.value);
										clearErrors();
									}}
									className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
									required
									data-testid="fullname-input"
								/>
							</div>
						</div>

						{/* Email Field */}
						<div className="space-y-2">
							<Label htmlFor="email" className="text-slate-300">
								Email
							</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
								<Input
									id="email"
									type="email"
									placeholder="seu@email.com"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										clearErrors();
									}}
									className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
									required
									data-testid="email-input"
								/>
							</div>
						</div>

						{/* Phone Field */}

						{/* Password Field */}
						<div className="space-y-2">
							<Label htmlFor="password" className="text-slate-300">
								Senha
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••"
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
										clearErrors();
									}}
									className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
									required
									data-testid="password-input"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
									data-testid="toggle-password-visibility"
								>
									{showPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</button>
							</div>
						</div>

						{/* Confirm Password Field */}
						<div className="space-y-2">
							<Label htmlFor="confirmPassword" className="text-slate-300">
								Confirmar senha
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="••••••"
									value={confirmPassword}
									onChange={(e) => {
										setConfirmPassword(e.target.value);
										clearErrors();
									}}
									className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
									required
									data-testid="confirm-password-input"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
									data-testid="toggle-confirm-password-visibility"
								>
									{showConfirmPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
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
								className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-0.5"
								data-testid="terms-checkbox"
							/>
							<Label
								htmlFor="terms"
								className="text-sm text-slate-400 cursor-pointer leading-relaxed"
							>
								Aceito os{" "}
								<Link
									href="/terms"
									className="text-blue-400 hover:text-blue-300 transition-colors"
									data-testid="terms-link"
								>
									termos de uso
								</Link>{" "}
								e{" "}
								<Link
									href="/privacy"
									className="text-blue-400 hover:text-blue-300 transition-colors"
									data-testid="privacy-link"
								>
									política de privacidade
								</Link>
							</Label>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-colors"
							data-testid="register-submit-button"
							disabled={
								!fullName ||
								!email ||
								!password ||
								!confirmPassword ||
								!acceptTerms
							}
						>
							Criar conta
						</Button>
					</form>

					{/* Login Link */}
					<div className="text-center mt-4">
						<p className="text-sm text-slate-400">
							Já tem uma conta?{" "}
							<Link
								href="/login"
								className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
								data-testid="login-link"
							>
								Entre aqui
							</Link>
						</p>
					</div>

					{/* Divider */}
					<div className="relative mt-6">
						<Separator className="bg-slate-600" />
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="bg-slate-800 px-3 text-sm text-slate-400">
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
							className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700 transition-colors"
							data-testid="google-register-button"
						>
							<svg
								className="w-4 h-4 mr-2"
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
							className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700 transition-colors"
							data-testid="facebook-register-button"
						>
							<svg
								className="w-4 h-4 mr-2"
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
						<p className="text-xs text-slate-500">
							© 2024 Sua Empresa. Todos os direitos reservados.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
