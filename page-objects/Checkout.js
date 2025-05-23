import { expect } from "@playwright/test";

export class Checkout {
  constructor(page) {
    this.page = page;
    this.basketCards = page.locator('[data-qa="basket-card"]');
    this.basketItemPrice = page.locator('[data-qa="basket-item-price"]');
    this.basketItemRemoveButton = page.locator(
      '[data-qa="basket-card-remove-item"]'
    );
    this.continueToCheckoutButton = page.locator(
      '[data-qa="continue-to-checkout"]'
    );
  }

  removeCheapestProduct = async()=> {
    await this.basketCards.first().waitFor();
    const itemsBeforeRemoval = await this.basketCards.count();
    await this.basketItemPrice.first().waitFor();
    const allPriceTexts = await this.basketItemPrice.allInnerTexts();
    // console.warn({ allPriceTexts });
    // { allPriceTexts: [ '499$', '599$', '320$' ] }
    const justNumbers = allPriceTexts.map((element)=> {
      const withoutDollarSign = element.replace("$","");
      return parseInt(withoutDollarSign, 10);
      // console.warn({element});
    })
    // console.warn(allPriceTexts);
    // console.warn(justNumbers);
    const smallestPrice = Math.min(...justNumbers);
    // console.log(smallestPrice);
    const smallestPriceIdx = justNumbers.indexOf(smallestPrice);
    const specificRemoveButton = this.basketItemRemoveButton.nth(smallestPriceIdx);
    await specificRemoveButton.waitFor();
    await specificRemoveButton.click();
    await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1);
    // await this.page.pause();
  }
  continueToCheckout = async()=> {
    await this.continueToCheckoutButton.waitFor();
    await this.continueToCheckoutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 3000 }); 
    // await this.page.waitForURL("/login", { timeout: 3000 }); 
  }
}