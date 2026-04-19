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
      { name: "GitHub", url: "https://github.com/xwh105419517", icon: "github-fill" }
    ],
    footerSocial: [
      {
        name: "GitHub",
        url: "https://github.com/xwh105419517",
        icon: "github-fill",
        position: "left"
      },
      {
        name: "Bilibili",
        url: "https://www.bilibili.com/",
        icon: "bilibili-fill",
        position: "left"
      }
    ],
    footerLinks: [
      { name: "关于", url: "/about" },
      { name: "归档", url: "/archive" }
    ]
  },
  basicConfig: {
    author: "EternalStar",
    authorDesc: "物竞天择，与世纷争",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    homeUrl: "https://example.com"
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
    // {
    //   id: 6,
    //   type: "navigation",
    //   parentId: null,
    //   title: "动态",
    //   url: "/moment",
    //   icon: "ri-send-plane-fill"
    // },
    {
      id: 5,
      type: "about",
      parentId: null,
      title: "关于",
      url: "/about",
      icon: "ri-information-line"
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
    { id: 1, name: "前端工程", slug: "frontend", url: "/category/frontend", count: 18 },
    { id: 2, name: "设计系统", slug: "design", url: "/category/design", count: 9 },
    { id: 3, name: "产品笔记", slug: "product", url: "/category/product", count: 7 },
    { id: 4, name: "生活日常", slug: "life", url: "/category/life", count: 5 },
    { id: 5, name: "项目清单", slug: "projects", url: "/category/projects", count: 8 }
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
      publishTime: "2026-04-16T10:30:00.000Z",
      content: { text: "把 Nuxt 布局平移到 Next，先把骨架搭稳。", location: "深圳" }
    },
    {
      id: 2,
      publishTime: "2026-04-15T18:20:00.000Z",
      content: {
        text: "今天把页脚和侧栏的交互细节也对齐了。",
        images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"]
      }
    },
    {
      id: 3,
      publishTime: "2026-04-14T14:15:00.000Z",
      content: { text: "假数据层先跑通，后面替换真实接口会轻很多。", location: "广州" }
    },
    {
      id: 4,
      publishTime: "2026-04-13T20:45:00.000Z",
      content: {
        text: "Next.js 16 的 App Router 真的很强大，推荐大家都试试！",
        images: [
          "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80",
          "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80"
        ]
      }
    },
    {
      id: 5,
      publishTime: "2026-04-12T11:00:00.000Z",
      content: {
        text: "Tailwind CSS v4 的 CSS-first 配置太香了，主题切换变得前所未有的简单。",
        location: "深圳"
      }
    },
    {
      id: 6,
      publishTime: "2026-04-11T16:30:00.000Z",
      content: {
        text: "完成了动态页面的瀑布流布局，CSS Grid 配合 JavaScript 计算高度，效果很不错。",
        images: [
          "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
          "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
        ]
      }
    },
    {
      id: 7,
      publishTime: "2026-04-10T09:15:00.000Z",
      content: {
        text: "TypeScript 5.4 的 NoInfer 工具类型终于来了，类型推断更精准了。",
        location: "广州"
      }
    },
    {
      id: 8,
      publishTime: "2026-04-09T22:00:00.000Z",
      content: {
        text: "Shadcn/ui 组件库真的很不错，直接复制代码到项目里，完全可控。",
        images: [
          "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
          "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
        ]
      }
    },
    {
      id: 9,
      publishTime: "2026-04-08T14:30:00.000Z",
      content: { text: "Zustand 5.0 发布，轻量级状态管理首选，强烈推荐！", location: "深圳" }
    },
    {
      id: 10,
      publishTime: "2026-04-07T19:45:00.000Z",
      content: {
        text: "React Server Components 彻底改变了前端开发范式，服务端客户端界限更清晰。",
        images: [
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
          "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
        ]
      }
    },
    {
      id: 11,
      publishTime: "2026-04-06T08:20:00.000Z",
      content: {
        text: "周末去徒步，登顶的那一刻感觉所有的疲惫都值了。大自然真的太美好了！",
        location: "惠州"
      }
    },
    {
      id: 12,
      publishTime: "2026-04-05T17:10:00.000Z",
      content: {
        text: "博客的深色模式适配完成，现在支持跟随系统主题自动切换了。",
        location: "深圳"
      }
    },
    {
      id: 13,
      publishTime: "2026-04-04T21:30:00.000Z",
      content: {
        text: "研究发现 CSS 的 container queries 比 media queries 更加灵活，推荐大家试试！",
        images: ["https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80"]
      }
    },
    {
      id: 14,
      publishTime: "2026-04-03T12:00:00.000Z",
      content: {
        text: "性能优化无止境，今天把博客的 LCP 从 3.2s 优化到了 1.8s，进步很明显。",
        location: "广州"
      }
    },
    {
      id: 15,
      publishTime: "2026-04-02T15:45:00.000Z",
      content: {
        text: "最近在研究 Astro 框架，适合做内容类网站，性能真的很强。",
        images: [
          "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
        ]
      }
    },
    {
      id: 16,
      publishTime: "2026-04-01T10:00:00.000Z",
      content: {
        text: "博客的评论区上线了，支持 Markdown 语法，欢迎大家留言交流！",
        location: "深圳"
      }
    },
    {
      id: 17,
      publishTime: "2026-03-31T20:15:00.000Z",
      content: {
        text: "终于把文章详情页的目录导航做完了，支持滚动高亮当前章节。",
        location: "广州"
      }
    },
    {
      id: 18,
      publishTime: "2026-03-30T14:30:00.000Z",
      content: {
        text: "新写了一篇关于 React Server Components 的文章，花了一周时间整理，欢迎阅读指正。",
        images: [
          "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
        ]
      }
    },
    {
      id: 19,
      publishTime: "2026-03-29T09:00:00.000Z",
      content: { text: "博客的移动端适配基本完成了，所有页面都能正常显示。", location: "深圳" }
    },
    {
      id: 20,
      publishTime: "2026-03-28T18:45:00.000Z",
      content: {
        text: "Framer Motion 动画库真强大，页面过渡动画做起来太顺手了。",
        location: "广州"
      }
    },
    {
      id: 21,
      publishTime: "2026-03-27T11:20:00.000Z",
      content: {
        text: "博客搬家到新服务器，备案也终于通过了，以后可以稳定访问啦！",
        location: "深圳"
      }
    },
    {
      id: 22,
      publishTime: "2026-03-26T16:00:00.000Z",
      content: {
        text: "Next.js 16 的 ISR 真的很强大，静态生成加增量更新，完美组合。",
        images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"]
      }
    },
    {
      id: 23,
      publishTime: "2026-03-25T20:30:00.000Z",
      content: { text: "给自己的博客加了 RSS 订阅功能，方便老读者跟进更新。", location: "深圳" }
    },
    {
      id: 24,
      publishTime: "2026-03-24T13:15:00.000Z",
      content: {
        text: "写了一篇关于前端工程化的思考，总结了这几年的一些经验教训。",
        images: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
          "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80"
        ]
      }
    },
    {
      id: 25,
      publishTime: "2026-03-23T08:45:00.000Z",
      content: {
        text: "Tailwind CSS 的自定义主题配置终于搞清楚了，design token 设计很重要。",
        location: "广州"
      }
    },
    {
      id: 26,
      publishTime: "2026-03-22T17:20:00.000Z",
      content: { text: "博客上线一周年，写篇文章总结一下这一年的成长和收获。", location: "深圳" }
    },
    {
      id: 27,
      publishTime: "2026-03-21T21:00:00.000Z",
      content: {
        text: "部署了博客的评论区反垃圾机制，终于清净多了。",
        images: [
          "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
          "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
        ]
      }
    },
    {
      id: 28,
      publishTime: "2026-03-20T10:30:00.000Z",
      content: {
        text: "TypeScript 的类型编程真是一门艺术，高级类型用好了可以减少很多运行时错误。",
        location: "广州"
      }
    },
    {
      id: 29,
      publishTime: "2026-03-19T15:45:00.000Z",
      content: {
        text: "博客的 SEO 优化做了大半，sitemap、robots.txt 都配置好了，等待搜索引擎收录。",
        location: "深圳"
      }
    },
    {
      id: 30,
      publishTime: "2026-03-18T19:15:00.000Z",
      content: {
        text: "又写完了一篇长文，这次是关于微前端架构的实践心得，万字长文诚意满满。",
        images: [
          "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80",
          "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
          "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
        ]
      }
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

export const mockArticles = [
  {
    id: 1,
    slug: "2025-year-summary",
    title: "2025 年度总结",
    url: "/posts/2025-year-summary",
    summary: "2025 再见，期待 2026 更好，怀揣理想，继续出发！",
    cover:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80",
    publishTime: "2026-01-01T00:00:00.000Z",
    viewCount: 2345,
    commentCount: 2,
    category: { id: 4, name: "生活日常", slug: "life", url: "/category/life" },
    isTop: true,
    isEssence: false,
    tags: [{ id: 1, name: "年度总结", url: "/tag/yearly-summary" }],
    sections: [],
    content: `## 前言

2025 年已经过去，回首这一年，有太多值得记录的时刻。从工作到生活，从技术到个人成长，这一年可以说是充实而忙碌的一年。

## 工作回顾

今年主要在做公司的前端架构升级项目，将原有的 jQuery 技术栈逐步迁移到 React + TypeScript。过程中遇到了不少挑战，但也收获了很多。

### 技术成长

- 深入学习了 React 18 的新特性
- 掌握了 TypeScript 高级类型技巧
- 参与了组件库的设计与开发

## 生活感悟

工作之余，也尝试着让生活更加丰富。周末常常去徒步，享受大自然的宁静。

## 展望 2026

新的一年，希望能够：

1. 持续输出技术文章
2. 完成个人项目开发
3. 保持健康的生活方式

---

感谢这一路上陪伴我的家人和朋友，2026 继续加油！`
  },
  {
    id: 2,
    slug: "self-research-blog-experience",
    title: "自研博客重塑创作体验",
    url: "/posts/self-research-blog",
    summary: "自研博客系统打造极致极简创作体验，@Talen 带你探索全新可能。",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    publishTime: "2026-01-23T00:00:00.000Z",
    viewCount: 3456,
    commentCount: 20,
    category: { id: 5, name: "项目清单", slug: "projects", url: "/category/projects" },
    isTop: false,
    isEssence: true,
    tags: [
      { id: 2, name: "建站", url: "/tag/blog-build" },
      { id: 3, name: "博客", url: "/tag/personal-blog" }
    ],
    sections: [],
    content: `## 为什么自研博客

市面上的博客平台虽然成熟，但总有一些限制：

- 无法自定义主题样式
- 数据迁移困难
- 隐私性问题

于是决定自己动手，从零开始构建一个完全可控的博客系统。

## 技术选型

### 前端

- **Next.js 16** - App Router 架构
- **React 19** - 全新特性支持
- **Tailwind CSS** - 现代化 CSS 方案

### 后端（预留）

- **Node.js** API 层
- **PostgreSQL** 数据存储

## 核心功能

1. Markdown 编写体验
2. 响应式设计
3. SEO 优化
4. 评论系统

## 后续计划

- 支持更多自定义主题
- 添加深色模式
- 优化移动端体验

> "好的工具让人专注内容，而非工具本身"`
  },
  {
    id: 3,
    slug: "openlist-file-list",
    title: "替代 Alist 的文件列表程序 OpenList",
    url: "/posts/openlist",
    summary:
      "一个全新的文件列表解决方案，提供更好的用户体验和更高的性能。支持多种存储后端，轻松管理你的文件资源。",
    cover:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80",
    publishTime: "2026-03-15T00:00:00.000Z",
    viewCount: 1890,
    commentCount: 8,
    category: { id: 1, name: "前端工程", slug: "frontend", url: "/category/frontend" },
    isTop: false,
    isEssence: false,
    tags: [
      { id: 4, name: "OpenList", url: "/tag/openlist" },
      { id: 5, name: "文件管理", url: "/tag/file-manager" }
    ],
    sections: [],
    content: `## OpenList 简介

OpenList 是一个轻量级的文件列表程序，旨在提供更好的用户体验。

### 主要特性

| 特性 | 描述 |
|------|------|
| 多存储支持 | S3、阿里云OSS、腾讯COS 等 |
| 界面简洁 | 现代化的 UI 设计 |
| 速度快 | 优化的文件扫描算法 |

## 安装部署

\`\`\`bash
docker run -d --name openlist \\
  -p 8080:8080 \\
  -v /path/to/config:/app/config \\
  openlist/openlist
\`\`\`

## 使用感受

相比 Alist，OpenList 在以下方面有所改进：

1. **更快的启动速度**
2. **更现代的界面**
3. **更好的移动端适配**

## 结语

如果你正在寻找一个简单高效的文件列表工具，不妨试试 OpenList。`
  },
  {
    id: 4,
    slug: "next-16-app-router",
    title: "Next.js 16 App Router 深入理解",
    url: "/posts/next-16-app-router",
    summary:
      "深入了解 Next.js 16 的 App Router 架构，探索 React Server Components 的全新范式，学习如何构建高性能的现代化 Web 应用。本文将全面解析从基础概念到高级用法的核心知识点。",
    cover:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1600&q=80",
    publishTime: "2026-04-01T00:00:00.000Z",
    viewCount: 4567,
    commentCount: 15,
    category: { id: 1, name: "前端工程", slug: "frontend", url: "/category/frontend" },
    isTop: false,
    isEssence: false,
    tags: [
      { id: 6, name: "Next.js", url: "/tag/nextjs" },
      { id: 7, name: "React", url: "/tag/react" },
      { id: 8, name: "SSR", url: "/tag/ssr" }
    ],
    sections: [],
    content: `## Next.js 16 App Router 简介

Next.js 16 引入了全新的 App Router 架构，这是自 Next.js 13 以来的重大更新。App Router 不仅改变了文件组织方式，更重要的是引入了 React Server Components (RSC) 的原生支持，让开发者能够构建更加高效的全栈应用。

### 与 Pages Router 的区别

| 特性 | App Router | Pages Router |
|------|------------|--------------|
| 服务器组件 | 默认 | 需要手动配置 |
| 布局共享 | 嵌套布局 | 每次重新渲染 |
| 数据获取 | 异步组件 | getServerSideProps |
| 路由组织 | 文件系统路由 | 同样基于文件系统 |

App Router 的核心理念是将 React 的服务端能力与客户端能力完美融合，让开发者可以根据每个组件的需求自由选择渲染环境。

## React Server Components

### 什么是 Server Components

Server Components 是在服务器端渲染的 React 组件，它们可以直接访问后端资源而不会增加客户端 bundle 大小。Server Components 特别适合用于数据获取、敏感信息处理和大型依赖库的引用。

### 使用示例

\`\`\`tsx
async function ArticleList() {
  const articles = await db.query('SELECT * FROM articles');

  return (
    <ul>
      {articles.map(article => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

### 客户端组件

客户端组件使用 "use client" 指令声明，适合需要交互和状态的场景。

## 流式渲染

Next.js 16 支持流式渲染，通过 Suspense 和 Streaming 可以显著提升用户体验。

### Suspense 配合使用

\`\`\`tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>我的博客</h1>
      <Suspense fallback={<Loading />}>
        <ArticleList />
      </Suspense>
    </div>
  );
}
\`\`\`

## 布局系统

### 根布局

\`app/layout.tsx\` 是根布局，所有页面都会共享这个布局。

### 嵌套布局

每个路由段可以有自己布局，实现布局的复用和定制。

## 数据获取模式

### 服务端数据获取

在 App Router 中，数据获取变得非常简单，可以直接在异步组件中获取数据。

### 路由处理器

使用 Route Handlers 处理 API 请求。

## 总结

App Router 代表了 React 全栈开发的未来方向，值得深入学习。`
  },
  {
    id: 5,
    slug: "react-server-components",
    title: "React Server Components 最佳实践",
    url: "/posts/rsc-best-practices",
    summary: "总结 React Server Components 在实际项目中的最佳实践方案。",
    publishTime: "2026-03-28T00:00:00.000Z",
    viewCount: 2890,
    commentCount: 10,
    category: { id: 1, name: "前端工程", slug: "frontend", url: "/category/frontend" },
    isTop: false,
    isEssence: false,
    tags: [
      { id: 7, name: "React", url: "/tag/react" },
      { id: 8, name: "SSR", url: "/tag/ssr" }
    ],
    sections: [],
    content: `## React Server Components 最佳实践

React Server Components (RSC) 是 React 18 引入的重要特性，下面分享一些在实际项目中的最佳实践。

### 1. 合理划分 Server 和 Client 组件

**适合 Server Component 的场景：**
- 数据获取
- 访问后端资源
- 敏感信息处理
- 大型依赖库

**适合 Client Component 的场景：**
- 用户交互
- 状态管理
- 浏览器 API 使用
- 需要实时更新的内容

### 2. 数据获取模式

\`\`\`tsx
// 推荐：使用 async/await
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

async function ServerComponent() {
  const data = await getData();
  return <div>{data.name}</div>;
}
\`\`\`

### 3. 避免水合不匹配

确保 Server 和 Client 渲染结果一致，避免使用 \`Date.now()\` 等不稳定的值。

## 总结

合理使用 RSC 可以显著提升应用性能和开发体验。`
  },
  {
    id: 6,
    slug: "tailwind-v4-features",
    title: "Tailwind CSS v4 新特性解析",
    url: "/posts/tailwind-v4",
    summary:
      "全面解读 Tailwind CSS v4 带来的全新特性：CSS-first 配置、更强大的 JIT 引擎、原生 CSS 变量支持以及性能优化。学习如何利用这些新特性提升开发效率。",
    cover:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=1600&q=80",
    publishTime: "2026-03-25T00:00:00.000Z",
    viewCount: 3210,
    commentCount: 12,
    category: { id: 2, name: "设计系统", slug: "design", url: "/category/design" },
    isTop: false,
    isEssence: false,
    tags: [
      { id: 9, name: "Tailwind CSS", url: "/tag/tailwind-css" },
      { id: 10, name: "CSS", url: "/tag/css" }
    ],
    sections: [],
    content: `## Tailwind CSS v4 新特性

Tailwind CSS v4 带来了许多激动人心的新特性，让我们一起来看看。

### CSS-first 配置

v4 最大的变化是转向 CSS-first 配置方式：

\`\`\`css
@theme {
  --color-primary: #4facfe;
  --spacing: 0.75rem;
}
\`\`\`

### 原生 CSS 变量

现在 Tailwind 直接利用 CSS 变量的能力，主题定制更加灵活。

### 性能提升

- 编译速度提升
- 生成的 CSS 文件更小
- JIT 引擎优化

## 升级建议

1. 仔细阅读迁移文档
2. 测试现有组件兼容性
3. 逐步采用新特性

> v4 是一个重大版本升级，建议在个人项目中先尝试。`
  },
  {
    id: 7,
    slug: "typescript-5-4-improvements",
    title: "TypeScript 5.4 类型推断改进",
    url: "/posts/ts-5-4-improvements",
    summary:
      "探索 TypeScript 5.4 版本在类型推断方面的重大改进，包括 NoInfer 工具类型、闭包中的类型推断优化等。",
    cover:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80",
    publishTime: "2026-03-20T00:00:00.000Z",
    viewCount: 1567,
    commentCount: 5,
    category: { id: 1, name: "前端工程", slug: "frontend", url: "/category/frontend" },
    isTop: false,
    isEssence: false,
    tags: [{ id: 11, name: "TypeScript", url: "/tag/typescript" }],
    sections: [],
    content: `## TypeScript 5.4 类型推断改进

TypeScript 5.4 带来了多项类型推断改进，让我们来详细了解。

### NoInfer 工具类型

\`\`\`typescript
function createSignal<T>(value: T) {
  // 阻止 TypeScript 自动推断 T
}

function NoInfer<T>(value: T) {
  return value;
}
\`\`\`

### 闭包类型推断优化

在某些场景下，TypeScript 现在能更准确地推断闭包中变量的类型。

## 总结

这些改进让 TypeScript 的类型系统更加智能和准确。`
  },
  {
    id: 8,
    slug: "zustand-5-paradigm",
    title: "Zustand 5.0 状态管理新范式",
    url: "/posts/zustand-5",
    summary:
      "深入了解 Zustand 5.0 带来的全新状态管理理念，学习如何利用中间件、持久化、DevTools 等高级功能构建更优雅的状态管理方案。适合从 Redux 或 Context 迁移的开发者。",
    cover:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1600&q=80",
    publishTime: "2026-03-15T00:00:00.000Z",
    viewCount: 2100,
    commentCount: 7,
    category: { id: 1, name: "前端工程", slug: "frontend", url: "/category/frontend" },
    isTop: false,
    isEssence: false,
    tags: [
      { id: 12, name: "Zustand", url: "/tag/zustand" },
      { id: 7, name: "React", url: "/tag/react" }
    ],
    sections: [],
    content: `## Zustand 5.0 状态管理新范式

Zustand 是一个轻量级的 React 状态管理库，5.0 版本带来了更多强大功能。

### 基本使用

\`\`\`typescript
import { create } from 'zustand';

interface Store {
  count: number;
  increment: () => void;
}

const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
\`\`\`

### 中间件系统

Zustand 5.0 改进了中间件系统：

- **持久化** - 自动保存状态到 localStorage
- **DevTools** - 调试体验优化
- **日志** - 开发环境状态追踪

### 与 Redux 对比

| 特性 | Zustand | Redux |
|------|---------|-------|
| 学习曲线 | 平缓 | 陡峭 |
| Boilerplate | 少 | 多 |
| 性能 | 优秀 | 优秀 |
| DevTools | 完善 | 完善 |

## 总结

Zustand 是轻量级应用的好选择。`
  },
  {
    id: 9,
    slug: "shadcn-ui-guide",
    title: "Shadcn/ui 组件库实战指南",
    url: "/posts/shadcn-ui-guide",
    summary: "Shadcn/ui 实战指南，从零开始构建你的组件库。",
    publishTime: "2026-03-10T00:00:00.000Z",
    viewCount: 1890,
    commentCount: 9,
    category: { id: 2, name: "设计系统", slug: "design", url: "/category/design" },
    isTop: false,
    isEssence: false,
    tags: [{ id: 13, name: "Shadcn UI", url: "/tag/shadcn-ui" }],
    sections: [],
    content: `## Shadcn/ui 组件库实战指南

Shadcn/ui 不是传统意义上的组件库，而是一组可复制粘贴到项目中的精美组件。

### 核心特点

- **不是 npm 包** - 组件代码直接在你的项目中
- **可定制** - 完全控制组件源码
- **无障碍** - WAI-ARIA 标准支持

### 安装使用

\`\`\`bash
npx shadcn@latest add button
\`\`\`

### 组件示例

\`\`\`tsx
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Button variant="default" size="lg">
      点击我
    </Button>
  );
}
\`\`\`

## 总结

Shadcn/ui 是一种全新的组件使用方式，值得尝试。`
  },
  {
    id: 10,
    slug: "frontend-performance-checklist",
    title: "前端性能优化清单",
    url: "/posts/performance-checklist",
    summary:
      "前端性能优化完整清单，涵盖加载性能、渲染性能、JavaScript 执行优化、图片优化、缓存策略等多个维度。帮助你的网站获得更好的 Core Web Vitals 评分，提升用户体验。",
    cover:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    publishTime: "2026-03-05T00:00:00.000Z",
    viewCount: 3456,
    commentCount: 18,
    category: { id: 1, name: "前端工程", slug: "frontend", url: "/category/frontend" },
    isTop: false,
    isEssence: true,
    tags: [
      { id: 14, name: "性能优化", url: "/tag/performance" },
      { id: 10, name: "CSS", url: "/tag/css" }
    ],
    sections: [],
    content: `## 前端性能优化完整清单

性能优化是前端开发中的重要课题，这是一份全面的优化清单。

### 1. 加载性能

- [ ] 压缩 CSS 和 JavaScript
- [ ] 启用 Gzip/Brotli 压缩
- [ ] 使用 CDN 加速静态资源
- [ ] 减少 HTTP 请求数量
- [ ] DNS 预读取

### 2. 渲染性能

- [ ] 避免布局抖动 (Layout Thrashing)
- [ ] 使用 CSS transform 替代 top/left 动画
- [ ] 减少重绘和重排
- [ ] 使用 will-change 优化

### 3. 图片优化

\`\`\`html
<img 
  src="small.jpg"
  srcset="small.jpg 500w, large.jpg 1000w"
  sizes="(max-width: 600px) 100vw, 50vw"
  loading="lazy"
  alt="描述"
/>
\`\`\`

### 4. JavaScript 优化

- 延迟加载非关键 JS
- 使用 Web Workers 处理耗时计算
- 避免内存泄漏
- 使用虚拟滚动处理长列表

### 5. Core Web Vitals

| 指标 | 目标 | 优化方法 |
|------|------|----------|
| LCP | < 2.5s | 优化服务器响应、CDN |
| FID | < 100ms | 减少主线程阻塞 |
| CLS | < 0.1 | 预留空间给动态内容 |

## 总结

性能优化是一个持续的过程，需要不断监控和改进。`
  },
  {
    id: 11,
    slug: "short-article-toc-test",
    title: "短篇文章 - 目录测试",
    url: "/posts/short-article-toc-test",
    summary: "这是一篇短篇文章，用于测试目录（TOC）功能是否正常渲染和交互。",
    cover:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    publishTime: "2026-04-17T00:00:00.000Z",
    viewCount: 100,
    commentCount: 0,
    category: { id: 1, name: "前端工程", slug: "frontend", url: "/category/frontend" },
    isTop: false,
    isEssence: false,
    tags: [{ id: 1, name: "测试", url: "/tag/test" }],
    sections: [
      {
        id: "intro",
        text: "简介",
        level: 2,
        body: "这是一篇短篇文章的简介部分。"
      },
      {
        id: "feature-a",
        text: "功能 A",
        level: 2,
        body: "这是功能 A 的描述。"
      },
      {
        id: "conclusion",
        text: "总结",
        level: 2,
        body: "文章总结。"
      }
    ],
    content: `## 简介

这是一篇短篇文章，用于测试目录功能是否正常渲染和交互。

## 功能 A

这是功能 A 的描述内容，比较简单。

## 总结

文章总结部分，篇幅较短。`
  },
  {
    id: 12,
    slug: "long-article-toc-test",
    title: "长篇文章 - 目录测试（多层级）",
    url: "/posts/long-article-toc-test",
    summary:
      "这是一篇长篇文章，包含多级标题结构，用于全面测试目录（TOC）的层级渲染、滚动高亮和交互功能。",
    cover:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1600&q=80",
    publishTime: "2026-04-17T01:00:00.000Z",
    viewCount: 200,
    commentCount: 0,
    category: { id: 1, name: "前端工程", slug: "frontend", url: "/category/frontend" },
    isTop: false,
    isEssence: false,
    tags: [
      { id: 1, name: "测试", url: "/tag/test" },
      { id: 2, name: "目录", url: "/tag/toc" }
    ],
    sections: [
      {
        id: "preface",
        text: "前言",
        level: 2,
        body: "这是一篇用于测试目录功能的长篇文章。"
      },
      {
        id: "chapter-1",
        text: "第一章：基础概念",
        level: 2,
        body: "介绍基础概念。"
      },
      {
        id: "what-is-toc",
        text: "什么是目录",
        level: 3,
        body: "目录的定义和作用。"
      },
      {
        id: "toc-benefits",
        text: "目录的好处",
        level: 3,
        body: "使用目录的优势。"
      },
      {
        id: "chapter-2",
        text: "第二章：技术实现",
        level: 2,
        body: "技术实现部分。"
      },
      {
        id: "html-structure",
        text: "HTML 结构",
        level: 3,
        body: "HTML 结构的实现方式。"
      },
      {
        id: "css-styling",
        text: "CSS 样式",
        level: 3,
        body: "CSS 样式的实现方式。"
      },
      {
        id: "nested-style",
        text: "嵌套样式处理",
        level: 4,
        body: "嵌套样式的细节处理。"
      },
      {
        id: "responsive-design",
        text: "响应式设计",
        level: 3,
        body: "响应式设计的实现方案。"
      },
      {
        id: "chapter-3",
        text: "第三章：交互功能",
        level: 2,
        body: "交互功能的实现。"
      },
      {
        id: "scroll-highlight",
        text: "滚动高亮",
        level: 3,
        body: "滚动高亮功能的实现原理。"
      },
      {
        id: "smooth-scroll",
        text: "平滑滚动",
        level: 3,
        body: "平滑滚动的实现方案。"
      },
      {
        id: "mobile-support",
        text: "移动端适配",
        level: 3,
        body: "移动端适配的要点。"
      },
      {
        id: "chapter-4",
        text: "第四章：性能优化",
        level: 2,
        body: "性能优化相关。"
      },
      {
        id: "lazy-render",
        text: "懒加载渲染",
        level: 3,
        body: "目录项的懒加载策略。"
      },
      {
        id: "debounce-scroll",
        text: "防抖滚动监听",
        level: 3,
        body: "使用防抖优化滚动监听性能。"
      },
      {
        id: "conclusion",
        text: "总结",
        level: 2,
        body: "文章总结。"
      }
    ],
    content: `## 前言

这是一篇用于测试目录功能的长篇文章，包含多级标题结构和丰富的内容。通过这篇文章可以全面测试目录（Table of Contents, TOC）的各项功能。

## 第一章：基础概念

在开始深入学习之前，我们先来了解一些基础概念。这些概念是理解后续内容的关键。

### 什么是目录

目录（Table of Contents）是文档或网页中的导航结构，通常显示在页面的侧边栏或顶部。它列出了文档中所有的标题和章节，方便用户快速定位和跳转到感兴趣的内容区域。

一个良好的目录结构应该：
- 清晰地反映文档的层级关系
- 提供快速导航的能力
- 具有良好的可读性和可用性

### 目录的好处

使用目录有以下几个显著的好处：

1. **快速导航**：用户可以通过点击目录项快速跳转到对应章节
2. **内容概览**：目录提供了文档结构的概览，帮助用户了解文章框架
3. **提升体验**：对于长文章，目录可以显著提升用户的阅读体验
4. **SEO 友好**：结构化的目录有助于搜索引擎理解页面内容

## 第二章：技术实现

接下来我们深入探讨目录功能的技术实现方案。这一章会涵盖从 HTML 结构到 CSS 样式再到 JavaScript 交互的完整技术栈。

### HTML 结构

目录的 HTML 结构通常使用嵌套的列表来实现：

\`\`\`html
<nav class="toc">
  <ul>
    <li>
      <a href="#chapter-1">第一章：基础概念</a>
      <ul>
        <li><a href="#what-is-toc">什么是目录</a></li>
        <li><a href="#toc-benefits">目录的好处</a></li>
      </ul>
    </li>
  </ul>
</nav>
\`\`\`

### CSS 样式

CSS 样式方面需要注意缩进、颜色和悬停效果：

\`\`\`css
.toc ul {
  list-style: none;
  padding-left: 0;
}

.toc ul ul {
  padding-left: 16px;
}

.toc a {
  color: var(--text-secondary);
  text-decoration: none;
}

.toc a:hover {
  color: var(--theme-color);
}
\`\`\`

#### 嵌套样式处理

对于多层级的嵌套，我们需要通过缩进来区分层级关系。通常每增加一级就增加 16px 的左边距。同时，不同层级可以使用不同的字体大小或颜色来增强视觉区分度。

### 响应式设计

响应式设计是目录功能中不可忽视的一环：

- **桌面端**：目录通常固定在侧边栏，随页面滚动高亮当前章节
- **平板端**：可能需要折叠目录，通过按钮展开
- **移动端**：目录通常放在文章顶部或作为抽屉菜单

## 第三章：交互功能

交互功能让目录从静态的导航列表变成了动态的用户界面组件。

### 滚动高亮

滚动高亮是目录中最核心的交互功能之一。当用户滚动页面时，目录中对应的章节项会自动高亮显示。实现原理如下：

1. 监听页面的滚动事件
2. 计算各个章节标题在视口中的位置
3. 找出距离视口顶部最近的标题
4. 将该标题对应的目录项添加高亮样式

\`\`\`typescript
function handleScroll() {
  const headings = document.querySelectorAll('h2, h3, h4');
  let currentSection = '';
  
  headings.forEach(heading => {
    const rect = heading.getBoundingClientRect();
    if (rect.top <= 100) {
      currentSection = heading.id;
    }
  });
  
  // 更新高亮状态
  updateTocHighlight(currentSection);
}
\`\`\`

### 平滑滚动

点击目录项时，页面应该平滑滚动到对应章节，而不是瞬间跳转：

\`\`\`javascript
document.querySelectorAll('.toc a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
\`\`\`

### 移动端适配

在移动端，目录的处理方式会有所不同：

- 使用汉堡菜单或抽屉组件来展示目录
- 点击目录项后自动收起菜单
- 考虑屏幕高度，可能需要限制目录的最大高度并添加滚动

## 第四章：性能优化

当文章非常长、目录项非常多时，性能优化就显得尤为重要。

### 懒加载渲染

对于包含上百个章节的超长文章，可以考虑使用 Intersection Observer API 来实现目录项的懒加载。只有当某个章节接近视口时才渲染对应的目录项。

### 防抖滚动监听

滚动事件会频繁触发，如果不加以限制会导致性能问题。使用防抖（debounce）或节流（throttle）可以有效减少事件处理函数的执行频率：

\`\`\`typescript
import { debounce } from 'lodash';

const handleScroll = debounce(() => {
  // 处理滚动逻辑
}, 100);

window.addEventListener('scroll', handleScroll);
\`\`\`

## 总结

通过这篇文章，我们全面测试了目录功能的各个方面：

- 基础概念和好处
- HTML/CSS 技术实现
- 滚动高亮和平滑滚动等交互功能
- 性能优化策略

希望这篇测试文章能够帮助验证目录组件的各项功能是否正常工作。`
  }
];
