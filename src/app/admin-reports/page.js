import generateMetadata from "@/utils/seo-metadata/static";
import Reports from "@/app/admin-reports/page-wrapper";
import { Metadata } from "@/common/config";

export const metadata = generateMetadata(Metadata("/admin-reports"));

export default async function Page() {
  return (
    <>
      <Reports />
    </>
  );
}
