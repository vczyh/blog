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
        icon: 'iconzhaopian',
        items: [
          { text: 'kobe', link: '/waterfall/kobe/' },
          { text: '个人', link: '/waterfall/mine/' }
        ]
      },
      { text: '文档', link: '/doc/' },
    ]
  }
}