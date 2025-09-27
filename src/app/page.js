import generateMetadata from "@/utils/seo-metadata/static";
import PageWrapper from "./page-wrapper";

export const metadata = generateMetadata({
  title: "Volume Control | Admin Dashboard",
  description:
    "Manage your volume settings with ease. Control audio levels, adjust settings, and enhance your listening experience with our intuitive dashboard.",
  url: "/",
  keywords:
    "volume control, audio settings, admin dashboard, user preferences, sound management",
});

export default async function Page() {
  return (
    <>
      <PageWrapper />
    </>
  );
}
