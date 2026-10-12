import { defineConfig } from 'vitest/config';

// 测试分层：
//   tests/*.contract.test.ts  —— 构建产物契约断言（需先 npm run build）
//   tests/*.test.ts           —— 纯逻辑/DOM 单元测试（happy-dom 环境）
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
});
