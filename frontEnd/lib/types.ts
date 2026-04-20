export type MenuType = "navigation" | "footer" | "aggregate" | "about";

export interface MenuItem {
  id: number;
  type: MenuType;
  parentId: number | null;
  title: string;
  url: string;
  icon?: string;
  children?: MenuItem[];
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  url: string;
  count: number;
}

export interface TagItem {
  id: number;
  name: string;
  slug: string;
  url: string;
  count: number;
}

export interface TagsOverview {
  tags: TagItem[];
  totalTags: number;
  totalTaggedPosts: number;
  hottestTag: TagItem | null;
}

export interface ArchiveItem {
  year: string;
  month: string;
  count: number;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  position?: "left" | "right";
}

export interface FooterLink {
  name: string;
  url: string;
}

export interface FriendItem {
  id: number;
  name: string;
  url: string;
  description: string;
}

export interface MomentVideo {
  url: string;
  platform?: "youtube" | "bilibili" | "local";
  video_id?: string;
}

export interface MomentMusic {
  server: "netease" | "tencent" | "kugou" | "xiami" | "baidu";
  type: "song" | "playlist" | "album" | "search" | "artist";
  id: string;
}

export interface MomentLink {
  url: string;
  title: string;
  favicon?: string;
}

export interface MomentItem {
  id: number;
  content: {
    text?: string;
    images?: string[];
    location?: string;
    tags?: string;
    video?: MomentVideo;
    music?: MomentMusic;
    link?: MomentLink;
  };
  publishTime: string;
}

export interface TocSection {
  id: string;
  text: string;
  level: number;
  body: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  url: string;
  summary: string;
  cover?: string;
  content: string;
  publishTime: string;
  updateTime?: string;
  location?: string;
  viewCount: number;
  commentCount: number;
  category: {
    id: number;
    name: string;
    url: string;
  };
  sections: TocSection[];
  isTop?: boolean;
  isEssence?: boolean;
  tags?: Array<{
    id: number;
    name: string;
    url: string;
  }>;
}

export interface BlogConfig {
  title: string;
  subtitle: string;
  typingTexts: string[];
  announcement: string;
  established: string;
  sidebarSocial: SocialLink[];
  footerSocial: SocialLink[];
  footerLinks: FooterLink[];
}

export interface BasicConfig {
  author: string;
  authorDesc: string;
  authorAvatar: string;
  homeUrl: string;
}

export interface SiteStats {
  totalWords: number;
  totalVisitors: number;
  totalPageViews: number;
  onlineUsers: number;
}

export interface ViewerInfo {
  isLoggedIn: boolean;
  nickname: string;
  email: string;
  avatar: string;
  unreadCount: number;
}

export interface SiteData {
  blogConfig: BlogConfig;
  basicConfig: BasicConfig;
  navigationMenus: MenuItem[];
  footerMenus: MenuItem[];
  categories: CategoryItem[];
  tags: TagItem[];
  archives: ArchiveItem[];
  moments: MomentItem[];
  friends: FriendItem[];
  siteStats: SiteStats;
  viewer: ViewerInfo;
  articleCount: number;
}
