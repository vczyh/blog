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
    gitalk: {
      clientID: "4c3b9314385d0c9adc9f",
      clientSecret: "aa2dde4a033860c093f8c214fc0657af9eb264f9",
      repo: "gitalk",
      owner: "vczyh",
    }
  }
}