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


test('소설/판타지', async ({ page }) => {
  test.setTimeout(200000);
  
  var currentPage = '소설/판타지';

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

  await page.goto('https://www.mrblue.com/novel/fantasy/book');
  await page.getByRole('link', { name: '단행본', exact: true }).click();
  await page.getByRole('link', { name: '웹소설' }).click();
  await page.getByRole('link', { name: '단행본', exact: true }).click();
  await page.getByRole('link', { name: '이전으로' }).click();
  await page.getByRole('link', { name: '다음으로' }).click();
  await page.locator('.banner-visual > ul > li:nth-child(4) > a').click();
  await page.goBack();
  await page.getByRole('link', { name: '실시간 랭킹' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '신작 캘린더' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '방구석대여점' }).click();
  await page.goBack();
  await page.locator('#contents').getByRole('link', { name: '이벤트' }).click();
  await page.goBack();
  await page.getByRole('heading', { name: '오늘의 미블 PICK' }).click();
  await page.locator('.control-box > .btn-prev').first().click();
  await page.locator('.control-box > .btn-next').first().click();
  await page.getByRole('heading', { name: '실시간 판타지 랭킹' }).click();
  await page.locator('a').filter({ hasText: /^더보기$/ }).first().click();
  await page.goBack();
  await page.getByRole('heading', { name: '최신 판타지 소설' }).click();
  await page.locator('.thumb-list01 > .top-box > .btn-more').first().click();
  await page.goBack();
  await page.locator('div:nth-child(4) > .thumb-list01.main > .thumb-list01 > .control-box > .btn-prev').click();
  await page.locator('div:nth-child(4) > .thumb-list01.main > .thumb-list01 > .control-box > .btn-next').click();
  await page.getByRole('button', { name: 'Previous slide' }).click();
  await page.getByRole('button', { name: 'Next slide' }).click();
  await page.getByRole('heading', { name: '판타지 인기 키워드' }).click();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '더보기' }).click();
  await page.goBack();
  await page.locator('div:nth-child(9) > .thumb-list01.main > .thumb-list01 > .top-box > .btn-more').click();
  await page.goBack();
  await page.getByRole('heading', { name: '판타지 이벤트 랭킹' }).click();
  await page.locator('a').filter({ hasText: /^더보기$/ }).nth(2).click();
  await page.goBack();
  await page.getByRole('heading', { name: '리뷰어가 주목한 판타지 소설' }).click();
  await page.locator('.btn-prev').nth(7).click();
  await page.locator('.btn-next').nth(7).click();
  await page.locator('.hash-box > a:nth-child(1)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(2)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(3)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(4)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(5)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(6)').click();
  await page.goBack();
  await page.goto('https://www.mrblue.com/novel/fantasy/webnovel');
  await page.locator('.asset.btn-prev').click();
  await page.locator('.asset.btn-next').click();
  await page.getByRole('link', { name: '실시간 랭킹' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '신작 캘린더' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '기다리면무료' }).click();
  await page.goBack();
  await page.locator('#contents').getByRole('link', { name: '점핑패스', exact: true }).click();
  await page.goBack();
  await page.getByRole('link', { name: '선물함', exact: true }).click();
  await page.goBack();
  await page.getByRole('heading', { name: '기다리면 무료' }).click();
  await page.locator('.thumb-list01.mt60 > .control-box > .btn-prev').first().click();
  await page.locator('.thumb-list01.mt60 > .control-box > .btn-next').first().click();
  await page.getByRole('heading', { name: '실시간 판타지 랭킹' }).click();
  await page.locator('a').filter({ hasText: /^더보기$/ }).first().click();
  await page.goBack();
  await page.getByRole('heading', { name: '최신 판타지 소설' }).click();
  await page.locator('div:nth-child(5) > .thumb-list01.main > .thumb-list01 > .top-box > .btn-more').click();
  await page.goBack();
  await page.getByRole('button', { name: 'Previous slide' }).click();
  await page.getByRole('button', { name: 'Next slide' }).click();
  await page.getByRole('heading', { name: '판타지 인기 키워드' }).click();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '더보기' }).click();
  await page.goBack();
  await page.locator('div:nth-child(10) > .thumb-list01.main > .thumb-list01 > .top-box > .btn-more').click();
  await page.goBack();
  await page.locator('div:nth-child(10) > .thumb-list01.main > .thumb-list01 > .control-box > .btn-prev').click();
  await page.locator('div:nth-child(10) > .thumb-list01.main > .thumb-list01 > .control-box > .btn-next').click();
  await page.getByRole('heading', { name: '주간 판타지 랭킹' }).click();
  await page.locator('a').filter({ hasText: /^더보기$/ }).nth(2).click();
  await page.goBack();
  await page.getByRole('heading', { name: '리뷰어가 주목한 판타지 소설' }).click();
  await page.locator('.btn-prev').nth(7).click();
  await page.locator('.btn-next').nth(7).click();
  await page.locator('.hash-box > a:nth-child(1)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(2)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(3)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(4)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(5)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(6)').click();
  await page.goBack();
});

test('소설/무협', async ({ page }) => {
  test.setTimeout(200000);
  
  var currentPage = '소설/무협';

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

  await page.goto('https://www.mrblue.com/novel/heroism/book');
  await page.getByRole('link', { name: '단행본', exact: true }).click();
  await page.getByRole('link', { name: '웹소설' }).click();
  await page.getByRole('link', { name: '단행본', exact: true }).click();
  await page.getByRole('link', { name: '이전으로' }).click();
  await page.getByRole('link', { name: '다음으로' }).click();
  await page.locator('.banner-visual > ul > li:nth-child(4) > a').click();
  await page.goBack();
  await page.getByRole('link', { name: '실시간 랭킹' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '신작 캘린더' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '방구석대여점' }).click();
  await page.goBack();
  await page.locator('#contents').getByRole('link', { name: '이벤트' }).click();
  await page.goBack();
  await page.getByRole('heading', { name: '오늘의 미블 PICK' }).click();
  await page.locator('.control-box > .btn-prev').first().click();
  await page.locator('.control-box > .btn-next').first().click();
  await page.getByRole('heading', { name: '실시간 무협 랭킹' }).click();
  await page.locator('a').filter({ hasText: /^더보기$/ }).first().click();
  await page.goBack();
  await page.getByRole('heading', { name: '최신 무협 소설' }).click();
  await page.locator('.thumb-list01 > .top-box > .btn-more').first().click();
  await page.goBack();
  await page.locator('div:nth-child(4) > .thumb-list01.main > .thumb-list01 > .control-box > .btn-prev').click();
  await page.locator('div:nth-child(4) > .thumb-list01.main > .thumb-list01 > .control-box > .btn-next').click();
  await page.getByRole('button', { name: 'Previous slide' }).click();
  await page.getByRole('button', { name: 'Next slide' }).click();
  await page.getByRole('heading', { name: '무협 인기 키워드' }).click();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '더보기' }).click();
  await page.goBack();
  await page.locator('div:nth-child(9) > .thumb-list01.main > .thumb-list01 > .top-box > .btn-more').click();
  await page.goBack();
  await page.getByRole('heading', { name: '무협 이벤트 랭킹' }).click();
  await page.locator('a').filter({ hasText: /^더보기$/ }).nth(2).click();
  await page.goBack();
  await page.getByRole('heading', { name: '리뷰어가 주목한 무협 소설' }).click();
  await page.locator('.btn-prev').nth(7).click();
  await page.locator('.btn-next').nth(7).click();
  await page.locator('.hash-box > a:nth-child(1)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(2)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(3)').click();
  await page.goBack();
  await page.getByRole('link', { name: '웹소설' }).click();
  await page.locator('.asset.btn-prev').click();
  await page.locator('.asset.btn-next').click();
  await page.getByRole('link', { name: '실시간 랭킹' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '신작 캘린더' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '기다리면무료' }).click();
  await page.goBack();
  await page.locator('#contents').getByRole('link', { name: '점핑패스', exact: true }).click();
  await page.goBack();
  await page.getByRole('link', { name: '선물함', exact: true }).click();
  await page.goBack();
  await page.getByRole('heading', { name: '기다리면 무료' }).click();
  await page.locator('.thumb-list01.mt60 > .control-box > .btn-prev').first().click();
  await page.locator('.thumb-list01.mt60 > .control-box > .btn-next').first().click();
  await page.getByRole('heading', { name: '실시간 무협 랭킹' }).click();
  await page.locator('a').filter({ hasText: /^더보기$/ }).first().click();
  await page.goBack();
  await page.getByRole('heading', { name: '최신 무협 소설' }).click();
  await page.getByRole('link', { name: '더보기' }).nth(2).click();
  await page.goBack();
  await page.locator('div:nth-child(5) > .thumb-list01.main > .thumb-list01 > .control-box > .btn-prev').click();
  await page.locator('div:nth-child(5) > .thumb-list01.main > .thumb-list01 > .control-box > .btn-next').click();
  await page.getByRole('button', { name: 'Previous slide' }).click();
  await page.getByRole('button', { name: 'Next slide' }).click();
  await page.getByRole('heading', { name: '무협 인기 키워드' }).click();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '더보기' }).click();
  await page.goBack();
  await page.locator('div:nth-child(10) > .thumb-list01.main > .thumb-list01 > .top-box > .btn-more').click();
  await page.goBack();
  await page.locator('div:nth-child(10) > .thumb-list01.main > .thumb-list01 > .control-box > .btn-prev').click();
  await page.locator('div:nth-child(10) > .thumb-list01.main > .thumb-list01 > .control-box > .btn-next').click();
  await page.getByRole('heading', { name: '주간 무협 랭킹' }).click();
  await page.locator('a').filter({ hasText: /^더보기$/ }).nth(2).click();
  await page.goBack();
  await page.getByRole('heading', { name: '리뷰어가 주목한 무협 소설' }).click();
  await page.locator('.btn-prev').nth(7).click();
  await page.locator('.btn-next').nth(7).click();
  await page.locator('.hash-box > a:nth-child(1)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(2)').click();
  await page.goBack();
  await page.locator('.hash-box > a:nth-child(3)').click();
  await page.goBack();
});

/*
test('blank', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = 'blank';

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
*/