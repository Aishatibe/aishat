import { Page, Locator } from "playwright";
import { expect } from "@playwright/test";

export interface ShirtDetails {
  name: string;
  description: string;
  price: string;
}

export class SauceDemoPage {
  private page: Page;
  private readonly USERNAME: Locator;
  private readonly PASSWORD: Locator;
  private readonly LOGIN: Locator;
  private readonly DASHBOARD: Locator;
  private readonly BURGER: Locator;
  private readonly LOGOUT: Locator;
  private readonly TSHIRT: Locator;
  private readonly CART: Locator;
  private readonly CART_ITEMS: Locator;
  private readonly CART_PAGE: Locator;
  private readonly TSHIRT_NAME: Locator;
  private readonly TSHIRT_DESCRIPTION: Locator;
  private readonly CART_BADGE: Locator;
  private readonly TSHIRT_PRICE: Locator;
  private readonly CART_SHIRT_NAME: Locator;
  private readonly CART_SHIRT_DESCRIPTION: Locator;
  private readonly CART_SHIRT_PRICE: Locator;
  private readonly CHECKOUT_BUTTON: Locator;
  private readonly CHECKOUT_INFORMATION: Locator;
  private readonly FIRST_NAME: Locator;
  private readonly LAST_NAME: Locator;
  private readonly ZIP_CODE: Locator;
  private readonly CONTINUE: Locator;
  private readonly TOTALPRICE: Locator;
  private readonly FINISH: Locator;
  private readonly COMPLETE_ORDER: Locator;
  private readonly SUCCESS_MESSAGE: Locator;

  constructor(page: Page) {
    this.page = page;
    this.USERNAME = page.locator("#user-name");
    this.PASSWORD = page.locator("#password");
    this.LOGIN = page.locator("#login-button");
    this.DASHBOARD = page.locator("//span[@class='title']");
    this.BURGER = page.locator("#react-burger-menu-btn");
    this.LOGOUT = page.locator("#logout_sidebar_link");
    this.TSHIRT = page.locator("//img[@alt='Sauce Labs Bolt T-Shirt']");
    this.TSHIRT_NAME = page.locator(
      "//div[@class='inventory_details_name large_size']"
    );
    this.TSHIRT_DESCRIPTION = page.locator(
      "//div[@class='inventory_details_desc large_size']"
    );
    this.TSHIRT_PRICE = page.locator("//div[@class='inventory_details_price']");
    this.CART_SHIRT_NAME = page.locator("//div[@class='inventory_item_name']");
    this.CART_SHIRT_DESCRIPTION = page.locator(
      "//div[@class='inventory_item_desc']"
    );
    this.CART_SHIRT_PRICE = page.locator(
      "//div[@class='inventory_item_price']"
    );
    this.CART = page.locator("//a[@class='shopping_cart_link']");
    this.CART_ITEMS = page.locator("(//div[@class='cart_item'])");
    this.CART_PAGE = page.locator("//span[@class='title']");
    this.CHECKOUT_BUTTON = page.locator("#checkout");
    this.CHECKOUT_INFORMATION = page.locator("//span[@class='title']");
    this.FIRST_NAME = page.locator("#first-name");
    this.LAST_NAME = page.locator("#last-name");
    this.ZIP_CODE = page.locator("#postal-code");
    this.CONTINUE = page.locator("#continue");
    this.TOTALPRICE = page.locator(
      "//div[@class='summary_info_label summary_total_label']"
    );
    this.FINISH = page.locator("#finish");
    this.COMPLETE_ORDER = page.locator(".complete-header");
    this.SUCCESS_MESSAGE = page.locator(".complete-text");
  }

  async openLoginPage() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async login(username: string, password: string) {
    await this.USERNAME.fill(username);
    await this.PASSWORD.fill(password);
    await this.LOGIN.click();
  }

  async logOut() {
    await this.BURGER.click();
    await this.LOGOUT.click();
  }

  async selectTshirt() {
    await this.TSHIRT.click();
  }

  async addToCart(itemName: string) {
    const addToCartButton = this.page.locator(
      `//button[@id='${itemName.toLowerCase()}']`
    );
    await addToCartButton.click();
  }

  async getCartCount(): Promise<number> {
    const CART_BADGE = this.page.locator(
      "//span[@class='shopping_cart_badge']"
    );
    if (CART_BADGE !== null && this.CART_BADGE !== undefined) {
      const cartBadgeNumber = await this.CART_BADGE.textContent();
      return parseInt(cartBadgeNumber ?? "0");
    }
    return 0;
  }

  async goToCart() {
    await this.CART.click();
  }

  async checkout() {
    await this.CHECKOUT_BUTTON.click();
  }

  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    zipcode: string
  ) {
    await this.FIRST_NAME.fill(firstName);
    await this.LAST_NAME.fill(lastName);
    await this.ZIP_CODE.fill(zipcode);
  }

  async continue() {
    await this.CONTINUE.click();
  }

  async finish() {
    await this.FINISH.click();
  }

  async extractShirtDetails(): Promise<ShirtDetails> {
    const name = await this.TSHIRT_NAME.textContent();
    const description = await this.TSHIRT_DESCRIPTION.textContent();
    const price = await this.TSHIRT_PRICE.textContent();
    return {
      name: name || "",
      description: description || "",
      price: price || "",
    };
  }

  async extractCartShirtDetails(): Promise<ShirtDetails> {
    const name = await this.CART_SHIRT_NAME.textContent();
    const description = await this.CART_SHIRT_DESCRIPTION.textContent();
    const price = await this.CART_SHIRT_PRICE.textContent({ timeout: 10000 });
    return {
      name: name || "",
      description: description || "",
      price: price || "",
    };
  }

  async compareShirtDetails() {
    await this.selectTshirt();
    const shirtDetailsPage = await this.extractShirtDetails();
    const addToCartButton = this.page.locator(
      "//button[@id='add-to-cart-sauce-labs-bolt-t-shirt']"
    );
    const buttonExists = await addToCartButton.isVisible();
    if (buttonExists) {
      await this.addToCart("add-to-cart-sauce-labs-bolt-t-shirt");
      await this.goToCart();
      const shirtDetailsCart = await this.extractCartShirtDetails();
      expect(shirtDetailsCart).toEqual(shirtDetailsPage);
      console.log(shirtDetailsCart, shirtDetailsPage);
    } else {
      await this.goToCart();
      const shirtDetailsCart = await this.extractCartShirtDetails();
      expect(shirtDetailsCart).toEqual(shirtDetailsPage);
      console.log(shirtDetailsCart, shirtDetailsPage);
    }
  }

  async verifyOrderSummaryPage() {
    const expectedOrderSummary = {
      name: "Sauce Labs Bolt T-Shirt",
      description:
        "Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.",
      price: "$15.99",
      total: "$17.27",
    };
    await this.selectTshirt();
    await this.addToCart("add-to-cart-sauce-labs-bolt-t-shirt");
    await this.goToCart();
    const orderSummary = await this.extractCartShirtDetails();
    await this.checkout();
    await this.fillCheckoutInformation("Ada", "Salma", "ws23edd");
    await this.continue();
    const totalPrice = await this.TOTALPRICE.textContent();
    const total = totalPrice?.split(" ")[1];
    console.log(total);

    const orderSummaryDetails = { total, ...orderSummary };
    console.log(orderSummaryDetails);
    expect(orderSummaryDetails).toEqual(expectedOrderSummary);
  }

  async isUserLoggedIn() {
    await expect(this.page).toHaveURL(
      "https://www.saucedemo.com/inventory.html",
      { timeout: 60000 }
    );
  }

  async isUserOnProductsPage() {
    const dashboardText = await this.DASHBOARD.textContent();
    expect(dashboardText).toContain("Products");
  }

  async isUserOnLoginPage() {
    await expect(this.page).toHaveURL("https://www.saucedemo.com/", {
      timeout: 60000,
    });
  }

  async isTshirtDetailsDisplayed(name: string, description: string) {
    await this.selectTshirt();
    const tshirtName = await this.TSHIRT_NAME.textContent();
    const tshirtDescription = await this.TSHIRT_DESCRIPTION.textContent();
    expect(tshirtName).toContain(name);
    expect(tshirtDescription).toContain(description);
  }

  async isItemAddedToCart() {
    const initialCartCount = await this.getCartCount();
    await this.selectTshirt();
    await this.addToCart("add-to-cart-sauce-labs-bolt-t-shirt");
    const currentCartCount = await this.getCartCount();
    expect(currentCartCount > initialCartCount);
  }

  async isCartPageDisplayed(cartPageTitle: string) {
    await this.goToCart();
    const cartTitle = await this.CART_PAGE.textContent();
    expect(cartTitle).toContain(cartPageTitle);
  }

  async isItemInCart(itemName: string): Promise<boolean> {
    const cartItems = await this.CART_ITEMS.elementHandles();
    for (const itemHandle of cartItems) {
      const item = await itemHandle.$(".inventory_item_name");
      if (item) {
        const itemTitle = await item.textContent();
        if (itemTitle !== null && itemTitle.trim() === itemName) {
          return true;
        }
      }
    }
    return false;
  }

  async isCheckoutDisplayed(checkoutInformation: string) {
    await this.goToCart();
    await this.checkout();
    const checkoutInfo = await this.CHECKOUT_INFORMATION.textContent();
    expect(checkoutInfo).toContain(checkoutInformation);
  }

  async verifySuccessfulOrder(
    thankYouMessage: string,
    orderSuccessMessage: string
  ) {
    await this.selectTshirt();
    const addToCartButton = this.page.locator(
      "//button[@id='add-to-cart-sauce-labs-bolt-t-shirt']"
    );
    const buttonExists = await addToCartButton.isVisible();
    if (buttonExists) {
      await this.addToCart("add-to-cart-sauce-labs-bolt-t-shirt");
      await this.goToCart();
      await this.checkout();
      await this.fillCheckoutInformation("Ada", "Salma", "ws23edd");
      await this.continue();
      await this.finish();
      const thanksmessage = await this.COMPLETE_ORDER.textContent();
      const successMessage = await this.SUCCESS_MESSAGE.textContent();
      expect(thanksmessage).toContain(thankYouMessage);
      expect(successMessage).toContain(orderSuccessMessage);
    } else {
      await this.goToCart();
      await this.checkout();
      await this.fillCheckoutInformation("Ada", "Salma", "ws23edd");
      await this.continue();
      await this.finish();
      const thanksmessage = await this.COMPLETE_ORDER.textContent();
      const successMessage = await this.SUCCESS_MESSAGE.textContent();
      expect(thanksmessage).toContain(thankYouMessage);
      expect(successMessage).toContain(orderSuccessMessage);
    }
  }
}
