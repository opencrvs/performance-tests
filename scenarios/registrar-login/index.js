import { chromium } from 'k6/experimental/browser';
import { check } from 'k6';

export const options = {
  iterations: 10
}

export default async function () {
  const browser = chromium.launch({ headless: false });
  const page = browser.newPage();

  try {
    await page.goto('http://localhost:3020');

    page.locator('#username').type('k.mweene');
    page.locator('#password').type('test');

    const submitButton = page.locator('#login-mobile-submit');

    await Promise.all([page.waitForNavigation(), submitButton.click()]);

    page.locator('#code').type('000000');

    await Promise.all([
      page.waitForNavigation(),
      page.locator('#login-mobile-submit').click()
    ]);

    page.locator('#pin-input').type('16541654');
    await page.waitForLoadState('networkidle');

    check(page, {
      header: page.locator('#navigation_progress').textContent() == 'In progress',
    });

  } finally {
    page.close();
    browser.close();
  }
}