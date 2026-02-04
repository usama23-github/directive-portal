"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <div className="flex justify-between items-center">
            <Image src="/logo.png" height={80} width={80} alt="Logo" />
            <div className="ml-4">
              <h1 className="ml-2">Directive portal of</h1>
              <h1 className="font-bold">Syed Sardar Ali Shah</h1>
            </div>
          </div>
          <Button asChild variant="secondary">
            <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
              {isSignIn ? "Sign Up" : "Login"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
