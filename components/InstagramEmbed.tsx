"use client"; // Necessário para componentes que usam hooks como o useEffect ou são dinamicamente importados assim.

import { InstagramEmbed } from 'react-social-media-embed';

// Você pode passar as props que precisar
interface InstagramEmbedClientProps {
  url: string;
  width?: number | string;
}

const InstagramEmbedClient = ({ url, width }: InstagramEmbedClientProps) => {
  return <InstagramEmbed url={url} width={width} />;
};

export default InstagramEmbedClient;