// app.js (在服务器和客户端之间共享)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ name2 }),
    template: `<div>{{ name2 }}</div>`
  })
}