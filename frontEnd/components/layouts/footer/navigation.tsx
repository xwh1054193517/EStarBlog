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
    <div className="footer-group">
      {footerMenus.map((menu) => (
        <div key={menu.id} className="group-item">
          <div className="item-title">{menu.title}</div>
          <nav className="item-content" aria-label={`${menu.title}导航`}>
            {menu.children?.map((child) => (
              <Link
                key={child.id}
                className="content_link"
                href={child.url}
                target={isExternalLink(child.url) ? "_blank" : undefined}
                rel={isExternalLink(child.url) ? "noreferrer" : undefined}
              >
                {child.title}
              </Link>
            ))}
          </nav>
        </div>
      ))}

      <div className="group-item">
        <div className="item-title friend-title">
          友链
          <i
            className="refresh-icon ri-refresh-line"
            onClick={() => setSeed((value) => value + 1)}
          />
        </div>
        <nav className="item-content friend-content" aria-label="友情链接">
          {randomFriends.map((friend) => (
            <a
              key={friend.id}
              className="content_link"
              href={friend.url}
              target="_blank"
              rel="noreferrer"
              title={friend.description}
            >
              {friend.name}
            </a>
          ))}
          {friends.length > 3 ? (
            <Link href="/friend" className="content_link">
              更多...
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
