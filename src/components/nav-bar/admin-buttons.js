"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/uikit/button/button";
import Tag from "@/uikit/button/tag";
import { useUser } from "@/providers/user/user-provider";

export default function AdminTag() {
  const { isVisitor } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReportsClick = () => {
    router.push("/admin-reports");
  };

  if (!mounted || isVisitor) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <Tag variant={"green"} size="s" disabled={true}>
        {"admin user"}
      </Tag>
      <Button variant="black" size="s" onClick={handleReportsClick}>
        Reports
      </Button>
    </div>
  );
}
