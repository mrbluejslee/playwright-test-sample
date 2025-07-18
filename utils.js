export async function waitAndClick(locator, timeout = 5000) {
  await locator.waitFor({ state: 'visible', timeout });
  await locator.scrollIntoViewIfNeeded();
  await locator.click({ timeout });
}