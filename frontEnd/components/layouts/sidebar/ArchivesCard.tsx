import Link from "next/link";
import type { ArchiveItem } from "@/lib/types";
import { getDisplayArchives } from "@/lib/utils";

export default function ArchivesCard({ archives }: { archives: ArchiveItem[] }) {
  const displayArchives = getDisplayArchives(archives);

  return (
    <div className="card-widget card-archives">
      <div className="item-headline">
        <i className="ri-archive-fill" />
        <span>归档</span>
      </div>
      <ul className="card-list is-expanded">
        {displayArchives.map((archive, index) => (
          <li key={`${archive.year}-${archive.month}-${index}`} className="card-list-item">
            <Link className="card-list-link" href={archive.isEarlier ? "/archive" : `/archive/${archive.year}/${archive.month}`}>
              <span className="card-list-name">{archive.displayText}</span>
              <span className="card-list-count">{archive.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
