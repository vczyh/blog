module.exports = {
  theme: 'vuepress-theme-something',
  title: "VuePress Theme Something",
  description: "不会写诗，但志在远方",
  port: '8080',

  head: [
    // gitter
    ['script', { type: 'text/javascript' }, "((window.gitter = {}).chat = {}).options = { room: 'vuepress-theme-something/community'};"],
    ['script', { type: 'text/javascript', src: 'https://sidecar.gitter.im/dist/sidecar.v1.js' }],

    // iconfont
    // ['link', { type: 'text/css', rel: 'stylesheet', href: '//at.alicdn.com/t/font_1695296_4p3x0p9b7s.css' }],

    // favicon
    ['link', { rel: 'icon', href: '/avatar.jpg' }],
  ],

  themeConfig: {
    // custom
    author: 'zhangyuheng',
    contact: {
      "github": "https://github.com/vczyh/vuepress-theme-something",
      "mail": "2939531323@qq.com",
      "qq": "2939531323"
    },
    gitalk: {
      clientID: "fb857373c8bbc254dba0",
      clientSecret: "c591407df60c3d6ac2dd39ee1f61e7aa765f827e",
      repo: "gitalk",
      owner: "vczyh",
    },

    // official
    // logo: '/avatar.jpg',
    // repo: 'https://github.com/vczyh/vuepress-theme-something',

    nextLinks: true,
    prevLinks: true,
    smoothScroll: true,
    docsRepo: 'vczyh/blog',
    docsDir: 'docs',
    docsBranch: 'vuepress-something',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: 'Last Updated', // string | boolean
    sidebar: {
      '/doc/': [
        {
          title: '基础',
          collapsable: false,
          children: [
            '',
            'quick-start'
          ]
        },
        {
          title: 'Markdown',
          collapsable: false,
          children: [
            'markdown-basic-test',
            'markdown-extend-test'
          ]
        }
      ]
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/doc/' },
      { text: '博客', link: '/blog/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archive/' },
      // {
      //   text: '照片墙',
      //   items: [
      //     { text: '科比', link: '/waterfall/kobe/' },
      //   ]
      // },
      { text: 'Github', link: 'https://github.com/vczyh/vuepress-theme-something', target: '_blank' }
    ]
  }
}