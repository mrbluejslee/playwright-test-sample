import { test, expect } from '@playwright/test';
import { defineConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { htmlToText } from 'html-to-text';
import debug from 'debug';

const logFile = `./test_log_${getCurrentTimestamp()}.txt`;

// 로그 파일 내보내기
function logToFile(message) {
  fs.appendFileSync(logFile, message + '\n', 'utf8');
}

// 로그 파일명 추출
function getCurrentTimestamp() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // 0부터 시작하니 +1
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `${year}${month}${day}_${hour}${minute}${second}`;
}

// 400-500에러 발생 시 테스트 일시정지
async function checkAndMaybePause(page) {
  if (someCondition) {
    await page.pause(); // 조건 만족 시 pause
  }
}

// 응답 상태 체크용 리스너
function statusResponse(page, currentPage) {
  console.log('----------------------------- '+currentPage+' -----------------------------');
  page.on('response', response => {
    if (response.status() >= 400 && response.status() !== 429) {
      console.warn(`❌ HTTP ${response.status()} - ${response.url()}`);
      console.log('❌ URL:', page.url());

      const logMessage = `❌ HTTP ${response.status()} - ${response.url()}`;
      logToFile(logMessage); // 로그 파일로 저장
      logToFile('❌ URL: ' + page.url()); // 현재 페이지 URL도 저장
      checkAndMaybePause(page)
    }
    else if ((response.status() == 200))
    {
      console.warn(`🟢 HTTP ${response.status()} - ${response.url()}`);
      console.log('🟢 URL:', page.url());

      const logMessage = `🟢 HTTP ${response.status()} - ${response.url()}`;
      logToFile(logMessage); // 로그 파일로 저장
      logToFile('🟢 URL: ' + page.url()); // 현재 페이지 URL도 저장
    }
    else
    {
      console.warn(`⚠️ HTTP ${response.status()} - ${response.url()}`);
      console.log('⚠️ URL:', page.url());

      const logMessage = `⚠️ HTTP ${response.status()} - ${response.url()}`;
      logToFile(logMessage); // 로그 파일로 저장
      logToFile('⚠️ URL: ' + page.url()); // 현재 페이지 URL도 저장
    }
  });
  logToFile('---------------------------------------------------------- '+currentPage+' ----------------------------------------------------------');
}


test('이메일 계정 로그인', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = '이메일 계정 로그인';

  statusResponse(page, currentPage);

  // Init automation test
  await page.goto('https://www.mrblue.com/');

  // Email account login
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '로그인' }).click();
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('npayuser_live@yopmail.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('1234');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();
});
