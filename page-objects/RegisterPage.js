export class RegisterPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator('[placeholder="E-Mail"]');
    this.passWordInput = page.locator('[placeholder="Password"]');
    this.registerButton = page.getByRole("button", { name: "register" });
  }

  signUpAsNewUser = async (email, password) => {
    await this.emailInput.waitFor();
    await this.emailInput.fill(email);
    await this.passWordInput.waitFor();
    await this.passWordInput.fill(password);
    await this.registerButton.waitFor();
    await this.registerButton.click();

    // await this.page.pause();
  };
}

// reference: https://www.uuidgenerator.net/
// https://www.npmjs.com/
