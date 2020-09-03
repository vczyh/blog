module.exports = {
  title: "VCZYH",
  description: "虽不会写诗，但志在远方。",
  dest: "public",
  head: [
    // [
    //   "link",
    //   {
    //     rel: "icon",
    //     href: "favicon.ico"
    //   }
    // ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  theme: "reco",
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    nav: [
      {
        text: "首页",
        link: "/",
        icon: "reco-home"
      },
      {
        text: "时间轴",
        link: "/timeline/",
        icon: "reco-date"
      },
      {
        text: "笔记",
        icon: "reco-message",
        link: "/note/"
      },
      {
        text: "留言板",
        icon: "reco-suggestion",
        link: "/other/leave/"
      },
      {
        text: "About",
        link: "/other/about/"
      },
    ],
    sidebar: {
      '/note/': [
        '',
        {
          title: 'Java 虚拟机',
          collapsable: true,
          children: [
            'jvm/jvm-memory-and-exception',
            'jvm/jvm-class-file-structure',
            'jvm/jvm-class-loading-mechanism',
            'jvm/jvm-byte-code-execution-engine'
          ]
        },
        {
          title: 'Docker',
          collapsable: true,
          children: [
            'docker/docker-learning-note'
          ]
        }
      ]
    },
    valineConfig: {
      appId: 'nyg0CDsOOCj49d0xMPCHVT2f-gzGzoHsz',
      appKey: 'WheqHsnQq7Oa5G7E96GRc68s',
      placeholder: "Just playing around.",
      avatar: "retro",
      pageSize: 5,
      visitor: true
    },
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "分类"
      },
      tag: {
        location: 3,
        text: "标签云"
      }
    },
    friendLink: [
      // {
      //   "title": "vuepress-theme-reco",
      //   "desc": "A simple and beautiful vuepress Blog & Doc theme.",
      //   "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      //   "link": "https://vuepress-theme-reco.recoluan.com"
      // },
      {
        "title": "OnlinePlayer",
        "desc": "An online music player",
        "link": "https://music.zhangeek.com"
      }
    ],
    // logo: "/avatar.jpg",
    search: true,
    searchMaxSuggestions: 10,
    // lastUpdated: "Last Updated",
    author: "vczyh",
    // authorAvatar: "/avatar.jpg",
    record: "冀ICP备18009676号",
    startYear: "2018"
  },
  markdown: {
    lineNumbers: true
  }
}