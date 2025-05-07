import StyledComponentsRegistry from '@/lib/styled-components-registry'; // Importa o Registry
import { Poppins } from "next/font/google"; // Importa a fonte Poppins
import FlashMessageDisplay from '@/app/components/FlashMessageDisplay'; // Importa o display de flash messages (ajuste o caminho se necessário)
import './globals.css'; // Seus estilos globais

// Configuração da fonte Poppins
const poppins = Poppins({
  weight:["400", "500", "600", "700" ], // Pesos que você vai usar
  subsets: ["latin"], // Subconjuntos de caracteres
  display: 'swap', // Melhora o carregamento da fonte
  variable: '--font-poppins', // Opcional: define uma variável CSS se quiser usar em outro lugar
});

// Metadados da sua aplicação
export const metadata = {
  title: 'Benditta Pizza',
  description: 'A melhor pizza com massa de fermentação natural de Goiânia!',
  // Adicione outros metadados aqui (ícones, open graph, etc.)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Define a linguagem da página
    <html lang="pt-BR">
      {/* Aplica a classe da fonte e outras classes base ao body */}
      <body className={`${poppins.className} antialiased`}> {/* Removi bg-gray-100 daqui, melhor aplicar onde for necessário ou em globals.css */}
        {/* Envolve o conteúdo principal e o display de flash messages com o Registry */}
       <StyledComponentsRegistry>
            {children} {/* Renderiza o conteúdo da página atual */}
            <FlashMessageDisplay /> {/* Renderiza o componente de flash messages */}
             </StyledComponentsRegistry>
      </body>
    </html>
  );
}
