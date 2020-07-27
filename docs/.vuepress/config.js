module.exports = {
  theme: 'vuepress-theme-something',
  plugins: ['@vuepress-something/vuepress-plugin-dplayer'],
  port: 9000,
  title: "Vczyh's Blog",
  description: 'Just playing around',
  head: [
    // gitter
    // ['script', { type: 'text/javascript' }, "((window.gitter = {}).chat = {}).options = { room: 'zhangyuhengspace/community'};"],
    // ['script', { type: 'text/javascript', src: 'https://sidecar.gitter.im/dist/sidecar.v1.js' }],
    // favicon
    ['link', { rel: 'icon', href: '/avatar.jpg' }],
  ],
  themeConfig: {
    author: 'vczyh',
    logo: '/avatar.jpg',
    nav: [
      // { text: '首页', link: '/', icon: 'iconshouye', to: '/blog/' },
      // { text: '博客', link: '/blog/', home: true },
      // { text: '生活', link: '/life/' },
      {
        text: '分类',
        items: [
          { text: '博客', link: '/blog/', home: true },
          { text: '生活', link: '/life/' },
        ]
      },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archive/' },
      { text: '笔记', link: '/note/' },
      { text: '留言区', link: '/leave/' },
      { text: '友链', link: '/friend/' },
      {
        text: '联系我',
        items: [
          { text: 'Github', link: 'https://github.com/vczyh', icon: 'icongithub2' },
          { text: 'WeChat', link: '/contact/wechat/', icon: 'icongongzhonghao' },
          { text: 'Telegram', link: 'https://t.me/vczyh', icon: 'icontelegram' },
          { text: 'QQ', link: 'http://wpa.qq.com/msgrd?v=3&uin=2939531323&site=qq&menu=yes', icon: 'iconQQ' }
        ]
      },
      { text: '博客主题', link: 'https://vczyh.github.io/doc/' },
    ],
    sidebar: 'auto',
    nextLinks: true,
    prevLinks: true,
    smoothScroll: true,
    docsRepo: 'vczyh/blog',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: 'Last Updated',
    // gitalk: {
    //   clientID: "5269191d56174e6d88aa",
    //   clientSecret: "d5a1dac48f31bba2bcd99a3478bb74caa493247c",
    //   repo: "gitalk",
    //   owner: "vczyh",
    // },
    valine: {
      appId: "ivCnDnNXmMhLWTntPwhk5t8t-gzGzoHsz",
      appKey: "xcPENOlumU1AtsDlhWcohIXM",
      placeholder: "......",
      avatar: "mp",
      pageSize: 5,
      visitor: true,
      recordIP: true
    },
  }
}