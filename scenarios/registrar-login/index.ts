import { Page, chromium } from "k6/experimental/browser";
import { check } from "k6";

const HOSTNAME = __ENV.HOSTNAME;

export const options = {
  iterations: 1,
};

export default async function () {
  const browser = await chromium.launch({ headless: false });
  const page = browser.newPage() as unknown as Page;

  try {
    await page.goto(
      HOSTNAME ? `https://login.${HOSTNAME}` : "http://localhost:3020"
    );

    page.locator("#username").type("k.mweene");
    page.locator("#password").type("test");

    const submitButton = page.locator("#login-mobile-submit");

    await Promise.all([page.waitForNavigation(), submitButton.click()]);

    page.locator("#code").type("000000");

    await Promise.all([
      page.waitForNavigation(),
      page.locator("#login-mobile-submit").click(),
    ]);

    page.locator("#pin-input").type("16541654");
    await page.waitForLoadState("networkidle");

    check(page, {
      'Registrar sees "In progress" queue': () => {
        const text = page.locator("#navigation_progress").textContent();
        return text.startsWith("In progress");
      },
    });
  } finally {
    page.close();
    browser.close();
  }
}
