import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";
import Departments from "./departments";

const Siderbar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <div className="flex justify-between items-center">
          <Image src="/logo.png" height={80} width={80} alt="Logo" />
          <div className="ml-4">
            <h1 className="">Directive portal of</h1>
            <h1 className="font-bold">Syed Sardar Ali Shah</h1>
          </div>
        </div>
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Departments />
    </aside>
  );
};

export default Siderbar;
