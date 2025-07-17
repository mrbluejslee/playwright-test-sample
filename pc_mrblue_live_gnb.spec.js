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


test('GNB', async ({ page }) => {
  test.setTimeout(120000);
  
  var currentPage = 'GNB';

  statusResponse(page, currentPage);
  
  // Init automation test
  await page.goto('https://www.mrblue.com/');

  // Email account login
  await page.getByRole('link', { name: '로그인' }).click();
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill('npayuser_live@yopmail.com');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('1234');
  await page.locator('#loginPageForm').getByRole('link', { name: '로그인', exact: true }).click();

  await page.getByRole('link', { name: '미스터블루', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '전체보기 닫기' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '홈으로' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '웹툰' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '연재' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '오리지널' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '단편' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '장르' }).nth(1).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '완결' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '랭킹' }).nth(1).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '만화' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '추천', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '장르' }).nth(2).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '무협관' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '특별관' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '무료', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '랭킹' }).nth(2).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '소설' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '랭킹' }).nth(3).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '판타지' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '무협', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '로맨스' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '로맨스' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: 'BL' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '일반' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '기다리면 무료' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '점핑패스' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '선물함', exact: true }).first().click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('row').getByRole('link', { name: '이벤트' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.locator('div.all-menu.active a:has-text("알림함")').first().click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '테마추천' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '키워드로 검색' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '내 서재' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.locator('#gnb').getByRole('link', { name: '최근 본 작품' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.locator('#gnb').getByRole('link', { name: '보관함' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.locator('#gnb').getByRole('link', { name: '책갈피' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.locator('#gnb').getByRole('link', { name: '찜 한 작품' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.locator('#gnb').getByRole('link', { name: '찜 한 작가' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '내리뷰' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '내 정보', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '내 정보 홈' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '블루머니', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '정액권', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '블루마일리지', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '쿠폰등록', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '정보 변경', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.locator('#gnb').getByRole('link', { name: '고객센터', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '고객센터 홈' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '공지사항', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '자주하는 질문', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: ':1 문의' }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '약관 및 정책', exact: true }).click();
  await page.getByRole('link', { name: '전체보기', exact: true }).click();
  await page.getByRole('link', { name: '뷰어 설치안내' }).click();
  await page.getByRole('link', { name: '웹툰', exact: true }).first().click();
  await page.getByRole('link', { name: '연재', exact: true }).click();
  await page.getByRole('link', { name: '오리지널' }).click();
  await page.getByRole('link', { name: '단편' }).click();
  await page.getByRole('link', { name: '장르' }).click();
  await page.getByRole('link', { name: '완결' }).click();
  await page.getByRole('link', { name: '랭킹' }).click();
  await page.getByRole('link', { name: '만화' }).click();
  await page.getByRole('link', { name: '추천', exact: true }).click();
  await page.getByRole('link', { name: '장르' }).click();
  await page.getByRole('link', { name: '무협관' }).click();
  await page.getByRole('link', { name: '특별관' }).click();
  await page.getByRole('link', { name: '무료', exact: true }).click();
  await page.getByRole('link', { name: '랭킹' }).click();
  await page.getByRole('link', { name: '소설' }).click();
  await page.getByRole('link', { name: '랭킹', exact: true }).click();
  await page.getByRole('link', { name: '판타지' }).click();
  await page.getByRole('link', { name: '단행본', exact: true }).click();
  await page.getByRole('link', { name: '웹소설' }).click();
  await page.getByRole('link', { name: '무협', exact: true }).click();
  await page.getByRole('link', { name: '단행본', exact: true }).click();
  await page.getByRole('link', { name: '웹소설' }).click();
  await page.getByRole('link', { name: '로맨스' }).click();
  await page.getByRole('link', { name: '단행본', exact: true }).click();
  await page.getByRole('link', { name: '웹소설' }).click();
  await page.getByRole('link', { name: 'BL' }).first().click();
  await page.getByRole('link', { name: '단행본', exact: true }).click();
  await page.locator('.publication').click();
  await page.getByRole('link', { name: '일반' }).click();
  await page.getByRole('link', { name: '기다리면 무료' }).click();
  await page.getByRole('link', { name: '점핑패스' }).click();
  await page.getByRole('link', { name: '이벤트' }).click();
  await page.getByRole('link', { name: '블루머니 충전' }).click();
  await page.getByRole('link', { name: '알림함', exact: true }).click();
  await page.getByRole('link', { name: '선물함' }).click();
  await page.getByRole('link', { name: '내서재' }).click();
  await page.getByRole('link', { name: '내정보' }).click();
  await page.getByRole('textbox', { name: '검색어 입력' }).click();
  await page.getByRole('textbox', { name: '검색어 입력' }).fill('묵향');
  await page.getByRole('button', { name: '검색' }).click();
});