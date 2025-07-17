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


test('총메인', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = '총메인';

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

  await page.getByRole('link', { name: '이전으로' }).click();
  await page.getByRole('link', { name: '다음으로' }).click();
  await page.locator('.banner-visual > ul > li > a').first().click();
  await page.goBack();
  await page.getByRole('link', { name: '성인만화' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '무협만화' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '정액제만화' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '판타지소설' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '무협소설' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '로맨스소설' }).click();
  await page.goBack();
  await page.getByRole('link', { name: '오리지널웹툰' }).click();
  await page.goBack();
  await page.locator('.banner-visual > ul > li:nth-child(3) > a').click();
  await page.goBack();
  await page.getByRole('link', { name: '키워드검색' }).click();
  await page.goBack();
  await page.locator('span > .webtoon').first().click();
  await page.locator('span:nth-child(2) > .comic').first().click();
  await page.locator('span:nth-child(3) > .fiction').first().click();
  await page.locator('.btn-more.btn-type01').first().click();
  await page.goBack();
  await page.locator('.control-box > .btn-prev').first().click();
  await page.locator('.control-box > .btn-next').first().click();
  await page.goBack();
  await page.locator('#jumping_pass_box').getByRole('link', { name: '웹툰' }).click();
  await page.locator('#jumping_pass_box').getByRole('link', { name: '만화' }).click();
  await page.locator('#jumping_pass_box').getByRole('link', { name: '소설' }).click();
  await page.locator('#jumping_pass_box').getByRole('link', { name: '더보기' }).click();
  await page.goBack();
  await page.locator('#jumping_pass_box > .thumb-list01 > .control-box > .btn-prev').click();
  await page.locator('#jumping_pass_box > .thumb-list01 > .control-box > .btn-next').click();
  await page.locator('#ranking_box > .top-box > .tab-type02 > span > .webtoon').first().click();
  await page.locator('#ranking_box > .top-box > .tab-type02 > span:nth-child(2) > .comic').first().click();
  await page.locator('#ranking_box > .top-box > .tab-type02 > span:nth-child(3) > .fiction').first().click();
  await page.locator('#ranking_box > .top-box > .btn-more').first().click();
  await page.goBack();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '웹툰' }).click();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '만화' }).click();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '소설', exact: true }).click();
  await page.locator('#popular_keyword_box').getByRole('link', { name: '더보기' }).click();
  await page.goBack();
  await page.locator('#today_recomm_box').getByRole('link', { name: '웹툰' }).click();
  await page.locator('#today_recomm_box').getByRole('link', { name: '만화' }).click();
  await page.locator('#today_recomm_box').getByRole('link', { name: '소설' }).click();
  await page.locator('#today_recomm_box').getByRole('link', { name: '더보기' }).click();
  await page.goBack();
  await page.locator('#today_recomm_box > .control-box > .btn-prev').click();
  await page.locator('#today_recomm_box > .control-box > .btn-next').click();
  await page.locator('.cover-section.ranking-bg.mt60.bg > #ranking_box > .top-box > .tab-type02 > span > .webtoon').first().click();
  await page.locator('.cover-section.ranking-bg.mt60.bg > #ranking_box > .top-box > .tab-type02 > span:nth-child(2) > .comic').first().click();
  await page.locator('.cover-section.ranking-bg.mt60.bg > #ranking_box > .top-box > .tab-type02 > span:nth-child(3) > .fiction').first().click();
  await page.locator('.cover-section.ranking-bg.mt60.bg > #ranking_box > .top-box > .btn-more').first().click();
  await page.goBack();
  await page.locator('.less-1000won > .thumb-list01 > .top-box > .tab-type02 > span > .comic').click();
  await page.locator('span:nth-child(2) > .fiction').click();
  await page.locator('.less-1000won > .thumb-list01 > .top-box > .btn-more').click();
  await page.goBack();
  await page.locator('.less-1000won > .thumb-list01 > .control-box > .btn-prev').click();
  await page.locator('.less-1000won > .thumb-list01 > .control-box > .btn-next').click();
  await page.locator('.cover-section-inner.thumb-list02 > .top-box > .btn-more').click();
  await page.goBack();
  await page.locator('.cover-section-inner > .control-box > .btn-prev').click();
  await page.locator('.cover-section-inner > .control-box > .btn-next').click();
  await page.locator('div:nth-child(11) > #ranking_box > .top-box > .tab-type02 > span > .webtoon').click();
  await page.locator('div:nth-child(11) > #ranking_box > .top-box > .tab-type02 > span:nth-child(2) > .comic').click();
  await page.locator('div:nth-child(11) > #ranking_box > .top-box > .tab-type02 > span:nth-child(3) > .fiction').click();
  await page.locator('div:nth-child(11) > #ranking_box > .top-box > .btn-more').click();
  await page.goBack();
  await page.getByRole('link', { name: '소중한 웹툰 작가님을 모십니다. 연재문의' }).click();
  await page.goBack();
  await page.locator('.main-notice > .btn-type03').click();
  await page.goBack();
  await page.getByRole('link', { name: '모바일 완전판 앱', exact: true }).click();
  await page.goBack();
  await page.getByRole('link', { name: '모바일 완전판 앱 원스토어' }).click();
  await page.goBack();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Google play' }).click();
  const page1 = await page1Promise;
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'App Store' }).click();
  const page2 = await page2Promise;
});