const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://eblogroot:eblog102jikluo@43.155.216.215:5432/eblog?schema=blogdb',
    },
  },
});

const content = `## 背景

上周把公司一个中台项目从 React 18 升级到了 React 19，踩了不少坑，但也终于用上了惦记很久的几个新特性。写篇文章记录一下，不整官方那套八股文，说点实际开发中的感受。

## 先说最想吐槽的：React Compiler

这个东西从 React 18 的实验版本就开始关注了，这次终于在 React 19 里稳定下来。

用它之前得先装：

\`\`\`bash
npm install @babel/plugin-transform-react-compiler
\`\`\`

然后在 babel 配置里加上：

\`\`\`javascript
{
  plugins: [
    ['babel-plugin-react-compiler', {
      target: '19',
    }],
  ]
}
\`\`\`

用上之后，最直接的感受是：代码里那些 \`useMemo\`、\`useCallback\` 可以开始删了。以前为了避免子组件重复渲染，一层套一层 memo，代码看起来特别臃肿。现在编译器会自动分析依赖，在编译阶段插入 memoization，线上性能反而比自己写的更精准。

当然不是说完全不需要优化手段了，但至少不用每个组件都手动 memo 一遍，省心很多。

## use() Hook：这个是真香

这个 API 出来之前，读取 Promise 里的数据通常得用 \`useEffect\` 配合 state，一不小心就整出多层嵌套。

\`\`\`jsx
// React 18 写法
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  if (!user) return <Loading />;
  return <div>{user.name}</div>;
}
\`\`\`

React 19 直接给你拉平：

\`\`\`jsx
// React 19 写法
function UserProfile({ userPromise }) {
  const user = use(userPromise);
  return <div>{user.name}</div>;
}
\`\`\`

而且这个 \`use()\` 可以用在条件判断里，这点是 Hooks 完全做不到的：

\`\`\`jsx
function Comment({ commentPromise, isExpanded }) {
  // 条件渲染里调用 use()，合法
  if (isExpanded) {
    return <ExpandedComment comment={use(commentPromise)} />;
  }
  return <SummaryComment comment={use(commentPromise)} />;
}
\`\`\`

结合 Suspense 一起用，异步数据加载的代码一下子清爽了很多。

## Server Components：全栈同学应该会喜欢

服务端组件的好处主要是减少了不必要的客户端 JS 体积。后台管理这种场景，很多列表页面其实不需要任何交互，纯粹展示数据，用 Server Components 渲染就不用往客户端 bundle 里塞任何东西。

写起来大概是这样的：

\`\`\`jsx
// UserList.server.tsx
async function UserList() {
  const users = await db.query('SELECT * FROM users LIMIT 20');
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
\`\`\`

但说实话，如果你们团队本身就有 BFF 层，这套东西的价值没那么大。而且 Server Components 的心智模型跟传统 React 不太一样，前端同学上手需要适应一下。

## Form Actions：这个降本增效很明显

以前处理表单提交，不管简单复杂都得写 API 路由、接 state、handleSubmit 一套下来。React 19 的 Form Actions 把这个流程大幅简化了：

\`\`\`jsx
// actions.ts
'use server';

export async function submitContact(formData: FormData) {
  const email = formData.get('email');
  const message = formData.get('message');

  await db.contacts.create({ email, message });
  revalidatePath('/contact');
  return { success: true };
}

// ContactForm.tsx
function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit" disabled={isPending}>
        {isPending ? '提交中...' : '提交'}
      </button>
      {state?.success && <p>发送成功！</p>}
    </form>
  );
}
\`\`\`

这个 \`useActionState\` 自动管理 loading 状态和错误处理，比自己写 \`useState + handleSubmit\` 简洁多了。

不过有个坑：Server Action 返回的数据必须是可序列化的，Date 对象、Error 对象直接 return 出去会报错，得自己转一下。

## 乐观更新：聊天和评论场景体验提升明显

\`useOptimistic\` 这个 Hook 对于即时通讯类场景特别有用。

以前发评论，得等接口返回成功才显示。用了乐观更新，提交那一刻直接显示在列表里，后端失败再回滚。用户体验提升很明显：

\`\`\`jsx
function CommentSection({ commentsPromise }) {
  const comments = use(commentsPromise);
  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (state, newComment) => [
      ...state,
      { id: Date.now(), text: newComment, pending: true }
    ]
  );

  async function handleSubmit(formData) {
    const text = formData.get('text');
    addOptimistic(text);
    await submitComment(text);
  }

  return (
    <form action={handleSubmit}>
      <textarea name="text" />
      <button type="submit">发送</button>
      {optimisticComments.map(c => (
        <div key={c.id} className={c.pending ? 'opacity-50' : ''}>
          {c.text}
        </div>
      ))}
    </form>
  );
}
\`\`\`

这个实现比以前自己写"先显示、后确认"的逻辑省心很多，状态自动管理，不用担心竞态。

## 迁移踩坑记录

从 18 升 19，破坏性变更不算多，但有几个点值得注意：

**ref 回调不能返回 undefined 了**

React 19 的 ref callback 必须显式返回 null 或者一个 DOM 节点：

\`\`\`jsx
// React 18 — 合法
<div ref={node => node?.focus()} />

// React 19 — 报错
<div ref={node => {
  if (node) node.focus();
}} />
// 得改成：
<div ref={node => { node?.focus(); }} />
// 或者
<div ref={node => node && node.focus()} />
\`\`\`

**Context 作为 value 传入 Provider 时行为有变化**

这个对我们项目影响不大，但第三方 UI 库有可能踩坑，如果你们用了比较老的三方组件，升级完记得全面回归测试一下。

## 总结

用了一周多 React 19，对于我们这种中台项目来说，最有价值的特性是：

1. **Form Actions** — 表单场景多的项目效率提升明显
2. **use()** — 异步数据处理终于不用嵌套了
3. **Compiler** — 不用再手动 memo 那么多组件了

Server Components 的话，看团队技术栈，如果本身就有 Node 层做聚合，这套东西带来的边际收益有限。

升级建议：新项目可以直接上 19，老项目挑一个不忙的周期先在测试环境跑一遍，重点关注第三方组件兼容性和 ref 回调的改动。

就这些，有问题评论区见。`;

async function main() {
  const result = await prisma.post.create({
    data: {
      title: '从 React 18 升级到 19，用了一周说说真实感受',
      slug: 'react-18-to-19-one-week-review',
      content: content,
      excerpt: '从 React 18 升级到 19，用了一周说说真实感受。Form Actions、use()、Compiler 这些新特性到底香不香，踩了哪些坑，一次说清楚。',
      published: true,
      featured: false,
      views: 0,
      readingTime: 8,
      authorId: 'cmo2sl44m0000wkhw0kocqe2e',
      categoryId: 'cmo3z3tl5000anp01xdj400su',
    },
  });
  console.log('Post created:', result.id);

  await prisma.postTag.createMany({
    data: [
      { postId: result.id, tagId: 'cmo3z7rux000enp01glgbivqt' },
    ],
  });
  console.log('Tag linked: react');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
