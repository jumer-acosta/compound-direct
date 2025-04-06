import { expect } from '@playwright/test';

export class CompoundDirectPage {
  constructor(page) {
    this.page = page;
    this.iframeElement = page.locator('#compounding-demo iframe');
    this.iframe = this.iframeElement.contentFrame();
  };

  // Method to get the iframe
  async getIframe() {
    const iframe = await this.iframeElement.contentFrame();
    if (!iframe) {
      throw new Error('Compounding iframe not found');
    }
    return iframe;
  }

  // Method actions
  async navigateCompoundDirectPage() {
    await this.page.goto('https://compound.direct');
  };

  async dosageFormScreenshot(screenshotPath) {
    await this.iframeElement.screenshot({ path: screenshotPath });
  };

  async navDosageForm(dosage) {
    const iframe = await this.getIframe(); // Get the iframe
    const iDosageForm = iframe.locator('div').filter({ hasText: dosage }).getByRole('img');
    await iDosageForm.click();
    // await iframe.locator('div').filter({ hasText: /^Capsule$/ }).getByRole('img').click();
  };

  async searchCLickIngredient(search) {
    const iframe = await this.getIframe(); // Get the iframe
    const iSearchIngredient = iframe.getByText(search, { exact: true });
    await iSearchIngredient.click();
  };

  async fillSearchField(ingredient) {
    const iframe = await this.getIframe(); // Get the iframe
    const iSearchField = iframe.locator('#react-select-14-input'); // Use the locator to find the search field
    await iSearchField.fill(ingredient);
  };

  async fillPercentageField(percentage) {
    const iframe = await this.getIframe(); // Get the iframe
    const iPercentageField = iframe.getByPlaceholder('Percentage'); // Use the locator to find the percentage field
    await iPercentageField.fill(percentage);
  };

  async clickFillStrength(ingredient, fillStrength) {
    const iframe = await this.getIframe(); // Get the iframe
    const iFillStrength = iframe.locator('form').filter({ hasText: ingredient }).getByPlaceholder('Strength');
    await iFillStrength.click();
    await iFillStrength.fill(fillStrength);
  };

  async clickPercentageField(fieldPercentage) {
    const iframe = await this.getIframe(); // Get the iframe
    const iPercentage = iframe.locator('div').filter({ hasText: fieldPercentage }).nth(3); // Use the nth() method to select the percentage field
    await iPercentage.click();
  };

  async clickMoreVertIcon() {
    const iframe = await this.getIframe(); // Get the iframe
    const iMoreVertIcon = iframe.getByText('more_vert').nth(3); // Use the nth() method to select the more_vert icon
    await iMoreVertIcon.click();
  };

  async clickMoreOptions(option) {
    const iframe = await this.getIframe(); // Get the iframe
    const iMoreOptions = iframe.getByText(option); // Use the locator to find the more options button
    await iMoreOptions.click();
  };

  async clickReorderIngredient(ingredient) {
    const iframe = await this.getIframe(); // Get the iframe
    const iReorderIngredient = iframe.locator('form').filter({ hasText: ingredient }).getByRole('button'); // Use the locator to find the reorder button
    await iReorderIngredient.click();
  };

  async clickCapsuleSizeField(capsuleSize) {
    const iframe = await this.getIframe(); // Get the iframe
    const iNumberCapsule = iframe.locator('div').filter({ hasText: capsuleSize }).locator('svg').nth(1); // Use the nth() method to select the number capsule
    await iNumberCapsule.click();
  };

  async hoverInfoFirstIcon() {
    const iframe = await this.getIframe(); // Get the iframe
    const iInfoFirstIcon = iframe.getByText('info').first(); // Use the nth() method to select the info icon
    await iInfoFirstIcon.hover();
  };

  async hoverInfoicon(infoIconIndex) {
    const iframe = await this.getIframe(); // Get the iframe
    const iInfoIcon = iframe.getByText('info').nth(infoIconIndex); // Use the nth() method to select the info icon
    await iInfoIcon.hover();
  };

  async hoverInfoIcon2(ingredient) {
    const iframe = await this.getIframe(); // Get the iframe
    const iInfoIcon2 = iframe.locator('form').filter({ hasText: ingredient }).locator('i').nth(1); // Use the nth() method to select the info icon
    await iInfoIcon2.hover();
  };

  // Method to verify and update field values
  async verifyAndUpdateFieldValues(dsgFormExpiryDays, mulValue) {
    const iframe = await this.getIframe(); // Get the iframe
    const fields = [ //this fields array. I will use the for..of loop to iterate to each object
      { label: 'Expiry Days', locator: iframe.locator('div').filter({ hasText: dsgFormExpiryDays }).getByRole('spinbutton') },
      { label: 'Final Units', locator: iframe.getByRole('spinbutton').nth(2) },
      { label: 'Wastage Percentage', locator: iframe.getByPlaceholder('e.g.') },
    ];
    for (const field of fields) {
      //** Get the current value of the field*/
      const fieldElement = field.locator; // Use the locator function to get the field
      const currentValue = await fieldElement.inputValue(); // Get the current value as a string
      const newValue = parseFloat(currentValue) * mulValue; // Multiply the value by 2

      //** Set the new value*/ 
      await fieldElement.fill(newValue.toString());

      //** Verify the new value is set correctly*/ 
      const updatedValue = await fieldElement.inputValue();
      console.log(`${field.label}: Original Value = ${currentValue}, New Value = ${updatedValue}`);
      expect(updatedValue).toBe(newValue.toString()); // Check if the value is updated correctly
    };
  };

  // Method assertions
  async assertDosageForm(dosage) {
    const iframe = await this.getIframe(); // Get the iframe
    const assDosageForm = iframe.getByText(dosage);
    await expect(assDosageForm).toBeVisible();
    // await expect(iframe.getByText('Dosage FormCapsule')).toBeVisible();
  };

  async assertInitialIngredient(ingredient) {
    const iframe = await this.getIframe(); // Get the iframe
    const assInitialIngredient = iframe.locator('#root');
    await expect(assInitialIngredient).toContainText(ingredient)
  };

  async assertAddedIngredient(ingredient) {
    const iframe = await this.getIframe(); // Get the iframe
    const assAddedIngredient = iframe.locator('#root');
    await expect(assAddedIngredient).toContainText(ingredient);
  };

  async assertStrengthVal(valStrength) {
    const iframe = await this.getIframe(); // Get the iframe
    const assFillStrength = iframe.locator('form').filter({ hasText: 'reorderMELATONINActive%2%' }).getByPlaceholder('Strength');
    await expect(assFillStrength).toHaveValue(valStrength);
  };

  async assertPercentage(valPercentage) {
    const iframe = await this.getIframe(); // Get the iframe
    const assertPercentage = iframe.getByText(valPercentage, { exact: true });
    await expect(assertPercentage).toBeVisible();
  };

  async assertInfoDetails(infoDetails) {
    const iframe = await this.getIframe(); // Get the iframe
    const assertInfoDetails = iframe.locator('body');
    await expect(assertInfoDetails).toContainText(infoDetails);
  };

  async assertRemovedIngredient(ingredient) {
    const iframe = await this.getIframe(); // Get the iframe
    const assertRemovedIngredient = iframe.locator('form').filter({ hasText: ingredient }).getByRole('button')
    await expect(assertRemovedIngredient).toBeHidden()
  };

  async assertStrengthPercentageValue(strengthPercentage, valStrengthpercentage) {
    const iframe = await this.getIframe(); // Get the iframe
    const assertStrengthValue = iframe.getByPlaceholder(strengthPercentage);
    await expect(assertStrengthValue).toHaveValue(valStrengthpercentage);
  };

  async assertPercentageValue2(valPercentage) {
    const iframe = await this.getIframe(); // Get the iframe
    const assertPercentageValue = iframe.getByRole('paragraph');
    await expect(assertPercentageValue).toContainText(valPercentage);
  };

  async assertWarningMessage(warningMessage) {
    const iframe = await this.getIframe(); // Get the iframe
    const assertWarningMessage = iframe.locator('div').filter({ hasText: warningMessage }).nth(2); // Use the nth() method to select the warning message
    await expect(assertWarningMessage).toBeVisible();
  }

};

