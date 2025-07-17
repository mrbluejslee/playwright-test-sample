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


test('로그인', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = '로그인';

  statusResponse(page, currentPage);
  await page.waitForLoadState('networkidle');
  
  // Init automation test
  await page.goto('https://www.mrblue.com/login');

  await page.getByRole('link', { name: '아이디' }).click();
  await page.getByRole('link', { name: '아이디 찾기' }).nth(0).click();
  await page.getByRole('link', { name: '비밀번호 찾기' }).click();
  await page.getByRole('link', { name: '아이디 찾기' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '휴대폰 인증' }).click();
  const page1 = await page1Promise;
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '아이핀(i-PIN) 인증' }).click();
  const page2 = await page2Promise;
  await page.getByRole('link', { name: '이메일로 아이디 찾기 2016년 12' }).click();
  await page.getByRole('textbox', { name: '이름' }).click();
  await page.getByRole('textbox', { name: '이름' }).fill('이준섭');
  await page.getByRole('textbox', { name: '이메일' }).click();
  await page.getByRole('textbox', { name: '이메일' }).fill('wenyamaro@naver.com');
  await page.getByRole('link', { name: '확인', exact: true }).click(); 
  await page.getByRole('link', { name: '아이디 찾기' }).click();
  await page.getByRole('link', { name: '이메일로 아이디 찾기 2016년 12' }).click();
  await page.getByRole('link', { name: '취소' }).click();
  await page.getByRole('link', { name: '이메일로 아이디 찾기 2016년 12' }).click();
  await page.locator('#layerPopupWrap').getByRole('link').filter({ hasText: /^$/ }).click();
  await page.getByRole('link', { name: '이메일로 아이디 찾기 2016년 12' }).click();
  await page.getByRole('link', { name: '확인', exact: true }).click();
  await page.locator('#layerPopupWrap').getByRole('link').filter({ hasText: /^$/ }).click();
  await page.getByRole('link', { name: '해외거주 내/외국인 회원의 아이디 찾기 Find ID' }).click();
  await page.locator('#layerPopupWrap').getByRole('link').filter({ hasText: /^$/ }).click();
  await page.getByRole('link', { name: '해외거주 내/외국인 회원의 아이디 찾기 Find ID' }).click();
  await page.getByRole('link', { name: '닫기' }).click();
  const page3Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '네이버 아이디 찾기' }).click();
  const page3 = await page3Promise;
  const page4Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '페이스북 아이디 찾기' }).click();
  const page4 = await page4Promise;
  await page.locator('#body').getByRole('link', { name: '고객센터' }).click();
  await page.goto('https://www.mrblue.com/login');
  await page.getByRole('link', { name: '비밀번호 찾기' }).click();
  await page.getByRole('textbox', { name: '아이디 입력' }).click();
  await page.getByRole('textbox', { name: '아이디 입력' }).fill('npayuser_live@yopmail.com');
  await page.getByRole('link', { name: '인증된 메일로 보내기' }).click();
  await page.getByRole('link', { name: '확인', exact: true }).click();
  const page5Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '휴대폰 인증' }).click();
  const page5 = await page1Promise;
  const page6Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '아이핀(i-PIN) 인증' }).click();
  const page6 = await page2Promise;
  await page.getByRole('link', { name: '해외거주 내/외국인 회원의 비밀번호 찾기 Find' }).click();
  await page.getByRole('link', { name: '닫기' }).click();
  const page7Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '네이버 아이디 비밀번호 찾기' }).click();
  const page7 = await page3Promise;
  const page8Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '페이스북 계정 찾기' }).click();
  const page8 = await page4Promise;
  await page.locator('#body').getByRole('link', { name: '고객센터' }).click();
  await page.getByRole('link', { name: '로그인' }).click();
  await page.goto('https://www.mrblue.com/login');

  await page.locator('#loginPageForm').getByRole('link', { name: '회원가입' }).click();
  await page.goto('https://www.mrblue.com/login');

  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('dark2497');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('1234');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();
  await page.getByRole('link', { name: '닫기' }).click();
  await page.getByRole('link', { name: '내정보' }).click();
  await page.goto('https://www.mrblue.com/');
  await page.goto('https://www.mrblue.com/logout');
  await page.goto('https://www.mrblue.com/login');

  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('npayuser_live@yopmail.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('1234');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();
  await page.getByRole('link', { name: '내정보' }).click();
  await page.goto('https://www.mrblue.com/');
  await page.goto('https://www.mrblue.com/logout');
  await page.goto('https://www.mrblue.com/login');

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: '카카오로 로그인' }).click(), // 실제 텍스트에 따라 조정 필요
  ]);

  await popup.waitForLoadState('domcontentloaded');

  await popup.locator('input[name="loginId"]').fill('winter0417@nate.com');
  await popup.locator('input[name="password"]').fill('desertFox1!');

  await popup.locator('button[type="submit"]').click();

  // 6. 로그인 완료 대기 (리다이렉션 확인 등 필요 시 추가)
  await popup.waitForLoadState('load'); // 또는 특정 URL 확인

  await page.getByRole('link', { name: '내정보' }).click();
  await page.goto('https://www.mrblue.com/');
  await page.goto('https://www.mrblue.com/logout');
  await page.goto('https://www.mrblue.com/login');
 
  const [popup1] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: '네이버로 로그인' }).click(),
  ]);

  await popup1.waitForLoadState('domcontentloaded');

  // 네이버 로그인 입력
  await popup1.locator('input#id').fill('june8086');
  await popup1.locator('input#pw').fill('f8611421!#%&(135');

  await popup1.getByRole('button', { name: 'Sign in' }).click();
  await popup1.locator('.btn_cancel').click();

  await page.getByRole('link', { name: '내정보' }).click();
  await page.goto('https://www.mrblue.com/');
  await page.goto('https://www.mrblue.com/logout');
  await page.goto('https://www.mrblue.com/login');

  const [popup2] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: '페이스북으로 로그인' }).click(),
  ]);

  await popup2.waitForLoadState('domcontentloaded');

  // 페이스북 로그인 입력
  await popup2.locator('input#email').fill('winter0417@nate.com');
  await popup2.locator('input#pass').fill('f8611421!');

  await popup2.getByRole('button', { name: 'Log In' }).click();
});