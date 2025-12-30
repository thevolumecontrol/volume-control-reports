import Link from "next/link";
import Image from "next/image";
import AdminTag from "@/components/nav-bar/admin-buttons";

export default function NavBar() {
  return (
    <nav className="nav-bar flex items-center justify-between">
      <Link href="/">
        <Image
          src="/volume-control-logo.png"
          alt="Volume Control Logo"
          width={100}
          height={40}
        />
      </Link>
      <AdminTag />
    </nav>
  );
}

