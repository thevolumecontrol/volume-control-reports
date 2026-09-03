import Link from "next/link";
import Image from "next/image";
import AdminTag from "@/components/nav-bar/admin-buttons";

export default function NavBar() {
  return (
    <nav className="nav-bar flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 min-w-0">
        <Image
          src="/volume-control-logo.png"
          alt="Volume Control Logo"
          width={100}
          height={40}
        />
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-[15px] sm:text-lg font-semibold tracking-tight text-[#1e4b8e] truncate">
            DJ Plaque Tracker
          </span>
          <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[#1e4b8e] border border-[#1e4b8e]">
            BETA
          </span>
        </span>
      </Link>
      <AdminTag />
    </nav>
  );
}
