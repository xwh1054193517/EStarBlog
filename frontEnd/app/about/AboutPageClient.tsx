"use client";

import DefaultLayout from "@/components/layouts/DefaultLayout";
import type { SiteData } from "@/lib/types";

interface AboutPageClientProps {
  siteData: SiteData;
}

function formatRunningDays(established: string): string {
  const startDate = new Date(established).getTime();
  const now = Date.now();
  return Math.floor((now - startDate) / 86400000).toString();
}

function formatWords(words: number): string {
  if (words >= 10000) {
    return (words / 10000).toFixed(1) + "w";
  }
  if (words >= 1000) {
    return (words / 1000).toFixed(1) + "k";
  }
  return words.toString();
}

export default function AboutPageClient({ siteData }: AboutPageClientProps) {
  const { blogConfig, basicConfig, siteStats, categories, tags } = siteData;

  const runningDays = formatRunningDays(blogConfig.established || "2024-01-01");

  const profileData = [
    { label: "职业", value: "前端开发者", color: "#885fb8" },
    { label: "位置", value: "广州", color: "#4298b4" },
    { label: "目标", value: "全栈", color: "#56a178" },
    { label: "技术", value: "vue + react", color: "#ee10eeff" },

    { label: "性格", value: "INFJ", color: "#f0e003ff" },
    { label: "年龄", value: "00", color: "#0cfafaff" }
  ];

  const versionsData = [
    { name: "ESBlog", version: "1.0" },
    { name: "Next.js", version: "16.0" },
    { name: "Nest.js", version: "x.x" }
  ];

  const socializeData = blogConfig.sidebarSocial || [];
  const creationData = blogConfig.footerSocial?.filter((s) => s.position !== "right") || [];
  const unionData = [
    { name: "博客导航", url: "#" },
    { name: "优秀博客", url: "#" }
  ];

  const storyText =
    "这是一个分享技术与生活的个人博客，记录我的成长历程。希望能通过这个平台，与大家交流技术心得，分享生活中的点滴。";

  return (
    <DefaultLayout siteData={siteData} pageType="page" showSidebar={false}>
      <div id="about-page">
        <div className="Personal-Introduction">
          <div className="PI-box-left">
            <h1 className="title">你好！</h1>
            <div className="title">我是 {basicConfig.author}</div>
            <div className="describe">{blogConfig.subtitle}</div>
            <span className="describe-tips">欢迎来到我的博客</span>
            <div className="PI-button">
              <a href="#one">博主信息</a>
              <a href="#two">本站信息</a>
            </div>
          </div>
          <div className="PI-box-right">
            {basicConfig.authorAvatar && (
              <img src={basicConfig.authorAvatar} alt="个人照片" loading="lazy" />
            )}
          </div>
        </div>

        <div id="one">
          <div className="h1-box">
            <div className="box-top">
              <span>01</span>
              <div className="title-h1">博主信息</div>
            </div>
            <div className="about-layout box-bottom">{basicConfig.author}</div>
          </div>
          <div className="information">
            <div className="about-layout Introduction">
              <div className="bar-box-row">
                {profileData.map((item) => (
                  <div key={item.label} className="bar-box">
                    <span className="tips">{item.label}</span>
                    <div className="title" style={{ color: item.color }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id="two">
          <div className="h1-box">
            <div className="box-top">
              <span>02</span>
              <div className="title-h1">本站信息</div>
            </div>
            <div className="about-layout box-bottom">已稳定运行 {runningDays} 天 🚀</div>
          </div>
          <div className="information">
            <div className="about-layout Version">
              {versionsData.map((v) => (
                <div key={v.name} className="V-box">
                  <div className="title">{v.name}</div>
                  <div className="tips-v">V{v.version}</div>
                </div>
              ))}
            </div>
            <div className="about-layout Statistics">
              <span>{siteData.articleCount}篇文章</span>
              <span>{categories.length}个分类</span>
              <span>{tags.length}个标签</span>
              {siteStats.totalWords && <span>{formatWords(siteStats.totalWords)}字</span>}
            </div>
          </div>
        </div>

        {/* <div className="data">
          <div className="about-layout statistic">
            <div className="tips">浏览</div>
            <div className="title">访问统计</div>
            <div id="statistic">
              <div>
                <span className="tips">今日访客</span>
                <span>{siteStats.totalVisitors}</span>
              </div>
              <div>
                <span className="tips">今日访问</span>
                <span>{siteStats.totalPageViews}</span>
              </div>
              <div>
                <span className="tips">昨日访客</span>
                <span>{Math.floor(siteStats.totalVisitors * 0.8)}</span>
              </div>
              <div>
                <span className="tips">昨日访问</span>
                <span>{Math.floor(siteStats.totalPageViews * 0.75)}</span>
              </div>
              <div>
                <span className="tips">本月访问</span>
                <span>{Math.floor(siteStats.totalPageViews * 3)}</span>
              </div>
            </div>
            <a className="T-btn" href="/statistics">
              更多统计
            </a>
          </div>
        </div> */}
      </div>
    </DefaultLayout>
  );
}
