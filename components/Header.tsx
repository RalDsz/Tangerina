"use client";

import Link from "next/link";
import { Citrus } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={`p-4 flex justify-between items-center ${
        isHomePage ? "bg-blue-50" : "bg-white border-b border-blue-50"
      }`}
    >
      <Link href="/" className="flex items-center no-underline">
        <Citrus className="h-7 w-7 text-blue-600 mr-3" />
        <div className="flex flex-col">
          <span className="text-xl font-semibold leading-none">Tangerina</span>
          <span className="text-xs text-gray-500 mt-0.5">by Lemonn.ai</span>
        </div>
      </Link>

      <div className="flex items-center space-x-4">
        <SignedIn>
          <Link href="/my-children" className="no-underline">
            <Button variant="outline">My Children</Button>
          </Link>
          <Link href="/manage-plan" className="no-underline">
            <Button>Manage Plan</Button>
          </Link>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
