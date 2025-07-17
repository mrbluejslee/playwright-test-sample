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

test('웹툰/연재', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = '웹툰/연재';

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

  await page.goto('https://www.mrblue.com/webtoon');
  await page.getByRole('link', { name: '이전으로' }).click();
  await page.getByRole('link', { name: '다음으로' }).click();
  await page.locator('.banner-visual > ul > li > a').first().click();
  await page.goBack();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '로맨스' }).click();
  await page.getByRole('link', { name: '성인' }).click();
  await page.getByRole('link', { name: '장르+' }).click();
  await page.locator('#popular_keyword_box').getByRole('link', { name: 'BL' }).click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.getByRole('link', { name: '조회순' }).click();
  await page.getByRole('link', { name: '추천순' }).click();
  await page.getByRole('link', { name: '신작 캘린더' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '신작', exact: true }).first().click();
  await page.getByRole('link', { name: '월', exact: true }).click();
  await page.getByRole('link', { name: '화', exact: true }).click();
  await page.getByRole('link', { name: '수', exact: true }).click();
  await page.getByRole('link', { name: '목' }).click();
  await page.getByRole('link', { name: '금', exact: true }).click();
  await page.getByRole('link', { name: '토', exact: true }).click();
  await page.getByRole('link', { name: '일', exact: true }).click();
  await page.getByRole('link', { name: '열흘' }).click();
});

test('웹툰/오리지널', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = '웹툰/오리지널';

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

  await page.goto('https://www.mrblue.com/webtoon/original');
});

test('웹툰/단편', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = '웹툰/단편';

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

  await page.goto('https://www.mrblue.com/webtoon/shortstory');
  await page.getByRole('link', { name: '이전으로' }).click();
  await page.getByRole('link', { name: '다음으로' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
});

test('웹툰/장르', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = '웹툰/장르';

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

  await page.goto('https://www.mrblue.com/webtoon/genre/all');
  await page.getByRole('link', { name: '전체', exact: true }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-first').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-prev').click();
  await page.getByRole('link', { name: '로맨스' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-first').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-prev').click();
  await page.getByRole('link', { name: 'BL' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-first').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-prev').click();
  await page.getByRole('link', { name: '에로' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-first').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-prev').click();
  await page.getByRole('link', { name: '드라마' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-first').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-prev').click();
  await page.getByRole('link', { name: 'GL' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.getByRole('link', { name: '액션' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.getByRole('link', { name: '판타지' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.getByRole('link', { name: '스릴러' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '완결' }).getByRole('strong').click();
});

test('웹툰/완결', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = '웹툰/완결';

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

  await page.goto('https://www.mrblue.com/webtoon/completed');
  await page.getByRole('link', { name: '완결' }).click();
  await page.getByRole('link', { name: '이전으로' }).click();
  await page.getByRole('link', { name: '다음으로' }).click();
  await page.locator('.banner-visual > ul > li > a').first().click();
  await page.goBack();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('.img > a').first().click();
  await page.goBack();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-last').click();
  await page.locator('.paging > .btn-prev').click();
  await page.locator('.btn-first').click();
  await page.locator('a:nth-child(13)').click();
});