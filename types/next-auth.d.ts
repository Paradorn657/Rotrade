import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role:string
      image:string
      provider:string
      createDate:DateTime
    };
  }

  interface User extends DefaultUser {
    role?: string; // ทำให้ role เป็น optional
    create_at:DateTime
  }

  interface BillData {
    bill: Bill;
    deals: Deal[];
    totalProfit: number;
    serviceFee: number;
  }
  
  interface Bill {
    Bill_id: number;
    User_id: number;
    Billing_startdate: string;
    Billing_enddate: string;
    status: string;
    Balance: number;
  }

}