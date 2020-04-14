module.exports = {
  theme: 'vuepress-theme-something',
  port: 9000,
  title: "Zhang Yuheng's Blog",
  description: 'Just playing around',
  head: [
    // gitter
    ['script', { type: 'text/javascript' }, "((window.gitter = {}).chat = {}).options = { room: 'zhangyuhengspace/community'};"],
    ['script', { type: 'text/javascript', src: 'https://sidecar.gitter.im/dist/sidecar.v1.js' }],
    // favicon
    ['link', { rel: 'icon', href: '/avatar.jpg' }],
  ],
  themeConfig: {
    author: '张语亨',
    logo: '/avatar.jpg',
    nav: [
      // { text: '首页', link: '/', icon: 'iconshouye', to: '/blog/' },
      { text: '博客', link: '/blog/', home: true },
      { text: '生活', link: '/life/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archive/' },
      {
        text: '照片墙',
        items: [
          { text: 'kobe', link: '/waterfall/kobe' },
          { text: '个人', link: '/waterfall/mine' }
        ]
      },
      { text: '学习笔记', link: '/note/' },
      { text: '留言区', link: '/leave/' },
      { text: '博客主题', link: 'https://vczyh.github.io/doc/' }
    ],
    sidebar: 'auto',
    nextLinks: true,
    prevLinks: true,
    smoothScroll: true,
    docsRepo: 'vczyh/docs',
    docsDir: '',
    docsBranch: 'blog',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: 'Last Updated',
    contact: {
      "github": "https://github.com/vczyh",
      "mail": "2939531323@qq.com",
      "qq": "2939531323"
    },
    // gitalk: {
    //   clientID: "5269191d56174e6d88aa",
    //   clientSecret: "d5a1dac48f31bba2bcd99a3478bb74caa493247c",
    //   repo: "gitalk",
    //   owner: "vczyh",
    // },
    valine: {
      appId: "ivCnDnNXmMhLWTntPwhk5t8t-gzGzoHsz",
      appKey: "xcPENOlumU1AtsDlhWcohIXM",
      placeholder: "欢迎留言与我分享您的想法...",
      avatar: "robohash",
      meta: [],
      pageSize: 10,
      visitor: true,
      highlight: true,
      avatarForce: false,
      recordIP: false,
      serverURLs: ""
    },
  }
}