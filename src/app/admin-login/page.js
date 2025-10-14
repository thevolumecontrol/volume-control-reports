import generateMetadata from "@/utils/seo-metadata/static";
import Login from "@/app/admin-login/login-page-wrapper";
import { Metadata } from "@/common/config";

export const metadata = generateMetadata(Metadata("/admin-login"));

export default async function Page() {
  return (
    <>
      <Login />
    </>
  );
}
