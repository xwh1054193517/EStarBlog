import type { Article, SiteData } from "@/lib/types";

export const mockSiteData: SiteData = {
  blogConfig: {
    title: "EstarBlog",
    subtitle: "EternalStar",
    typingTexts: ["记录生活思考", "收藏世界真知", "design to react"],
    announcement:
      "<p>这是 Next 迁移演示版本，当前所有布局数据都来自 <strong>mock</strong> 层。</p>",
    established: "2024-01-01",
    sidebarSocial: [
      { name: "GitHub", url: "https://github.com/", icon: "github-fill" },
      { name: "Mail", url: "mailto:hello@example.com", icon: "mail-line" },
      { name: "RSS", url: "/rss.xml", icon: "rss-line" }
    ],
    footerSocial: [
      { name: "GitHub", url: "https://github.com/", icon: "github-fill", position: "left" },
      {
        name: "Bilibili",
        url: "https://www.bilibili.com/",
        icon: "bilibili-fill",
        position: "left"
      },
      { name: "Mail", url: "mailto:hello@example.com", icon: "mail-line", position: "right" },
      { name: "RSS", url: "/rss.xml", icon: "rss-line", position: "right" }
    ],
    footerLinks: [
      { name: "关于", url: "/about" },
      { name: "归档", url: "/archive" },
      { name: "友链", url: "/friend" }
    ]
  },
  basicConfig: {
    author: "Flec",
    authorDesc: "喜欢做产品，也喜欢把页面打磨到舒服为止。",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    homeUrl: "https://example.com",
    icp: "粤ICP备2024000001号",
    policeRecord: "粤公网安备44030002000001号"
  },
  navigationMenus: [
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
      title: "归档",
      url: "/archive",
      icon: "ri-archive-line"
    },
    {
      id: 4,
      type: "navigation",
      parentId: null,
      title: "瞬间",
      url: "/moment",
      icon: "ri-quill-pen-line"
    },
    {
      id: 5,
      type: "about",
      parentId: null,
      title: "关于",
      url: "/about",
      icon: "ri-quill-pen-line"
    }
  ],
  footerMenus: [
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
  ],
  aggregateMenus: [
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
  ],
  categories: [
    { id: 1, name: "前端工程", url: "/category/frontend", count: 18 },
    { id: 2, name: "设计系统", url: "/category/design", count: 9 },
    { id: 3, name: "产品笔记", url: "/category/product", count: 7 }
  ],
  tags: [
    { id: 1, name: "Next.js", slug: "nextjs", url: "/tag/nextjs", count: 18 },
    { id: 2, name: "TypeScript", slug: "typescript", url: "/tag/typescript", count: 15 },
    { id: 3, name: "React", slug: "react", url: "/tag/react", count: 14 },
    { id: 4, name: "CSS", slug: "css", url: "/tag/css", count: 10 },
    { id: 5, name: "Node.js", slug: "nodejs", url: "/tag/nodejs", count: 8 },
    { id: 6, name: "Motion", slug: "motion", url: "/tag/motion", count: 6 },
    { id: 7, name: "NestJS", slug: "nestjs", url: "/tag/nestjs", count: 9 },
    { id: 8, name: "博客搭建", slug: "blog-build", url: "/tag/blog-build", count: 7 },
    { id: 9, name: "Tailwind CSS", slug: "tailwind-css", url: "/tag/tailwind-css", count: 11 },
    { id: 10, name: "工程化", slug: "engineering", url: "/tag/engineering", count: 13 },
    { id: 11, name: "部署", slug: "deployment", url: "/tag/deployment", count: 5 },
    { id: 12, name: "性能优化", slug: "performance", url: "/tag/performance", count: 6 },
    { id: 13, name: "Shadcn UI", slug: "shadcn-ui", url: "/tag/shadcn-ui", count: 4 },
    { id: 14, name: "个人博客", slug: "personal-blog", url: "/tag/personal-blog", count: 12 },
    { id: 15, name: "SSR", slug: "ssr", url: "/tag/ssr", count: 5 },
    { id: 16, name: "动画设计", slug: "motion-design", url: "/tag/motion-design", count: 7 }
  ],
  archives: [
    { year: "2026", month: "04", count: 4 },
    { year: "2026", month: "03", count: 6 },
    { year: "2026", month: "02", count: 5 },
    { year: "2026", month: "01", count: 8 },
    { year: "2025", month: "12", count: 7 },
    { year: "2025", month: "11", count: 3 },
    { year: "2025", month: "10", count: 5 }
  ],
  moments: [
    {
      id: 1,
      publishTime: "2026-04-10",
      content: { text: "把 Nuxt 布局平移到 Next，先把骨架搭稳。", link: "/posts/next-migration" }
    },
    {
      id: 2,
      publishTime: "2026-04-09",
      content: { text: "今天把页脚和侧栏的交互细节也对齐了。", images: ["/placeholder.png"] }
    },
    {
      id: 3,
      publishTime: "2026-04-08",
      content: { text: "假数据层先跑通，后面替换真实接口会轻很多。", music: "demo" }
    }
  ],
  friends: [
    { id: 1, name: "Aster", url: "https://example.com/aster", description: "做设计系统的朋友" },
    { id: 2, name: "Nova", url: "https://example.com/nova", description: "热衷工程化与性能" },
    { id: 3, name: "Mori", url: "https://example.com/mori", description: "喜欢写产品和写作" },
    { id: 4, name: "Lume", url: "https://example.com/lume", description: "专注创意前端体验" }
  ],
  siteStats: {
    totalWords: 284391,
    totalVisitors: 12782,
    totalPageViews: 49126,
    onlineUsers: 18
  },
  viewer: {
    isLoggedIn: true,
    nickname: "Mock Reader",
    email: "reader@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    unreadCount: 3
  },
  articleCount: 34
};

export const mockArticle: Article = {
  id: 1001,
  slug: "next-layout-migration",
  title: "把 FlecBlog 的布局组件平移到 Next App Router",
  url: "/posts/next-layout-migration",
  summary: "保留原样式和结构，把 Nuxt 的布局链路拆成 Next 可接管的组件树。",
  cover:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  publishTime: "2026-04-11T08:00:00.000Z",
  updateTime: "2026-04-12T09:30:00.000Z",
  location: "Shenzhen",
  viewCount: 1289,
  commentCount: 12,
  category: {
    id: 1,
    name: "前端工程",
    url: "/category/frontend"
  },
  sections: [
    {
      id: "why-next",
      text: "为什么先迁布局层",
      level: 2,
      body: "布局层决定了导航、页头、侧栏、页脚和全局交互的组合方式。先把这一层平移，可以快速验证 Next App Router 的组织方式，同时保证页面视觉稳定。"
    },
    {
      id: "mock-strategy",
      text: "Mock 数据策略",
      level: 2,
      body: "这次没有直接接接口，而是把菜单、站点配置、文章信息、友链和统计都抽到 mock api。这样后续替换成 fetch 或 server action 时，组件层几乎不用动。"
    },
    {
      id: "style-keep",
      text: "如何保持 UI 不变",
      level: 2,
      body: "关键是保留原先的 class 语义、尺寸比例和交互节奏。即使 Vue 模板改成 JSX，样式命名和布局分区仍然维持一致，这样视觉回归更容易。"
    },
    {
      id: "next-structure",
      text: "Next 目录组织",
      level: 3,
      body: "这里把 app、components 和 lib 分开。app 管路由入口，components 放布局组件，lib 里放 mock 数据和工具方法，整体结构对接真实项目会更自然。"
    }
  ],
  content: `
## 为什么先迁布局层
布局层决定了导航、页头、侧栏、页脚和全局交互的组合方式。

## Mock 数据策略
先用本地假数据把取数入口稳定下来。

## 如何保持 UI 不变
保留原 class、间距、颜色和交互状态。

### Next 目录组织
让页面入口和组件职责边界清晰。
`
};
