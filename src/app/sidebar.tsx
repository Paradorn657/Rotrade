'use client';

import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { useContext, createContext, useState, ReactNode, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Session } from "next-auth";
import { useSession } from "next-auth/react";



// ระบุชนิดข้อมูลสำหรับ SidebarContext
interface SidebarContextType {
  expanded: boolean;
}

// สร้าง Context พร้อมชนิดข้อมูล
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// ระบุชนิด Props สำหรับ Sidebar
interface SidebarProps {
  children: ReactNode;
}


// Sidebar Component
export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <aside
      className={`h-screen   transition-all ${expanded ? "flex-[0_0_12rem]" : "flex-[0_0_4rem]"
        }`}
    >
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          {/* <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"
              }`}
            alt="Logo"
          /> */}
          <h2 className={`text-xl font-extrabold text-black mb-1 tracking-tight ${expanded ? "w-auto" : "w-0 overflow-hidden"}`}>RoTrade Forex</h2>
        
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="User avatar"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
              }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

// ระบุชนิด Props สำหรับ SidebarItem
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  href: Url;
  onClick?: () => void; // Optional click handler
  forRole?: string; // เมนูนี้สำหรับ role อะไร
  }

// SidebarItem Component
export function SidebarItem({ icon, text, active, alert, href, onClick, forRole }: SidebarItemProps) {
  const { data: session } = useSession();
  
  const context = useContext(SidebarContext); // ✅ ใช้ useContext ก่อนอื่น
  const expanded = context?.expanded ?? true;

  const [isClient, setIsClient] = useState(false);

 
  useEffect(() => {
    setIsClient(true)
  }, [])
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false); // ✅ ใช้ state แทน return null

  useEffect(() => {
    if (forRole && session?.user?.role !== forRole) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [forRole, session]);

  if (hidden) return null; // ✅ ซ่อนคอมโพเนนต์ที่นี่ แทนการ return ก่อน Hooks

  const isActive = isClient ? (active ?? pathname === href) : false;

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        !session ? "pointer-events-none opacity-50" : ""
      }  
        ${isActive ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}
    >
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
      {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />}
      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
      <Link href={href} onClick={onClick} className="absolute inset-0" />
    </li>
  );
}

