"use client"

import MT5Dashboard from "@/components/Dashboardpage";
import SimpleSpinner from "@/components/Loadingspinner";
import LoginRedirect from "@/components/loginredirect";
import { useSession } from "next-auth/react";

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



  return <MT5Dashboard session={session} />;
}