import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
// @ts-expect-error 该第三方库缺少 TypeScript 类型定义文件
import taskLists from "markdown-it-task-lists";
// @ts-expect-error 该第三方库缺少 TypeScript 类型定义文件
import mark from "markdown-it-mark";
// @ts-expect-error 该第三方库缺少 TypeScript 类型定义文件
import linkAttributes from "markdown-it-link-attributes";
import kbd from "markdown-it-kbd";
// @ts-expect-error 该第三方库缺少 TypeScript 类型定义文件
import sub from "markdown-it-sub";
// @ts-expect-error 该第三方库缺少 TypeScript 类型定义文件
import sup from "markdown-it-sup";
// @ts-expect-error 该第三方库缺少 TypeScript 类型定义文件
import underline from "markdown-it-plugin-underline";
import katex from "@traptitech/markdown-it-katex";

import DOMPurify from "isomorphic-dompurify";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import yaml from "highlight.js/lib/languages/yaml";
import markdown from "highlight.js/lib/languages/markdown";
import bash from "highlight.js/lib/languages/bash";
import shell from "highlight.js/lib/languages/shell";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import diff from "highlight.js/lib/languages/diff";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);
hljs.registerLanguage("go", go);
hljs.registerLanguage("java", java);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("yml", yaml);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("md", markdown);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("docker", dockerfile);
hljs.registerLanguage("diff", diff);

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function generateHeadingId(text: string): string {
  const id = text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return id || `heading-${simpleHash(text)}`;
}

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true
});

md.renderer.rules.fence = (tokens: any[], idx: number) => {
  const token = tokens[idx];
  if (!token) return "";
  const code = token.content;
  const lang = token.info.trim();

  if (lang === "mermaid") {
    return `<pre class="mermaid"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  }

  let highlightedCode = "";
  const displayLang = (lang || "text").toUpperCase();

  if (lang && hljs.getLanguage(lang)) {
    try {
      highlightedCode = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
    } catch {
      highlightedCode = md.utils.escapeHtml(code);
    }
  } else {
    highlightedCode = md.utils.escapeHtml(code);
  }

  const numberedLines = highlightedCode
    .replace(/\n$/, "")
    .split("\n")
    .map(
      (line, index) =>
        `<span class="line-number" data-line="${index + 1}"></span><span class="line-content">${line}</span>`
    )
    .join("\n");

  return `<div class="code-block-container"><div class="code-toolbar"><button class="code-fold-btn" onclick="this.closest('.code-block-container').classList.toggle('collapsed')" title="\u6298\u53e0/\u5c55\u5f00"><i class="ri-arrow-down-s-line"></i></button><span class="code-lang">${displayLang}</span><button class="code-copy-btn" onclick="copyCodeBlock(this)" title="\u590d\u5236\u4ee3\u7801"><i class="ri-file-copy-fill"></i></button></div><pre><code>${numberedLines}</code></pre></div>`;
};

md.use(anchor, {
  slugify: generateHeadingId,
  permalink: false,
  level: [1, 2, 3, 4, 5, 6]
});

md.use(taskLists, {
  enabled: true,
  label: true,
  labelAfter: false
});

md.use(mark);

md.use(linkAttributes, {
  matcher(href: string) {
    return href.startsWith("http://") || href.startsWith("https://");
  },
  attrs: {
    target: "_blank",
    rel: "noopener noreferrer"
  }
});

md.use(kbd);
md.use(sup);
md.use(sub);
md.use(underline);
md.use(katex, { throwOnError: false, errorColor: "#cc0000" });

const defaultTableOpen = md.renderer.rules.table_open || (() => "<table>\n");
const defaultTableClose = md.renderer.rules.table_close || (() => "</table>\n");

md.renderer.rules.table_open = function (
  tokens: any[],
  idx: number,
  options: any,
  env: any,
  self: any
) {
  return '<div class="table-wrapper">' + defaultTableOpen(tokens, idx, options, env, self);
};
md.renderer.rules.table_close = function (
  tokens: any[],
  idx: number,
  options: any,
  env: any,
  self: any
) {
  return defaultTableClose(tokens, idx, options, env, self) + "</div>";
};

export interface TocItem {
  id: string;
  level: number;
  text: string;
  children?: TocItem[];
}

export function renderMarkdown(markdownText: string): string {
  if (!markdownText) return "";
  const rawHtml = md.render(markdownText);
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "u",
      "s",
      "del",
      "ins",
      "mark",
      "code",
      "pre",
      "ul",
      "ol",
      "li",
      "blockquote",
      "cite",
      "footer",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "div",
      "span",
      "sup",
      "sub",
      "kbd",
      "abbr",
      "input",
      "label",
      "button",
      "i",
      "section",
      "svg",
      "path",
      "g",
      "rect",
      "circle",
      "ellipse",
      "line",
      "polygon",
      "polyline",
      "text",
      "foreignObject",
      "video",
      "iframe",
      "audio",
      "source",
      "math",
      "mrow",
      "mi",
      "mo",
      "mn",
      "msup",
      "msub",
      "msubsup",
      "mfrac",
      "msqrt",
      "mroot",
      "mover",
      "munder",
      "munderover",
      "mtable",
      "mtr",
      "mtd",
      "mtext",
      "mspace",
      "mpadded",
      "menclose",
      "mstyle",
      "merror",
      "mfenced",
      "mphantom",
      "annotation",
      "semantics"
    ],
    ALLOWED_ATTR: [
      "href",
      "title",
      "target",
      "rel",
      "src",
      "alt",
      "width",
      "height",
      "class",
      "id",
      "colspan",
      "rowspan",
      "align",
      "type",
      "checked",
      "disabled",
      "for",
      "onclick",
      "start",
      "d",
      "fill",
      "stroke",
      "stroke-width",
      "x",
      "y",
      "cx",
      "cy",
      "r",
      "rx",
      "ry",
      "x1",
      "y1",
      "x2",
      "y2",
      "points",
      "transform",
      "viewBox",
      "xmlns",
      "text-anchor",
      "font-size",
      "font-family",
      "dominant-baseline",
      "data-processed",
      "controls",
      "preload",
      "autoplay",
      "loop",
      "muted",
      "poster",
      "allowfullscreen",
      "scrolling",
      "border",
      "frameborder",
      "framespacing",
      "allow",
      "sandbox",
      "referrerpolicy",
      "data-server",
      "data-type",
      "data-id",
      "data-toc-id",
      "data-tab",
      "data-audio-id",
      "data-music-id",
      "data-music-info",
      "data-embed-url",
      "data-line",
      "style",
      "mathvariant",
      "mathcolor",
      "mathbackground",
      "mathsize",
      "displaystyle",
      "scriptlevel",
      "linethickness",
      "lspace",
      "rspace",
      "stretchy",
      "symmetric",
      "largeop",
      "movablelimits",
      "accent",
      "minsize",
      "maxsize",
      "open",
      "close",
      "separators",
      "notation",
      "encoding",
      "definitionurl",
      "display",
      "xmlns:xlink",
      "depth",
      "voffset",
      "columnalign",
      "rowalign",
      "columnspacing",
      "rowspacing"
    ],
    ALLOW_DATA_ATTR: true,
    ADD_ATTR: ["target", "onclick", "allowfullscreen"]
  });
}

export function extractToc(markdownText: string): TocItem[] {
  if (!markdownText) return [];
  let cleanedMarkdown = markdownText
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~\s*/g, "")
    .replace(/^( {4}|\t).+$/gm, "");

  const headings: TocItem[] = [];
  for (const line of cleanedMarkdown.split("\n")) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match?.[1] && match[2]) {
      headings.push({
        id: generateHeadingId(match[2].trim()),
        level: match[1].length,
        text: match[2].trim()
      });
    }
  }
  return headings;
}

export function countWords(markdownText: string): number {
  if (!markdownText) return 0;
  const text = markdownText
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/[#*_~`|]/g, "")
    .trim();
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  const englishWords = text.match(/[a-zA-Z]+/g) || [];
  return chineseChars.length + englishWords.length;
}

export function estimateReadingTime(markdownText: string, wordsPerMinute = 300): number {
  return Math.ceil(countWords(markdownText) / wordsPerMinute);
}

function copyCodeBlock(button: HTMLElement): void {
  const container = button.closest(".code-block-container");
  if (!container) return;

  const code = container.querySelector("code");
  if (!code) return;

  const codeLines = Array.from(code.querySelectorAll(".line-content"));
  const codeText = codeLines.map((line) => line.textContent || "").join("\n");

  navigator.clipboard
    .writeText(codeText)
    .then(() => {
      const icon = button.querySelector("i");
      if (icon) {
        icon.className = "ri-check-line";
        button.classList.add("copied");
      }

      setTimeout(() => {
        if (icon) {
          icon.className = "ri-file-copy-fill";
          button.classList.remove("copied");
        }
      }, 2000);
    })
    .catch((err) => {
      console.error("复制失败:", err);
    });
}

if (typeof window !== "undefined") {
  (window as any).copyCodeBlock = copyCodeBlock;
}
