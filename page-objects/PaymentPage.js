import { expect } from "@playwright/test";

export class PaymentPage {
  constructor(page) {
    this.page = page;

    // this.discountCode = page.locator("iframe")
    //   .contentFrame()
    //   .getByText("0590de071d05");
    this.discountCode = page
      .frameLocator('[data-qa="active-discount-container"]')
      .locator('[data-qa="discount-code"]');
    // new element for the discount input
    this.discountInput = page.getByRole("textbox", { name: "Discount code" });
    this.activateDiscountButton = page.locator(
      '[data-qa="submit-discount-button"]'
    );
    this.totalValue = page.locator('[data-qa="total-value"]');
    this.discountedValue = page.locator(
      '[data-qa="total-with-discount-value"]'
    );
    this.discountActiveMessage = page.locator(
      '[data-qa="discount-active-message"]'
    );
    this.creditCardOwnerInput = page.getByPlaceholder("Credit card owner");
    this.creditCardNumberInput = page.getByPlaceholder("Credit card number");
    this.creditCardValidUntilInput = page.getByPlaceholder("Valid until");
    this.creditCardCvcInput = page.getByPlaceholder("Credit card CVC");
    this.payButton = page.locator('[data-qa="pay-button"]');
  }

  activateDiscount = async () => {
    await this.discountCode.waitFor();
    const code = await this.discountCode.innerText();
    await this.discountInput.waitFor();

    // Option 1 for laggy inputs: using .fill() with await expect() //
    await this.discountInput.fill(code);
    // expect(await this.discountInput.inputValue()).toBe(code);
    await expect(this.discountInput).toHaveValue(code);
    // await this.page.pause();

    // Optin 2 for laggy inputs: slow typing //
    // await this.discountInput.focus();
    // await this.page.keyboard.type(code, {delay: 1000});
    // expect(await this.discountInput.inputValue()).toBe(code);
    // await this.page.pause();

    expect(await this.discountedValue.isVisible()).toBe(false);
    expect(await this.discountActiveMessage.isVisible()).toBe(false);
    await this.activateDiscountButton.waitFor();
    await this.activateDiscountButton.click();

    // Check that it displays "Discount activated"
    await this.discountActiveMessage.waitFor();

    // Check that there is now a discounted price total showing
    await this.discountedValue.waitFor();
    const discountValueText = await this.discountedValue.innerText();
    const discountedValueOnlyStringNumber = discountValueText.replace("$", "");
    const discountValueNumber = parseInt(discountedValueOnlyStringNumber, 10);

    await this.totalValue.waitFor();
    const totalValueText = await this.totalValue.innerText();
    const totalValueOnlyStringNumber = totalValueText.replace("$", "");
    const totalValueNumber = parseInt(totalValueOnlyStringNumber, 10);

    // Check that the discounted price total is smaller than the regular one
    expect(discountValueNumber).toBeLessThan(totalValueNumber);
    // await this.page.pause();
  };

  fillPaymentDetails = async (paymentDetails) => {
    await this.creditCardOwnerInput.waitFor();
    await this.creditCardOwnerInput.fill(paymentDetails.owner);
    await this.creditCardNumberInput.waitFor();
    await this.creditCardNumberInput.fill(paymentDetails.number);
    await this.creditCardValidUntilInput.waitFor();
    await this.creditCardValidUntilInput.fill(paymentDetails.validUntil);
    await this.creditCardCvcInput.waitFor();
    await this.creditCardCvcInput.fill(paymentDetails.cvc);
    // await this.page.pause();
  };

  completePayment = async()=> {
    await this.payButton.waitFor();
    await this.payButton.click();
    await this.page.waitForURL(/\/thank-you/, {timeout: 3000});
    // await this.page.pause();
  }
};


// resource - https://playwright.dev/docs/api/class-page#page-frame-locator
//            https://playwright.dev/docs/test-assertions