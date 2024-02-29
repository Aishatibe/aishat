import { chromium, Browser, BrowserContext, Page } from "playwright";
import { test } from "@playwright/test";
import { SauceDemoPage } from "../pages/sauceDemoPages";

test.describe("SauceDemo Test Suites", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let sauceDemoPage: SauceDemoPage;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext({ acceptDownloads: false });
    page = await context.newPage();
    sauceDemoPage = new SauceDemoPage(page);
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.beforeEach(async () => {
    await sauceDemoPage.openLoginPage();
    await sauceDemoPage.login("standard_user", "secret_sauce");
    await sauceDemoPage.isUserLoggedIn();
  });

  test(`Verify that the login is successful and
        the user is on the products page`, async () => {
    await sauceDemoPage.isUserOnProductsPage();
  });

  test(`Verify that the T-shirt details page is displayed`, async () => {
    await sauceDemoPage.isTshirtDetailsDisplayed(
      "Sauce Labs Bolt T-Shirt",
      "Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt."
    );
  });

  test(`Verify that the the T-shirt is added to the cart successfully`, async () => {
    await sauceDemoPage.isItemAddedToCart();
  });

  test(`Verify that the cart page is displayed`, async () => {
    await sauceDemoPage.isCartPageDisplayed("Your Cart");
  });

  test(`Verify that the shirt is listed in the cart and
        the name, price and description is correct`, async () => {
    await sauceDemoPage.compareShirtDetails();
  });

  test(`Verify that the checkout page is displayed`, async () => {
    await sauceDemoPage.isCheckoutDisplayed("Checkout: Your Information");
  });

  test(`Verify that the order summary page is displayed`, async () => {
    await sauceDemoPage.verifyOrderSummaryPage();
  });

  test(`Verify that the order confirmation page is displayed indicating a successful purchase`, async () => {
    await sauceDemoPage.verifySuccessfulOrder(
      "Thank you for your order!",
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
    );
  });

  test(`Verify that the user is successfully logged out and
        redirected to the login page`, async () => {
    await sauceDemoPage.logOut();
    await sauceDemoPage.isUserOnLoginPage();
  });
});
