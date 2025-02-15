import { getServerSession } from "next-auth/next";

import MT5Dashboard from "@/components/Dashboardpage";
import { authOptions } from "../../../lib/authOptions";

export default async function Page() {
  const session = await getServerSession(authOptions);

  // ตรวจสอบว่ามี session หรือไม่
  if (!session?.user?.email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">No authenticated user found!</p>
      </div>
    );
  }

  return <MT5Dashboard email={session.user.email} />;
}