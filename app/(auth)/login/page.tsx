// app/login/page.tsx

import LoginForm from './LoginForm'; // 👈 1. Importe o componente LoginForm
                                            //    (Ajuste o caminho se necessário)

export default function LoginPage() {
  return (

    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Acessar Conta</h1>
        <LoginForm />
      </div>
    </div>
  );
}