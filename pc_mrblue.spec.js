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
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();
});

/*
test('GNB', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = 'GNB';

  statusResponse(page, currentPage);
  
  // Init automation test
  await page.goto('https://www.mrblue.com/');

  // Email account login
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '로그인' }).click();
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('desertFox1!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // GNB
  await page.waitForLoadState('networkidle');
  await page.goto('https://www.mrblue.com/');
  await page.getByRole('link', { name: '미스터블루' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).first().click();
  await page.getByRole('link', { name: '전체보기 닫기' }).click();
});

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
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // 웹툰
  await page.locator('#gnb').getByRole('link', { name: '웹툰' }).first().click();

  // 웹툰-연재
  await page.getByRole('link', { name: '연재', exact: true }).click();
  await page.waitForLoadState('networkidle');
  await page.locator('.banner-visual > ul > li > a').first().click();
  await page.getByRole('link', { name: '이전으로' }).click();
  await page.getByRole('link', { name: '다음으로' }).click();
  await page.locator('#popular_keyword_box').getByRole('link', { name: 'BL' }).click();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '로맨스' }).click();
  await page.getByRole('link', { name: '성인', exact: true }).click();
  await page.getByRole('link', { name: '장르+' }).click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.goto('https://www.mrblue.com/webtoon');
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '추천순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.getByRole('link', { name: '조회순' }).click();
  await page.getByRole('link', { name: '신작 캘린더' }).click();
  await page.goto('https://www.mrblue.com/webtoon');
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '신작', exact: true }).click();
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
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // 웹툰
  await page.locator('#gnb').getByRole('link', { name: '웹툰' }).first().click();

  // 웹툰-오리지널
  await page.getByRole('link', { name: '오리지널' }).click();
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
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // 웹툰
  await page.locator('#gnb').getByRole('link', { name: '웹툰' }).first().click();

  // 웹툰-단편
  await page.getByRole('link', { name: '단편' }).click();
  await page.getByRole('link', { name: '이전으로' }).click();
  await page.getByRole('link', { name: '다음으로' }).click();
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
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // 웹툰
  await page.locator('#gnb').getByRole('link', { name: '웹툰' }).first().click();

  // 웹툰-장르
  await page.getByRole('link', { name: '장르' }).first().click();
  await page.getByRole('link', { name: '전체', exact: true }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('#defaultTab').getByRole('link', { name: '로맨스' }).click();
  await page.getByRole('link', { name: 'BL' }).first().click();
  await page.getByRole('link', { name: '에로', exact: true }).click();
  await page.getByRole('link', { name: '드라마' }).click();
  await page.getByRole('link', { name: 'GL' }).click();
  await page.getByRole('link', { name: '액션' }).click();
  await page.getByRole('link', { name: '판타지' }).click();
  await page.getByRole('link', { name: '스릴러' }).click();
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
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // 웹툰
  await page.locator('#gnb').getByRole('link', { name: '웹툰' }).first().click();

  // 웹툰-완결
  await page.getByRole('link', { name: '완결' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('.banner-visual > ul > li > a').first().click();
  const page1 = await page1Promise;
  await page.getByRole('link', { name: '이전으로' }).click();
  await page.getByRole('link', { name: '다음으로' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.paging > .btn-prev').click();
  await page.locator('.paging > .btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
});

test('만화/추천', async ({ page }) => {
  test.setTimeout(120000);
  // 응답 상태 체크용 리스너

  var currentPage = '만화/추천';

  statusResponse(page, currentPage);
  
  // Init automation test
  await page.goto('https://www.mrblue.com/');

  // Email account login
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '로그인' }).click();
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // 만화
  await page.goto('https://www.mrblue.com/');
  await page.locator('#gnb').getByRole('link', { name: '만화' }).click();

  // 만화-추천
  await page.getByRole('link', { name: '추천' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('.banner-visual > ul > li > a').first().click();
  const page1 = await page1Promise;
  await page.getByRole('link', { name: '실시간랭킹' }).click();
  await page.goto('https://www.mrblue.com/comic');
  await page.getByRole('link', { name: '정액제만화' }).click();
  await page.goto('https://www.mrblue.com/comic');
  await page.getByRole('link', { name: '신작 캘린더' }).click();
  await page.goto('https://www.mrblue.com/comic');
  await page.getByRole('link', { name: '특가세트', exact: true }).click();
  await page.goto('https://www.mrblue.com/comic');
  await page.getByRole('link', { name: '에로특가존' }).click();
  await page.goto('https://www.mrblue.com/comic');
  await page.getByRole('link', { name: '무협 전권 무료' }).click();
  await page.goto('https://www.mrblue.com/comic');
  await page.locator('.control-box > .btn-prev').first().click();
  await page.locator('.control-box > .btn-next').first().click();
  await page.locator('#recent_update_box').getByRole('link', { name: '더보기' }).click();
  await page.goto('https://www.mrblue.com/comic');
  await page.getByRole('link', { name: 'BL' }).nth(3).click();
  await page.getByRole('link', { name: '성인', exact: true }).nth(1).click();
  await page.getByRole('link', { name: '무협', exact: true }).nth(4).click();
  await page.getByRole('link', { name: '할리퀸', exact: true }).click();
  await page.getByRole('link', { name: '순정', exact: true }).nth(2).click();
  await page.locator('span:nth-child(7) > a').click();
  await page.getByRole('link', { name: '액션', exact: true }).click();
  await page.getByRole('link', { name: '전체', exact: true }).click();
  await page.getByRole('link', { name: '더보기' }).nth(1).click();
  await page.goto('https://www.mrblue.com/comic');
  await page.locator('#popular_keyword_box').getByRole('link', { name: '더보기' }).click();
  await page.goto('https://www.mrblue.com/comic');
  await page.getByRole('link', { name: '더보기' }).nth(3).click();
  await page.goto('https://www.mrblue.com/comic');
});

test('만화/장르', async ({ page }) => {
  test.setTimeout(600000);
  // 응답 상태 체크용 리스너  
  var currentPage = '만화/장르';

  statusResponse(page, currentPage);

  // Init automation test
  await page.goto('https://www.mrblue.com/');

  // Email account login
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '로그인' }).click();
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // 만화
  await page.goto('https://www.mrblue.com/');
  await page.locator('#gnb').getByRole('link', { name: '만화' }).click();

  // 만화-장르
  await page.getByRole('link', { name: '장르' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.locator('#defaultTab').getByRole('link', { name: 'BL' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '성인', exact: true }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '무협', exact: true }).first().click();
  await page.locator('#defaultTab').getByRole('link', { name: '황성' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '야설록' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '사마달' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '하승남' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).first().click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '묵검향' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('#defaultTab').getByRole('link', { name: '전체보기' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '할리퀸' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '단행본' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '작가 패키지' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '테마 패키지' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.locator('#defaultTab').getByRole('link', { name: '전체보기' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '순정', exact: true }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '드라마' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '액션' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '학원' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '판타지/SF' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '스포츠' }).first().click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
});

test('만화/무협관', async ({ page }) => {
  test.setTimeout(600000);
  // 응답 상태 체크용 리스너  
  var currentPage = '만화/무협관';

  statusResponse(page, currentPage);

  // Init automation test
  await page.goto('https://www.mrblue.com/');

  // Email account login
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '로그인' }).click();
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // 만화
  await page.goto('https://www.mrblue.com/');
  await page.locator('#gnb').getByRole('link', { name: '만화' }).click();

  // 만화-무협관
  await page.getByRole('link', { name: '무협관' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('.banner-visual > ul > li > a').first().click();
  const page1 = await page1Promise;
  await page.getByRole('link', { name: '이전으로' }).click();
  await page.getByRole('link', { name: '다음으로' }).click();
  await page.getByRole('link', { name: '% 할인 결제' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '무협만화 모두 보러가기' }).click();
  await page.locator('#defaultTab').getByRole('link', { name: '황성' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).getByRole('strong').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.locator('#defaultTab').getByRole('link', { name: '야설록' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).getByRole('strong').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.locator('#defaultTab').getByRole('link', { name: '사마달' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).getByRole('strong').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.locator('#defaultTab').getByRole('link', { name: '하승남' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).getByRole('strong').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.locator('#defaultTab').getByRole('link', { name: '묵검향' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).getByRole('strong').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '기타작가' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).getByRole('strong').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.getByRole('link', { name: '전체', exact: true }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.locator('label').filter({ hasText: '정액제' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '연재중' }).getByRole('strong').click();
  await page.getByRole('paragraph').filter({ hasText: '프리미엄' }).getByRole('strong').click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await page.locator('#contents').getByRole('link').filter({ hasText: /^$/ }).first().click();
  await page.getByRole('link', { name: '만화 정액권 결제하기' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '더보기' }).click();
  await page.locator('.btn-prev').click();
  await page.locator('.btn-next').click();
  await page.locator('.btn-last').click();
  await page.locator('.btn-first').click();
  await page.goto('https://www.mrblue.com/comic/heroism');
  await page.getByRole('link', { name: '무협만화 신작 캘린더' }).first().click();
  await page.goBack();
  await page.locator('#recent_update_box').getByRole('link', { name: '더보기' }).click();
  await page.goBack();
  await page.locator('.cover-section-inner > .top-box > .btn-more').first().click();
  await page.getByRole('link', { name: '최신순' }).click();
  await page.getByRole('link', { name: '제목순' }).click();
  await page.getByRole('link', { name: '인기순' }).click();
  await page.getByRole('link', { name: '리뷰수순' }).click();
  await page.getByRole('link', { name: '할인율순' }).click();
  await page.getByRole('link', { name: '무료순' }).click();
  await page.getByRole('link', { name: '추천순' }).click();
  await page.locator('label').filter({ hasText: '완결' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세만' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).locator('span').click();
  await page.getByRole('paragraph').filter({ hasText: '세 제외' }).getByRole('strong').click();
  await page.locator('label').filter({ hasText: '완결' }).getByRole('strong').click();
  await page.getByRole('link', { name: '다른 테마추천 보러가기' }).click();
  await page.goto('https://www.mrblue.com/theme/content/11388?sortby=recomm&filterby=completed-teen');
  await page.goto('https://www.mrblue.com/comic/heroism'); 
  await page.locator('.cover-section > .cover-section-inner > .top-box > .btn-more').first().click();
  await page.goBack();
  await page.locator('div:nth-child(10) > .cover-section-inner > .top-box > .btn-more').click();
  await page.goBack();
  await page.locator('div:nth-child(11) > .cover-section-inner > .top-box > .btn-more').click();
  await page.goBack();
  await page.locator('div:nth-child(12) > .cover-section-inner > .top-box > .btn-more').click();
  await page.goBack();
  await page.locator('div:nth-child(13) > .cover-section-inner > .top-box > .btn-more').click();
  await page.goBack();
  await page.locator('.cover-section-inner.ranking-list02 > .top-box > .btn-more').click();
  await page.goBack();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '더보기' }).click();
  await page.goBack();
});

test('만화/특별관', async ({ page }) => {
  test.setTimeout(600000);
  // 응답 상태 체크용 리스너  
  var currentPage = '만화/특별관';

  statusResponse(page, currentPage);

  // Init automation test
  await page.goto('https://www.mrblue.com/');

  // Email account login
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '로그인' }).click();
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // 만화
  await page.goto('https://www.mrblue.com/');
  await page.locator('#gnb').getByRole('link', { name: '만화' }).click();

  // 만화-특별관
  
});

test('만화/무료', async ({ page }) => {
  test.setTimeout(600000);
  // 응답 상태 체크용 리스너  
  var currentPage = '만화/무료';

  statusResponse(page, currentPage);

  // Init automation test
  await page.goto('https://www.mrblue.com/');

  // Email account login
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '로그인' }).click();
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  // 만화
  await page.goto('https://www.mrblue.com/');
  await page.locator('#gnb').getByRole('link', { name: '만화' }).click();

  // 만화-무료
  
});
*/
