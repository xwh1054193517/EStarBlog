import Link from "next/link";
import type { CategoryItem } from "@/lib/types";

export default function CategoriesCard({ categories }: { categories: CategoryItem[] }) {
  return (
    <div className="card-widget card-categories">
      <div className="item-headline">
        <i className="ri-folder-6-fill" />
        <span>分类</span>
      </div>
      <ul className="card-list is-expanded">
        {categories.map((category) => (
          <li key={category.id} className="card-list-item">
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
