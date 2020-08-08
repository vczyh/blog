module.exports = {
  "title": "VCZYH",
  "description": "Just playing around.",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "avatar.jpg"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "首页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "归档",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "笔记",
        "icon": "reco-message",
        "link": "/note/"
      },
      {
        "text": "关于",
        "link": "/about/"
      },
    ],
    "sidebar": {
      '/note/': [
        '',
        {
          title: 'Java 虚拟机',
          collapsable: true,
          children: [
            'jvm/jvm-memory-and-exception',
            'jvm/jvm-class-file-structure'
          ]
        }
      ]
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      "tag": {
        "location": 3,
        "text": "标签云"
      }
    },
    "friendLink": [
      // {
      //   "title": "vuepress-theme-reco",
      //   "desc": "A simple and beautiful vuepress Blog & Doc theme.",
      //   "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      //   "link": "https://vuepress-theme-reco.recoluan.com"
      // }
    ],
    "logo": "/avatar.jpg",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "vczyh",
    "authorAvatar": "/avatar.jpg",
    "record": "冀ICP备18009676号-4",
    "startYear": "2019"
  },
  "markdown": {
    "lineNumbers": false
  }
}