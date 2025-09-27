export default function createMetadata({
  title,
  description,
  url,
  type = "website",
  keywords = "",
}) {
  const baseUrl = "https://thevolumecontrol.com";
  const canonicalUrl = `${baseUrl}${url}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type,
      images: [
        {
          url: "https://pub-f594ffedb14345d78aac65b43c689f9f.r2.dev/volume-control-snippet.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}
