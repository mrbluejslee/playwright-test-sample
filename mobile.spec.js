// tests/mobile.spec.ts
import { test, expect, devices } from '@playwright/test';
import { defineConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { htmlToText } from 'html-to-text';
import debug from 'debug';

// Pixel 7 디바이스 수동 정의 (Pixel 5는 기본 제공됨)
const pixel7 = {
  name: 'Pixel 7',
  userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
};

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
      console.log('❌ Fail');

      const logMessage = `❌ HTTP ${response.status()} - ${response.url()}`;
      logToFile(logMessage); // 로그 파일로 저장
      logToFile('❌ URL: ' + page.url()); // 현재 페이지 URL도 저장
      //checkAndMaybePause(page)
    }
    else if ((response.status() == 200))
    {
      console.warn(`🟢 HTTP ${response.status()} - ${response.url()}`);
      console.log('🟢 URL:', page.url());
      console.log('🟢 Pass');

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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test.use({ ...pixel7 });

test('GNB', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = 'GNB';

  statusResponse(page, currentPage);
  
  await page.waitForLoadState('networkidle');
  
  // console.log(""+'\n');

  //기능 검증을 위한 기본 로그인
  await page.goto('https://stage-m.mrblue.com/login/');
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.getByRole('button', { name: '로그인' }).click();
  
  console.log("메인 팝업 배너 닫기"+'\n');
  await page.click('.PopupBannerModal_btn-close__dUHAh');

  console.log("완전판 다운로드 배너 > 받기 버튼 클릭"+'\n');
  await page.click('.HeaderBanner_btn-receive__ZCt42');
  await expect(page).toHaveURL('https://stage-m.mrblue.com/viewer/download.asp');
  await page.goBack();

  console.log("메인 팝업 배너 닫기"+'\n');
  await page.click('.PopupBannerModal_btn-close__dUHAh');

  console.log("BI 클릭"+'\n');
  await page.click('.IconMBLogoKorean_wrap-big__7_mcp'); 

  console.log("검색 버튼 클릭"+'\n');
  await page.click('.btn-search');

  console.log("검색어 입력 후 검색"+'\n');
  await page.getByRole('textbox', { name: '작품, 작가, 출판사, 키워드 검색' }).click();
  await page.getByRole('textbox', { name: '작품, 작가, 출판사, 키워드 검색' }).fill('가');
  await page.getByRole('textbox', { name: '작품, 작가, 출판사, 키워드 검색' }).press('Enter');
  await expect(page).toHaveURL('https://stage-m.mrblue.com/search/all?keyword=%EA%B0%80');

  console.log("뒤로가기 버튼 클릭_미블"+'\n');
  await page.getByRole('button').first().click();
  console.log("뒤로가기 버튼 클릭_미블"+'\n');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();

  console.log("메인 팝업 배너 닫기"+'\n');
  await page.click('.PopupBannerModal_btn-close__dUHAh');

  console.log("사이드 메뉴 열기"+'\n')
  await page.getByRole('button', { name: 'side menu' }).click();

  console.log("사이드 메뉴 닫기"+'\n')
  await page.getByRole('button', { name: '사이드바 닫기' }).click();
  
  /*
  console.log(""+'\n')
  await page.click('.');

  console.log(""+'\n')
  await page.click('.');

  console.log(""+'\n')
  await page.click('.');

  console.log(""+'\n')
  await page.click('.');

  console.log(""+'\n')
  await page.click('.');
  */
});