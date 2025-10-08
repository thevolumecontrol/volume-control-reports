
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <nav className="nav-bar">
      <Link href="/">
        <Image
          src="/volume-control-logo.png"
          alt="Volume Control Logo"
          width={100}
          height={40}
        />
      </Link>
    </nav>
  );
}

