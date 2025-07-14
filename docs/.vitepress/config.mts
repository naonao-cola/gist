import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "闹闹",
  description: "成都古寺卧秋晚，落日偏傍僧窗明。",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '赞助', link: '/README' }
    ],
    outline: {
      level:[2,3]
    },
    sidebar: [
      {
        text: 'cxx',
        items: [
          { text: 'cxx', link: '/cxx/cxx' },
          { text: '小技巧', link: '/cxx/tips'}
        ]
      },
      {
        text: '编译',
        items: [
          { text: '常用示例', link: '/compile/compile' },
          { text: 'xmake', link: '/compile/xmake' },
          { text: 'cmake', link: '/compile/cmake'}
        ]
      },
      {
        text: '数学之美',
        items: [
          { text: 'math', link: '/math/math' },
          { text: '线性代数', link: '/math/linear' }
        ]
      },
      {
        text: '相机',
        items: [
          { text: 'camera', link: '/camera/camera' },
          { text: 'halcon', link: '/camera/halcon' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/naonao-cola' }
    ]
  },
  vite: {
    server: {
      allowedHosts: true // 添加允许访问的域名
    }
  }

})
