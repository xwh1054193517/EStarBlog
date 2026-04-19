import { getSiteConfig } from "@/lib/api/siteConfigApi";
import { getPublicCategories, getPublicTags } from "@/lib/api/publicApi";
import { getArticles } from "@/lib/api/article-api";
import type {
  Article,
  SiteData,
  TagsOverview,
  MomentItem,
  CategoryItem,
  TagItem,
  MenuItem
} from "@/lib/types";

function safeNumber(value: string | number | null | undefined, fallback: number = 0): number {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

const defaultNavigationMenus: MenuItem[] = [
  { id: 1, type: "navigation", parentId: null, title: "首页", url: "/", icon: "ri-home-5-line" },
  {
    id: 2,
    type: "navigation",
    parentId: null,
    title: "分类",
    url: "/categories",
    icon: "ri-folder-line"
  },
  {
    id: 3,
    type: "navigation",
    parentId: null,
    title: "标签",
    url: "/tags",
    icon: "ri-price-tag-3-line"
  },
  {
    id: 4,
    type: "navigation",
    parentId: null,
    title: "归档",
    url: "/archive",
    icon: "ri-archive-line"
  },
  {
    id: 5,
    type: "navigation",
    parentId: null,
    title: "关于",
    url: "/about",
    icon: "ri-information-line"
  }
];

const defaultFooterMenus: MenuItem[] = [
  {
    id: 10,
    type: "footer",
    parentId: null,
    title: "内容",
    url: "",
    children: [
      { id: 11, type: "footer", parentId: 10, title: "最新文章", url: "/archive" },
      { id: 12, type: "footer", parentId: 10, title: "标签云", url: "/tags" }
    ]
  },
  {
    id: 20,
    type: "footer",
    parentId: null,
    title: "页面",
    url: "",
    children: [
      { id: 21, type: "footer", parentId: 20, title: "关于我", url: "/about" },
      { id: 22, type: "footer", parentId: 20, title: "留言板", url: "/message" }
    ]
  }
];

const defaultAggregateMenus: MenuItem[] = [
  {
    id: 30,
    type: "aggregate",
    parentId: null,
    title: "发现",
    url: "",
    children: [
      {
        id: 31,
        type: "aggregate",
        parentId: 30,
        title: "友链",
        url: "/friend",
        icon: "ri-links-line"
      },
      {
        id: 32,
        type: "aggregate",
        parentId: 30,
        title: "订阅",
        url: "/subscribe",
        icon: "ri-mail-open-line"
      }
    ]
  },
  {
    id: 40,
    type: "aggregate",
    parentId: null,
    title: "工具",
    url: "",
    children: [
      {
        id: 41,
        type: "aggregate",
        parentId: 40,
        title: "统计",
        url: "/statistics",
        icon: "ri-bar-chart-box-line"
      },
      {
        id: 42,
        type: "aggregate",
        parentId: 40,
        title: "搜索",
        url: "/search",
        icon: "ri-search-line"
      }
    ]
  }
];

export async function getMockSiteData(): Promise<SiteData> {
  const config = await getSiteConfig();
  const [categories, tags] = await Promise.all([getPublicCategories(), getPublicTags()]);

  return {
    blogConfig: {
      title: config.blog.title,
      subtitle: config.blog.subtitle,
      typingTexts: config.blog.typingTexts,
      announcement: config.blog.announcement,
      established: config.blog.established,
      sidebarSocial: [],
      footerSocial: [],
      footerLinks: []
    },
    basicConfig: config.basic,
    navigationMenus: defaultNavigationMenus,
    footerMenus: defaultFooterMenus,
    aggregateMenus: defaultAggregateMenus,
    categories: categories.map((c) => ({
      id: safeNumber(c.id),
      name: c.name,
      slug: c.slug,
      url: `/categories/${c.slug}`,
      count: c.postCount ?? 0
    })) as CategoryItem[],
    tags: tags.map((t) => ({
      id: safeNumber(t.id),
      name: t.name,
      slug: t.slug,
      url: `/tags/${t.slug}`,
      count: t.postCount ?? 0
    })) as TagItem[],
    archives: [],
    moments: [],
    friends: [],
    siteStats: {
      totalWords: 0,
      totalVisitors: 0,
      totalPageViews: 0,
      onlineUsers: 0
    },
    viewer: {
      isLoggedIn: false,
      nickname: "",
      email: "",
      avatar: "",
      unreadCount: 0
    },
    articleCount: 0
  };
}

export async function getMockArticleBySlug(_slug: string): Promise<Article> {
  const articlesData = await getArticles({ page: 1, pageSize: 1 });
  return articlesData.items[0];
}

export async function getMockArticles(): Promise<Article[]> {
  const articlesData = await getArticles({ page: 1, pageSize: 100 });
  return articlesData.items;
}

export async function getMockTagsOverview(): Promise<TagsOverview> {
  const tags = await getPublicTags();
  const tagItems: TagItem[] = tags.map((t) => ({
    id: safeNumber(t.id),
    name: t.name,
    slug: t.slug,
    url: `/tags/${t.slug}`,
    count: t.postCount ?? 0
  }));

  const sortedTags = [...tagItems].sort((a, b) => b.count - a.count);

  return {
    tags: sortedTags,
    totalTags: sortedTags.length,
    totalTaggedPosts: sortedTags.reduce((sum, tag) => sum + tag.count, 0),
    hottestTag: sortedTags[0] ?? null
  };
}

export async function getMockMoments(): Promise<MomentItem[]> {
  return [];
}
