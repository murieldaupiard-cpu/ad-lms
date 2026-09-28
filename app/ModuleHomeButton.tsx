"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const moduleRoots=["/welcome","/alphabet","/numbers","/symbols","/dates","/time"];

export default function ModuleHomeButton(){
 const pathname=usePathname();
 const insideModule=moduleRoots.some(root=>pathname===root||pathname.startsWith(`${root}/`));
 if(!insideModule)return null;
 return <Link className="all-modules-button" href="/modules">← ALL MODULES</Link>;
}
