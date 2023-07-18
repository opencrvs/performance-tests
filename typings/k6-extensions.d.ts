import { BrowserType } from "playwright";

declare module "k6/experimental/browser" {
  export const chromium: BrowserType;
}
