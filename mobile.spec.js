// tests/mobile.spec.ts
import { test, expect, devices } from '@playwright/test';
import { defineConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { htmlToText } from 'html-to-text';
import debug from 'debug';
import { waitAndClick } from './utils';

// 디바이스 설정
const pixel7 = {
  name: 'Pixel 7',
  userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
};
const logFile = `./test_log_${getCurrentTimestamp()}.txt`;


// 액션 타임아웃 시간 설정
test.use({
  ...pixel7,
  actionTimeout: 5000,   // 모든 액션 (click, fill 등)에 기본 timeout
  expect: { timeout: 5000 }, // expect() 관련 timeout 기본값
});

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

// 로그 파일 리포트 첨부
async function attachLogFile(testInfo, logFilePath, attachName = '테스트 실행 로그') {
  if (fs.existsSync(logFilePath)) {
    const logContent = fs.readFileSync(logFilePath, 'utf-8');
    await testInfo.attach(attachName, {
      body: Buffer.from(logContent, 'utf-8'),
      contentType: 'text/plain',
    });
  } else {
    console.warn(`로그 파일이 없습니다: ${logFilePath}`);
  }
}

// 로그 중복 URL 출력 방지
const state = {
  lastPageURL: null,
  lastLoggedPageUrl: null
};

// 400-500에러 발생 시 테스트 일시정지
async function checkAndMaybePause(page) {
  if (someCondition) {
    await page.pause(); // 조건 만족 시 pause
  }
}

// 응답 상태 체크용 리스너
function statusResponse(page, state, currentPage) {
  console.log('---------------------------------- ' + currentPage + ' ----------------------------------');
  logToFile('---------------------------------- ' + currentPage + ' ----------------------------------');

  page.removeAllListeners('response');

  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    const currentPageUrl = page.url();

    if (currentPageUrl !== 'about:blank' && currentPageUrl !== state.lastLoggedPageUrl) {
      logToFile(`🌐 Page URL: ${currentPageUrl}`);
      state.lastLoggedPageUrl = currentPageUrl;
    }

    let statusIcon = '';
    if (status >= 400 && status !== 429) {
      statusIcon = '❌';
    } else if (status === 200) {
      statusIcon = '🟢';
    } else {
      statusIcon = '⚠️';
    }

    if (!state.hasLoggedFirstStatus) {
      state.hasLoggedFirstStatus = true;
      return;
    }

    const logMessage = ` ┗ ${statusIcon} HTTP ${status} - ${url}`;
    logToFile(logMessage);

    state.lastPageURL = url;
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test.use({ ...pixel7 });

let tcNumber = 1; // 전역 변수

async function runTestCase(testCaseName, fn) {
  const formattedNumber = tcNumber.toString().padStart(4, '0');
  try {
    await fn();
    console.log(`TC-${formattedNumber}  ${testCaseName} : 🟢 PASS`);
  } catch (e) {
    console.log(`TC-${formattedNumber}  ${testCaseName} : ❌ FAIL`);
    console.error(e);
  }
  tcNumber++;
}

async function goBackAndWait(page) {
  await page.goBack();
  await page.waitForLoadState('load');
}


test('GNB', async ({ page }, testInfo) => {
  test.setTimeout(200000);

  statusResponse(page, state, 'GNB');

  await page.goto('https://m.mrblue.com');

  await runTestCase('이메일 계정 로그인', async () => {
    await page.goto('https://m.mrblue.com/login/');
    await page.getByRole('textbox', { name: '아이디' }).click();
    await page.getByRole('textbox', { name: '아이디' }).fill('wenyamaro@naver.com');
    await page.getByRole('textbox', { name: '비밀번호' }).click();
    await page.getByRole('textbox', { name: '비밀번호' }).fill('f8611421!');
    await page.getByRole('button', { name: '로그인' }).click();
  });

  /*
  await runTestCase('메인 팝업 닫기', async () => {
    await page.click('.PopupBannerModal_btn-close__dUHAh');
  });
  */

  await runTestCase('GNB > 완전판 다운로드 배너 > 받기 버튼 클릭', async () => {
    await page.click('.HeaderBanner_btn-receive__ZCt42');
    await expect(page).toHaveURL('https://m.mrblue.com/viewer/download.asp');
  });
  await page.goBack();
  await page.waitForLoadState('load');

  await runTestCase('GNB > 완전판 다운로드 배너 > 닫기 버튼 클릭', async () => {
    await page.getByRole('button', { name: '닫기', exact: true }).click();
  });

  await runTestCase('GNB > BI 클릭', async () => {
    await page.click('.IconMBLogoKorean_wrap-big__7_mcp');
  });

  await runTestCase('GNB > 검색 버튼 클릭', async () => {
    const container = page.locator('div.MainHomeHeaderTop_box-right__uYOFX');
    await container.getByRole('link', { name: 'search' }).click();
  });

  await runTestCase('GNB > 검색어 입력 후 검색 실행', async () => {
    await page.getByRole('textbox', { name: '작품, 작가, 출판사, 키워드 검색' }).click();
    await page.getByRole('textbox', { name: '작품, 작가, 출판사, 키워드 검색' }).fill('가');
    await page.getByRole('textbox', { name: '작품, 작가, 출판사, 키워드 검색' }).press('Enter');
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/search/all?keyword=%EA%B0%80');
  });

  await runTestCase('검색결과 페이지 > 뒤로가기 버튼 클릭', async () => {
    await page.getByRole('button').first().click();
  });

  await runTestCase('검색메인 페이지 > 뒤로가기 버튼 클릭', async () => {
    await page.getByRole('button').filter({ hasText: /^$/ }).click();
  });

  await runTestCase('GNB > 사이드 메뉴 열기', async () => {
    const container = page.locator('div.MainHomeHeaderTop_box-right__uYOFX');
    await container.getByRole('button', { name: 'side menu' }).click();
  });

  await runTestCase('GNB > 사이드 메뉴 닫기', async () => {
    await page.getByRole('button', { name: '사이드바 닫기' }).click();
  });

  await runTestCase('GNB > 웹툰 메뉴 탭 클릭', async () => {
    const container = page.locator('div.HeaderBottom_header-bottom__Xbv3s.scrollbar-hidden.HeaderBottom_home__OBMxP')
    await container.getByRole('link', { name: '웹툰', exact: true }).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/webtoon');
  });
  await goBackAndWait(page);

  await runTestCase('GNB > 만화 메뉴 탭 클릭', async () => {
    const container = page.locator('div.HeaderBottom_header-bottom__Xbv3s.scrollbar-hidden.HeaderBottom_home__OBMxP')
    await container.getByRole('link', { name: '만화', exact: true }).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/comic');
  });
  await goBackAndWait(page);

  await runTestCase('GNB > 소설 메뉴 탭 클릭', async () => {
    const container = page.locator('div.HeaderBottom_header-bottom__Xbv3s.scrollbar-hidden.HeaderBottom_home__OBMxP')
    await container.getByRole('link', { name: '소설', exact: true }).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/novel/ranking');
  });
  await goBackAndWait(page);

  await runTestCase('GNB > 무료쿠폰 메뉴 탭 클릭', async () => {
    const container = page.locator('div.HeaderBottom_header-bottom__Xbv3s.scrollbar-hidden.HeaderBottom_home__OBMxP')
    await container.getByRole('link', { name: '무료쿠폰', exact: true }).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
  });
  await goBackAndWait(page);

  await runTestCase('GNB > 웹툰 > BI 클릭', async () => {
    await page.goto('https://m.mrblue.com/webtoon');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.ContentsHomeHeaderTop_box-left__ivHol').click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/');
  });

  await runTestCase('GNB > 웹툰 > 메뉴 셀렉트 박스 열기/닫기', async () => {
    await page.goto('https://m.mrblue.com/webtoon');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
  });

  await runTestCase('GNB > 웹툰 > 메뉴 셀렉트 박스 > 홈 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/webtoon');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(0).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/');
  });

  await runTestCase('GNB > 웹툰 > 메뉴 셀렉트 박스 > 웹툰 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/webtoon');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(1).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/webtoon');
  });

  await runTestCase('GNB > 웹툰 > 메뉴 셀렉트 박스 > 만화 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/webtoon');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(2).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/comic');
  });

  await runTestCase('GNB > 웹툰 > 메뉴 셀렉트 박스 > 소설 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/webtoon');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(3).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/novel/ranking');
  });

  await runTestCase('GNB > 웹툰 > 메뉴 셀렉트 박스 > 무료쿠폰 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/webtoon');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(4).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
  });

  await runTestCase('GNB > 만화 > BI 클릭', async () => {
    await page.goto('https://m.mrblue.com/comic');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.ContentsHomeHeaderTop_box-left__ivHol').click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/');
  });

  await runTestCase('GNB > 만화 > 메뉴 셀렉트 박스 열기/닫기', async () => {
    await page.goto('https://m.mrblue.com/comic');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
  });

  await runTestCase('GNB > 만화 > 메뉴 셀렉트 박스 > 홈 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/comic');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(0).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/');
  });

  await runTestCase('GNB > 만화 > 메뉴 셀렉트 박스 > 웹툰 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/comic');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(1).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/webtoon');
  });

  await runTestCase('GNB > 만화 > 메뉴 셀렉트 박스 > 만화 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/comic');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(2).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/comic');
  });

  await runTestCase('GNB > 만화 > 메뉴 셀렉트 박스 > 소설 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/comic');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(3).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/novel/ranking');
  });

  await runTestCase('GNB > 만화 > 메뉴 셀렉트 박스 > 무료쿠폰 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/comic');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(4).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
  });

    await runTestCase('GNB > 소설 > BI 클릭', async () => {
    await page.goto('https://m.mrblue.com/novel/ranking');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.ContentsHomeHeaderTop_box-left__ivHol').click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/');
  });

  await runTestCase('GNB > 소설 > 메뉴 셀렉트 박스 열기/닫기', async () => {
    await page.goto('https://m.mrblue.com/novel/ranking');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
  });

  await runTestCase('GNB > 소설 > 메뉴 셀렉트 박스 > 홈 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/novel/ranking');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(0).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/');
  });

  await runTestCase('GNB > 소설 > 메뉴 셀렉트 박스 > 웹툰 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/novel/ranking');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(1).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/webtoon');
  });

  await runTestCase('GNB > 소설 > 메뉴 셀렉트 박스 > 만화 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/novel/ranking');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(2).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/comic');
  });

  await runTestCase('GNB > 소설 > 메뉴 셀렉트 박스 > 소설 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/novel/ranking');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(3).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/novel/ranking');
  });

  await runTestCase('GNB > 소설 > 메뉴 셀렉트 박스 > 무료쿠폰 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(4).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
  });

    await runTestCase('GNB > 무료쿠폰 > BI 클릭', async () => {
    await page.goto('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.ContentsHomeHeaderTop_box-left__ivHol').click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/');
  });

  await runTestCase('GNB > 무료쿠폰 > 메뉴 셀렉트 박스 열기/닫기', async () => {
    await page.goto('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
  });

  await runTestCase('GNB > 무료쿠폰 > 메뉴 셀렉트 박스 > 홈 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(0).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/');
  });

  await runTestCase('GNB > 무료쿠폰 > 메뉴 셀렉트 박스 > 웹툰 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(1).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/webtoon');
  });

  await runTestCase('GNB > 무료쿠폰 > 메뉴 셀렉트 박스 > 만화 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(2).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/comic');
  });

  await runTestCase('GNB > 무료쿠폰 > 메뉴 셀렉트 박스 > 소설 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(3).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/novel/ranking');
  });

  await runTestCase('GNB > 무료쿠폰 > 메뉴 셀렉트 박스 > 무료쿠폰 버튼 클릭', async () => {
    await page.goto('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
    await page.waitForLoadState('load');
    const container = page.locator('div.ContentsHomeHeaderTop_header-top__OpvGQ')
    await container.locator('div.MenuDropDown_wrap-menu__tONiI').click();
    await page.locator('ul.MenuDropDown_list-menu__tyuh7.MenuDropDown_visible__jBziM li').nth(4).click();
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://m.mrblue.com/freecoupon/wait?type=ALL&sort=RECOMMENDED');
  });

  await attachLogFile(testInfo, logFile);
});
