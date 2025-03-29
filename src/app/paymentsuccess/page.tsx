"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("⏳ กำลังตรวจสอบสถานะการชำระเงิน...");

  useEffect(() => {
    const status = searchParams.get("redirect_status"); // ค่าที่ Stripe ส่งมา

    if (status === "succeeded") {
      setMessage("✅ การชำระเงินสำเร็จ! ขอบคุณที่ใช้บริการ 🎉");
    } else if (status === "failed") {
      setMessage("❌ การชำระเงินล้มเหลว กรุณาลองใหม่");
    } else {
      setMessage("⏳ กำลังดำเนินการ กรุณารอสักครู่...");
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">{message}</h1>
      <Link href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">กลับสู่หน้าแรก</Link>
    </div>
  );
}
