"use  client";
import Link from "next/link";
interface MenuProps {
  menus: {
    id: number;
    title: string;
    url: string;
    icon?: string;
    children?: { id: number; title: string; url: string; icon?: string }[];
  }[];
  blogTitle: string;
  isScrollingDown: boolean;
  isFixed: boolean;
}

export default function menu({ menus, blogTitle, isScrollingDown, isFixed }: MenuProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="nav-menu">
      <div className={`menu-items${isScrollingDown && isFixed ? " hide" : ""}`}>
        {menus.map((menu) =>
          menu.children?.length ? (
            <div key={menu.id} className="menu-item dropdown">
              <Link href={menu.url || "#"} className="brighten" aria-label={menu.title}>
                {menu.icon ? <i className={menu.icon} /> : null}
                <span>{menu.title}</span>
                <i className="ri-arrow-down-s-line arrow-icon" />
              </Link>
            </div>
          ) : (
            <Link key={menu.id} href={menu.url} className="brighten" aria-label={menu.title}>
              {menu.icon ? <i className={menu.icon} /> : null}
              <span>{menu.title}</span>
            </Link>
          )
        )}
      </div>
      <div className={`scroll-title${isScrollingDown && isFixed ? " show" : ""}`}>
        <button
          className="scroll-to-top brighten no-after"
          onClick={scrollToTop}
          aria-label="回到顶部"
        >
          <span className="title">{blogTitle}</span>
        </button>
      </div>
    </div>
  );
}
