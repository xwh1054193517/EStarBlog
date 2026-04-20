"use client";

import Link from "next/link";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import type { CategoryItem, SiteData } from "@/lib/types";

interface CategoriesPageClientProps {
  categories: CategoryItem[];
  siteData: SiteData;
}

export default function CategoriesPageClient({ categories, siteData }: CategoriesPageClientProps) {
  return (
    <DefaultLayout siteData={siteData} pageType="page" showSidebar={false}>
      <div id="page">
        <h1 className="page-title">分类</h1>
        <div className="category-lists">
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.slug} className="category-list-item">
                <Link href={category.url} className="category-list-link">
                  {category.name}
                </Link>
                <span className="category-list-count">{category.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DefaultLayout>
  );
}
