"use client";

import { useState } from "react";
import Link from "next/link";
import type { FriendItem, MenuItem } from "@/lib/types";
import { isExternalLink } from "@/lib/utils";

export default function Navigation({
  footerMenus,
  friends
}: {
  footerMenus: MenuItem[];
  friends: FriendItem[];
}) {
  const [seed, setSeed] = useState(0);
  const randomFriends = [...friends].sort((_a, _b) => (seed % 2 === 0 ? -1 : 1)).slice(0, 3);

  return (
    // <div className="footer-group">
    //   {footerMenus.map((menu) => (
    //     <div key={menu.id} className="group-item">
    //       <div className="item-title">{menu.title}</div>
    //       <nav className="item-content" aria-label={`${menu.title}导航`}>
    //         {menu.children?.map((child) => (
    //           <Link
    //             key={child.id}
    //             className="content_link"
    //             href={child.url}
    //             target={isExternalLink(child.url) ? "_blank" : undefined}
    //             rel={isExternalLink(child.url) ? "noreferrer" : undefined}
    //           >
    //             {child.title}
    //           </Link>
    //         ))}
    //       </nav>
    //     </div>
    //   ))}
    // </div>
    <div></div>
  );
}
