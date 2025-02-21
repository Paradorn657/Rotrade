"use client"
import { getServerSession } from "next-auth/next";

import MT5Dashboard from "@/components/Dashboardpage";
import { authOptions } from "../../../lib/authOptions";
import LoginRedirect from "@/components/loginredirect";
import { useSession } from "next-auth/react";
import SimpleSpinner from "@/components/Loadingspinner";

export default function Page() {
  const { status, data: session } = useSession();

  if (status === "loading") {
    return <SimpleSpinner />;
  }


  // // ตรวจสอบว่ามี session หรือไม่
  if (!session?.user?.email) {
    return (
      <LoginRedirect />
    );
  }



  return <MT5Dashboard email={session.user.email} />;
}