import StyledComponentsRegistry from '@/lib/styled-components-registry'; 
import { Poppins } from "next/font/google"; 
import FlashMessageDisplay from '@/app/components/FlashMessageDisplay'; 
import './globals.css'; 


const poppins = Poppins({
  weight:["400", "500", "600", "700" ], 
  subsets: ["latin"], 
  display: 'swap', 
  variable: '--font-poppins', 
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
      <body className={`${poppins.variable} antialiased`}> {/* Removi bg-gray-100 daqui, melhor aplicar onde for necessário ou em globals.css */}
        {/* Envolve o conteúdo principal e o display de flash messages com o Registry */}
       <StyledComponentsRegistry>
            {children} {/* Renderiza o conteúdo da página atual */}
            <FlashMessageDisplay /> {/* Renderiza o componente de flash messages */}
             </StyledComponentsRegistry>
      </body>
    </html>
  );
}
