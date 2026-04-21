"use client";

import Link from "next/link";
import type { CategoryItem } from "@/lib/types";
import { useExpandable } from "@/hooks/useExpandable";

export default function CategoriesCard({ categories }: { categories: CategoryItem[] }) {
  const { isExpanded, toggleExpand } = useExpandable();

  return (
    <div className="card-widget card-categories">
      <div className={`item-headline${isExpanded ? " is-expanded" : ""}`}>
        <i className="ri-folder-6-fill" />
        <span>分类</span>
        <i
          className={`collapse-icon ri-arrow-left-s-fill${isExpanded ? " is-expanded" : ""}`}
          onClick={toggleExpand}
        />
      </div>
      <ul className={`card-list${isExpanded ? " is-expanded" : ""}`}>
        {categories.map((category) => (
          <li key={category.slug} className="card-list-item">
            <Link className="card-list-link" href={category.url}>
              <span className="card-list-name">{category.name}</span>
              <span className="card-list-count">{category.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
