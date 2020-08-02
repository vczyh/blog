module.exports = {
  theme: 'vuepress-theme-something',
  plugins: [
    ['@vuepress/last-updated', {
      transformer: (timestamp, lang) => {
        const moment = require('moment')
        moment.locale(lang)
        return moment(timestamp).fromNow()
      }
    }]
  ],
  port: 9000,
  title: "Vczyh's Blog",
  description: '不会写诗，但志在远方。',
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
    sidebar: {
      '/note/': [
        '',
        {
          title: 'Java 虚拟机',
          collapsable: false,
          children: [
            'jvm/jvm-memory-and-exception',
            'jvm/jvm-class-file-structure'
          ]
        }
      ],
    },
    nextLinks: true,
    prevLinks: true,
    smoothScroll: true,
    docsRepo: 'vczyh/blog',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    valine: {
      appId: "ivCnDnNXmMhLWTntPwhk5t8t-gzGzoHsz",
      appKey: "xcPENOlumU1AtsDlhWcohIXM",
      placeholder: "Just playing around",
      avatar: "retro",
      pageSize: 5,
      visitor: true,
      recordIP: true
    },
  }
}