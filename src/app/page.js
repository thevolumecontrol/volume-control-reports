import generateMetadata from "@/utils/seo-metadata/static";
import PageWrapper from "./page-wrapper";
import { Metadata } from "@/common/config";

export const metadata = generateMetadata(Metadata("/"));

export default async function Page() {
  return (
    <>
      <PageWrapper />
    </>
  );
}
