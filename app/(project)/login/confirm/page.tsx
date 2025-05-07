import React from 'react';
import { MailCheck } from 'lucide-react'; // Ícone de envelope

export default function ConfirmEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">

        {/* Ícone */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 bg-green-100 rounded-full">
          <MailCheck className="h-8 w-8 text-green-600" aria-hidden="true" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900">
          Confirme seu e-mail
        </h1>

        {/* Mensagem */}
        <p className="text-base text-gray-600">
          Quase lá! Enviamos um link de confirmação para o seu e-mail.
        </p>
        <p className="text-base text-gray-600">
          Por favor, verifique sua caixa de entrada (e spam) e clique no link para ativar sua conta e ter acesso ao app.
        </p>

        {/* Opcional: Link para voltar ao login ou tentar reenviar */}
        {/*
        <div className="pt-4">
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Voltar para o Login
          </a>
        </div>
        */}

      </div>
    </div>
  );
}

