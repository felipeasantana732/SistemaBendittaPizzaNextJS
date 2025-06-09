"use client";

import { useSearchParams } from 'next/navigation';
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Importa os ícones

// Componente interno para os botões de submit
function SubmitButtons() {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3 pt-2">
      {/* Botão de Login */}
      <Button className="w-full" type="submit" formAction={login} disabled={pending}>
        {pending ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Log in"
        )}
      </Button>

      {/* Botão de Sign Up */}
      <Button className="w-full" variant="outline" type="submit" formAction={signup} disabled={pending}>
        {pending ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Cadastrando...
          </>
        ) : (
          "Sign up"
        )}
      </Button>
    </div>
  );
}


// Componente principal do formulário
export default function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState(''); // Estado para o valor da senha

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    } else {
      setError(null);
    }
  }, [searchParams]);

  // Função para alternar a visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Função para atualizar o estado do valor da senha
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Exibe o erro lido da URL */}
      {error && (
         <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
             Erro: {error}
         </div>
       )}

      <form className="space-y-4">
        {/* Campo de Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>

        {/* Campo de Senha com Botão de Visibilidade */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          {/* Container relativo para posicionar o botão */}
          <div className="relative">
            <Input
              id="password"
              name="password"
              // Altera o tipo dinamicamente
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={passwordValue} // Controla o valor do input
              onChange={handlePasswordChange} // Atualiza o estado ao digitar
              // Adiciona padding à direita para não sobrepor o botão
              className="pr-10" // Ajuste o valor (pr-10, pr-12) conforme necessário
            />
            {/* Botão para mostrar/ocultar senha - Renderizado condicionalmente */}
            {passwordValue && ( // Só mostra o botão se houver algo digitado
              <button
                type="button" // Importante para não submeter o form
                onClick={togglePasswordVisibility}
                // 👇 Altera as classes de cor para um cinza mais claro
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {/* Alterna o ícone */}
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Botões de Submit */}
        <SubmitButtons />
      </form>
    </div>
  );
}
