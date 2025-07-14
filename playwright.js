// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './my-playwright-test',       // 테스트 파일 위치
  timeout: 120000,           // 각 테스트 최대 30초
  retries: 1,               // 실패시 재시도 횟수
  workers: 4,               // 병렬 테스트 워커 수
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    headless: true,         // 브라우저 헤드리스 모드 실행
    viewport: { width: 1280, height: 720 },
    actionTimeout: 120000,
    ignoreHTTPSErrors: true,
  },
};

module.exports = config;