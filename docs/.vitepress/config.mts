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

    sidebar: [
      {
        text: 'cxx',
        items: [
          { text: 'cxx', link: '/cxx/cxx' },
          { text: 'tip', link: '/cxx/tips'}
        ]
      },
      {
        text: 'Math',
        items: [
          { text: 'math', link: '/math/math' },
          { text: 'linear', link: '/math/linear' }
        ]
      },
      {
        text: 'Camera',
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
