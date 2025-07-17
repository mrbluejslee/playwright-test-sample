import { test, expect } from '@playwright/test';
import { defineConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { htmlToText } from 'html-to-text';
import debug from 'debug';

// 테스트 브라우저 화면 크기
export default defineConfig({
  use: {
    viewport: { width: 1680, height: 1050 },
    headless: false,   // headed 모드도 config에서 지정 가능
  },
});

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
      //checkAndMaybePause(page)
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

test('푸터', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = '푸터';

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

  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '회사소개' }).click();
  const page1 = await page1Promise;
  await page.getByRole('link', { name: '이용약관', exact: true }).click();
  await page.goBack();
  await page.getByRole('link', { name: '개인정보처리방침' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '청소년 보호정책' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '블루머니 이용약관' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '고객센터' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '연재문의', exact: true }).click();
  await page.goBack();
  await page.getByRole('link', { name: '서비스 전체보기' }).click();
  await page.goBack();
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '네이버 블로그' }).click();
  const page2 = await page2Promise;
  const page3Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '유튜브' }).click();
  const page3 = await page3Promise;
  const page4Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'X', exact: true }).click();
  const page4 = await page4Promise;
  const page5Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '인스타그램' }).click();
  const page5 = await page5Promise;
  const page6Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '카카오톡 채널' }).click();
  const page6 = await page6Promise;
  const page7Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '사업자정보 확인' }).click();
  const page7 = await page7Promise;
  await page.getByText('코스닥상장법인').click();
  await page.getByRole('link', { name: '정보보호 관리체계 ISMS 인증획득' }).click();
  await page.getByRole('link', { name: '닫기' }).click();
  const page8Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '깨끗한 저작권 서비스 클린사이트 선정' }).click();
  const page8 = await page8Promise;
  await page.getByRole('link', { name: '개인정보 우수사이트 선정' }).click();
});