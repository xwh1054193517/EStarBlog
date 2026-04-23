"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ArchiveItem } from "@/lib/types";
import { getArchives } from "@/lib/api/archiveApi";
import { getDisplayArchives } from "@/lib/utils";
import { useExpandable } from "@/hooks/useExpandable";

export default function ArchivesCard() {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const { isExpanded, toggleExpand } = useExpandable();

  useEffect(() => {
    getArchives()
      .then((data) => {
        setArchives(data || []);
      })
      .catch((err) => {
        console.error("Failed to load archives:", err);
        setArchives([]);
      });
  }, []);

  const displayArchives = getDisplayArchives(archives);

  return (
    <div className="card-widget card-archives">
      <div className={`item-headline${isExpanded ? " is-expanded" : ""}`}>
        <i className="ri-archive-fill" />
        <span>归档</span>
        <i
          className={`collapse-icon ri-arrow-left-s-fill${isExpanded ? " is-expanded" : ""}`}
          onClick={toggleExpand}
        />
      </div>
      <ul className={`card-list${isExpanded ? " is-expanded" : ""}`}>
        {displayArchives.map((archive, index) => (
          <li key={`${archive.year}-${archive.month}-${index}`} className="card-list-item">
            <Link
              className="card-list-link"
              href={archive.isEarlier ? "/archive" : `/archive/${archive.year}/${archive.month}`}
            >
              <span className="card-list-name">{archive.displayText}</span>
              <span className="card-list-count">{archive.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
