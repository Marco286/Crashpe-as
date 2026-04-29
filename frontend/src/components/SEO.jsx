import { Helmet } from "react-helmet-async";

const SITE_NAME = "CrashPeças";
const SITE_URL = "https://crashpecas.pt";
const DEFAULT_DESCRIPTION = "CrashPeças — Peças automóveis novas, usadas e recondicionadas em Olhos de Água, Palmela. Venda e importação de viaturas usadas. Contacte-nos pelo WhatsApp.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export default function SEO({ title, description, image, url, type = "website", structuredData }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Peças Automóveis em Palmela`;
  const metaDesc = description || DEFAULT_DESCRIPTION;
  const metaImage = image || DEFAULT_IMAGE;
  const metaUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_PT" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
