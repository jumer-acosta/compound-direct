// @ts-check
import { test, expect } from '@playwright/test';
import { CompoundDirectPage } from './CompoundDirectPage.js';

//Use let to define variables for changePlanPage and initiativePage at the top of the file.
//Import the page object classes in your test script.
let compoundDirectPage;

test.beforeEach(async ({ page }) => {
  compoundDirectPage = new CompoundDirectPage(page);

  // Navigate to the Compound Direct website
  await compoundDirectPage.navigateCompoundDirectPage(); // Replace with the actual URL of the Compound Direct website');

});

test.only('Cycle through the 6 dosage forms and screenshot each view', async ({ page }) => {
  // Compound Direct iframe
  const iframeElement = page.locator('#compounding-demo iframe');
  const iframe = iframeElement.contentFrame();

  // Take screenshot of the "Capsule" Dosage form
  await test.step('Take screenshot of the "Capsule" Dosage form', async () => {
    await iframe.locator('div').filter({ hasText: /^Capsule$/ }).getByRole('img').click();
    await expect(iframe.getByText('Dosage FormCapsule')).toBeVisible();
    await iframeElement.screenshot({ path: 'screenshots/capsule.png' });
 });
  /*
    // Take screenshot of the "Troche" Dosage form
    await test.step('Take screenshot of the "Troche" Dosage form', async () => {
      await iframe.locator('div').filter({ hasText: /^Try MeTroche$/ }).getByRole('img').click();
      await expect(iframe.getByText('Dosage FormTroche')).toBeVisible();
      await iframeElement.screenshot({ path: 'screenshots/troche.png' });
    });
  
    // Take screenshot of the "Oral Liquid" Dosage form
    await test.step('Take screenshot of the "Oral Liquid" Dosage form', async () => {
      await iframe.locator('div').filter({ hasText: /^Oral Liquid$/ }).getByRole('img').click();
      await expect(iframe.getByText('Dosage FormOral')).toBeVisible();
      await iframeElement.screenshot({ path: 'screenshots/oral-liquid.png' });
    });
  
    // Take screenshot of the "Cream" Dosage form
    await test.step('Take screenshot of the "Cream" Dosage form', async () => {
      await iframe.locator('div').filter({ hasText: /^Cream$/ }).getByRole('img').click();
      await expect(iframe.getByText('Dosage FormCream')).toBeVisible();
      await iframeElement.screenshot({ path: 'screenshots/cream.png' });
    });
  
    // Take screenshot of the "Suppository" Dosage form
    await test.step('Take screenshot of the "Suppository" Dosage form', async () => {
      await iframe.locator('div').filter({ hasText: /^Suppository$/ }).getByRole('img').click();
      await expect(iframe.getByText('Dosage FormSuppository')).toBeVisible();
      await iframeElement.screenshot({ path: 'screenshots/suppository.png' });
    });
  
    // Take screenshot of the "Powder" Dosage form
    await test.step('Take screenshot of the "Powder" Dosage form', async () => {
      await iframe.locator('div').filter({ hasText: /^Powder$/ }).getByRole('img').click();
      await expect(iframe.getByText('Dosage FormPowder')).toBeVisible();
      await iframeElement.screenshot({ path: 'screenshots/powder.png' });
    });
    */
});

test('On "Cream" Dosage Form*', async ({ page }) => {
  // Compound Direct iframe
  const iframeElement = page.locator('#compounding-demo iframe');
  const iframe = iframeElement.contentFrame();

  // Click on "Cream" Dosage form
  await test.step('Click on "Cream" Dosage form', async () => {
    await iframe.locator('div').filter({ hasText: /^Cream$/ }).getByRole('img').click();
    await expect(iframe.getByText('Dosage FormCream')).toBeVisible();
  });

  // Verify initial ingredients 
  await test.step('Verify initial ingredients', async () => {
    await expect(iframe.locator('#root')).toContainText('SALICYLIC ACID , USPActive');
    await expect(iframe.locator('#root')).toContainText('PROPYLENE GLYCOLExcipient');
    await expect(iframe.locator('#root')).toContainText('SORBOLENE CREAMBase');
  });

  // Verify behaviour when expiry days, final units and wastage percentage initial values are multiplied by 2.
  //** Define the fields to test*/ 
  await test.step('Verify behaviour when expiry days, final units and wastage percentage initial values are multiplied by 2', async () => {
    const fields = [ //this fields array. I will use the for..of loop to iterate to each object
      { label: 'Expiry Days', locator: iframe.locator('div').filter({ hasText: /^Dosage FormCreamExpiry Days$/ }).getByRole('spinbutton') },
      { label: 'Final Units', locator: iframe.getByRole('spinbutton').nth(2) },
      { label: 'Wastage Percentage', locator: iframe.getByPlaceholder('e.g.') },
    ];

    for (const field of fields) {
      //** Get the current value of the field*/ 
      const fieldElement = field.locator;
      const currentValue = await fieldElement.inputValue(); // Get the value as a string
      const newValue = parseFloat(currentValue) * 2; // Multiply the value by 2

      //** Set the new value*/ 
      await fieldElement.fill(newValue.toString());

      //** Verify the new value is set correctly*/ 
      const updatedValue = await fieldElement.inputValue();
      console.log(`${field.label}: Original Value = ${currentValue}, New Value = ${updatedValue}`);
      expect(updatedValue).toBe(newValue.toString()); // Check if the value is updated correctly
    }
  });

  // Verify Melatonin (2% Strength) ingredient is added
  await test.step('Verify behaviour when Melatonin (2% Strength) ingredient is added', async () => {
    await iframe.getByText('search', { exact: true }).click();
    await iframe.locator('#react-select-14-input').fill('Melatonin');
    await iframe.getByText('MELATONIN', { exact: true }).click();
    await iframe.locator('form').filter({ hasText: 'reorderMELATONINActive%' }).getByPlaceholder('Strength').click();
    await iframe.locator('form').filter({ hasText: 'reorderMELATONINActive%' }).getByPlaceholder('Strength').fill('2');

    await expect(iframe.locator('#root')).toContainText('MELATONINActive');// Verify the Melatonin ingredient is added
    await expect(iframe.locator('form').filter({ hasText: 'reorderMELATONINActive%2%' }).getByPlaceholder('Strength')).toHaveValue('2'); // Verify the strength value is 2%
    await expect(iframe.getByText('2%', { exact: true })).toBeVisible(); // verify the percentage exact value is 2%
    await expect(iframe.locator('#root')).toContainText('SALICYLIC ACID 12%, MELATONIN 2% TOPICAL CREAM'); // Verify the Compound Name is updated to include Melatonin 2%

    await iframe.getByText('info').nth(3).hover();
    await expect(iframe.locator('body')).toContainText('MELATONINActive');
    await expect(iframe.locator('body')).toContainText('Percent(2.004%) = Strength(2% — 20mg) / 10 x Adjustment Factor(1.002)');
    await expect(iframe.locator('body')).toContainText('Quantity(4.208g) = Strength(2% — 20mg) / milligram ➞ gram (1000) x Adjustment Factor(1.002) x (Final Units(200) + Wastage(10))');
    await iframeElement.screenshot({ path: 'screenshots/cream/cream-melatonin-info.png' });
  });

  // Base type ingredients will dynamically change percentage to complete the 100%, verify this behaviour as well
  await test.step('Base type ingredients will dynamically change percentage to complete the 100%, verify this behaviour as well', async () => {
    await iframe.locator('form').filter({ hasText: 'reorderSALICYLIC ACID ,' }).getByPlaceholder('Strength').click();
    await iframe.locator('form').filter({ hasText: 'reorderSALICYLIC ACID ,' }).getByPlaceholder('Strength').fill('0');
    await iframe.locator('div').filter({ hasText: /^%$/ }).nth(3).click();
    await iframe.getByPlaceholder('Percentage').fill('0');
    await iframe.locator('form').filter({ hasText: 'reorderMELATONINActive%' }).getByPlaceholder('Strength').click();
    await iframe.locator('form').filter({ hasText: 'reorderMELATONINActive%' }).getByPlaceholder('Strength').fill('0');

    await expect(iframe.getByText('100%')).toBeVisible();
    await expect(iframe.locator('#root')).toContainText('SALICYLIC ACID 0%, MELATONIN 0% TOPICAL CREAM');

    await iframe.getByText('info').nth(2).hover();
    await expect(iframe.locator('body')).toContainText('SORBOLENE CREAMBase');
    await expect(iframe.locator('body')).toContainText('Percent(100%) = 100% - Total Percent of Active(0%) - Total Percent of Excipient(0%)');
    await expect(iframe.locator('body')).toContainText('Quantity(210g) = (Final Units(200) + Wastage(10)) - Total Weight of Active & Excipient(0g)');
    await iframeElement.screenshot({ path: 'screenshots/cream/cream-sobrolene-base-info.png' });
  });


  // Verify behaviour when Melatonin’s more_vert icon is clicked and ‘use as excipient’ option is clicked
  await test.step('Verify behaviour when Melatonin’s more_vert icon is clicked and ‘use as excipient’ option is clicked', async () => {
    await iframe.getByText('more_vert').nth(3).click();
    await iframe.getByText('Use as Excipient').click();
    await iframe.getByText('more_vert').nth(3).click();
    await expect(iframe.locator('#root')).toContainText('MELATONINExcipient');
  });

  // Verify behaviour when Melatonin’s more_vert icon is clicked and ‘remove’ option is clicked
  await test.step('Verify behaviour when Melatonin’s more_vert icon is clicked and ‘remove’ option is clicked', async () => {
    await iframe.getByText('more_vert').nth(3).click();
    await iframe.getByText('Remove').click();
    await expect(iframe.locator('form').filter({ hasText: 'reorderMELATONINExcipient%' }).getByRole('button')).toBeHidden();
  });

  // Bonus: Verify behaviour when ingredient’s order is reversed
  await test.step('Verify behaviour when ingredient’s order is reversed', async () => {
    await page.reload();

    await iframe.locator('div').filter({ hasText: /^Cream$/ }).getByRole('img').click();   // Click on "Cream" Dosage form
    await expect(iframe.getByText('Dosage FormCream')).toBeVisible();

    await expect(iframe.locator('#root')).toContainText('SALICYLIC ACID , USPActive');   // Verify 'SALICYLIC ACID' initial ingredients
    await expect(iframe.getByPlaceholder('Strength')).toHaveValue('12');
    await expect(iframe.getByRole('paragraph')).toContainText('12%');
    await iframe.getByText('info').first().hover();
    await expect(iframe.locator('body')).toContainText('SALICYLIC ACID , USPActive');
    await expect(iframe.locator('body')).toContainText('Percent(12%) = Strength(12% — 120mg) / 10 x Adjustment Factor(1)');
    await expect(iframe.locator('body')).toContainText('Quantity(12.3g) = Strength(12% — 120mg) / milligram ➞ gram (1000) x Adjustment Factor(1) x (Final Units(100) + Wastage(2.5))');

    await iframe.locator('form').filter({ hasText: 'reorderPROPYLENE' }).getByRole('button').click();
    await expect(iframe.locator('#root')).toContainText('PROPYLENE GLYCOLExcipient'); // Verify 'PROPYLENE GLYCOL' initial ingredients
    await expect(iframe.getByPlaceholder('Percentage')).toHaveValue('10');
    await iframe.getByText('info').nth(1).hover();
    await expect(iframe.locator('body')).toContainText('PROPYLENE GLYCOLExcipient');
    await expect(iframe.locator('body')).toContainText('Quantity(10.25g — 10.02mL) = (Final Units(100) + Wastage(2.5)) x Percentage(10%) / 100');
    await expect(iframe.locator('body')).toContainText('Liquid Volume(10.02mL) = Quantity(10.25g) / Liquid Density(1.023g/mL)');

    await iframe.locator('form').filter({ hasText: 'reorderSORBOLENE CREAMBase78%' }).getByRole('button').click();
    await expect(iframe.locator('#root')).toContainText('SORBOLENE CREAMBase'); // Verify 'SORBOLENE CREAM' initial ingredients
    await expect(iframe.locator('#root')).toContainText('78%');
    await iframe.getByText('info').nth(2).hover();
    await expect(iframe.locator('body')).toContainText('SORBOLENE CREAMBase');
    await expect(iframe.locator('body')).toContainText('Percent(78%) = 100% - Total Percent of Active(12%) - Total Percent of Excipient(10%)');
    await expect(iframe.locator('body')).toContainText('Quantity(79.95g) = (Final Units(100) + Wastage(2.5)) - Total Weight of Active & Excipient(22.55g)');
  });
});

test('On the "Capsule" Dosage Form*', async ({ page }) => {
  // Compound Direct iframe
  const iframeElement = page.locator('#compounding-demo iframe');
  const iframe = iframeElement.contentFrame();

  // Click on "Capsule" Dosage form
  await test.step('Click on "Capsule" Dosage form', async () => {
    await iframe.locator('div').filter({ hasText: /^Capsule$/ }).getByRole('img').click();
    await expect(iframe.getByText('Dosage FormCapsule')).toBeVisible();
  });

  // Verify initial ingredients
  await test.step('Verify initial ingredients', async () => {
    await expect(iframe.locator('#root')).toContainText('DHEA (DEHYDROEPIANDROSTERONE)Active');
    await expect(iframe.locator('#root')).toContainText('SELENOMETHIONINE-LActive');
    await expect(iframe.locator('#root')).toContainText('VITAMIN D3Active');
    await expect(iframe.locator('#root')).toContainText('ZINC PICOLINATEActive');
    await expect(iframe.locator('#root')).toContainText('MAGNESIUM GLYCINATEActive');
    await expect(iframe.locator('#root')).toContainText('MICROCRYSTALLINE CELLULOSEBase');
  });

  // Verify behaviour when capsule size is changed to #3
  await test.step('Change capsule size to #3', async () => {
    await iframe.locator('div').filter({ hasText: /^Dosage FormCapsuleCapsule Size#1Expiry Days$/ }).locator('svg').nth(1).click();
    await iframe.getByText('#3').click();
  });

  // Verify DHEA ingredient
  await test.step('Verify DHEA Ingredient', async () => {
    await expect(iframe.locator('#root')).toContainText('19.74%');
    await iframe.locator('form').filter({ hasText: 'reorderDHEA (' }).locator('i').nth(1).hover();
    await expect(iframe.locator('body')).toContainText('DHEA (DEHYDROEPIANDROSTERONE)Active');
    await expect(iframe.locator('body')).toContainText('Percent(19.737%) = Strength(30mg) x Adjustment Factor(1) / Pack Stat(152) x 100');
    await expect(iframe.locator('body')).toContainText('Quantity(3g) = Strength(30mg) / milligram ➞ gram (1000) x Adjustment Factor(1) x (Final Units(100) + Wastage(0))');
  });

  // Verify the SELENOMETHIONINE-L ingredient
  await test.step('Verify SELENOMETHIONINE-L Ingredient', async () => {
    await expect(iframe.locator('#root')).toContainText('5.17%');
    await iframe.locator('form').filter({ hasText: 'reorderSELENOMETHIONINE-' }).locator('i').nth(1).hover();
    await expect(iframe.locator('body')).toContainText('SELENOMETHIONINE-LActive');
    await expect(iframe.locator('body')).toContainText('Percent(5.173%) = Strength(100mcg) / milligram ➞ microgram (1000) x Adjustment Factor(185.2) / Pack Stat(358) x 100');
    await expect(iframe.locator('body')).toContainText('Quantity(1.852g) = Strength(100mcg) / microgram ➞ gram (1000,000) x Adjustment Factor(185.2) x (Final Units(100) + Wastage(0))');
  });

  // Verify the VITAMIN D3 ingredient
  await test.step('Verify VITAMIN D3 Ingredient', async () => {
    await expect(iframe.locator('#root')).toContainText('6.94%');
    await iframe.locator('form').filter({ hasText: 'reorderVITAMIN D3ActiveIU6.94' }).locator('i').nth(1).hover();
    await expect(iframe.locator('body')).toContainText('VITAMIN D3Active');
    await expect(iframe.locator('body')).toContainText('Percent(6.94%) = Strength(2000IU) x Adjustment Factor(0.00811952) / Pack Stat(234) x 100');
    await expect(iframe.locator('body')).toContainText('Quantity(1.624g) = Strength(2000IU) / milligram ➞ gram (1000) x Adjustment Factor(0.00811952) x (Final Units(100) + Wastage(0))');
  });

  // Verify the ZINC PICOLINATE ingredient
  await test.step('Verify ZINC PICOLINATE Ingredient', async () => {
    await expect(iframe.locator('#root')).toContainText('15.22%');
    await iframe.locator('form').filter({ hasText: 'reorderZINC' }).locator('i').nth(1).hover();
    await expect(iframe.locator('body')).toContainText('ZINC PICOLINATEActive');
    await expect(iframe.locator('body')).toContainText('Percent(15.215%) = Strength(10mg) x Adjustment Factor(4.3668) / Pack Stat(287) x 100');
    await expect(iframe.locator('body')).toContainText('Quantity(4.367g) = Strength(10mg) / milligram ➞ gram (1000) x Adjustment Factor(4.3668) x (Final Units(100) + Wastage(0))');
  });

  // Verify the MAGNESIUM GLYCINATE ingredient
  await test.step('Verify MAGNESIUM GLYCINATE Ingredient', async () => {
    await expect(iframe.locator('#root')).toContainText('66.55%');
    await iframe.locator('form').filter({ hasText: 'reorderMAGNESIUM' }).locator('i').nth(1).hover();
    await expect(iframe.locator('body')).toContainText('MAGNESIUM GLYCINATEActive');
    await expect(iframe.locator('body')).toContainText('Percent(66.552%) = Strength(50mg) x Adjustment Factor(4.2194) / Pack Stat(317) x 100');
    await expect(iframe.locator('body')).toContainText('Quantity(21.097g) = Strength(50mg) / milligram ➞ gram (1000) x Adjustment Factor(4.2194) x (Final Units(100) + Wastage(0))');
  });

  //  Verify the MICROCRYSTALLINE CELLULOSE ingredient
  await test.step('Verify MICROCRYSTALLINE CELLULOSE Ingredient', async () => {
    await expect(iframe.locator('#root')).toContainText('0%');
    await iframe.locator('form').filter({ hasText: 'reorderMICROCRYSTALLINE' }).locator('i').nth(1).hover();
    await expect(iframe.locator('body')).toContainText('MICROCRYSTALLINE CELLULOSEBase');
    await expect(iframe.locator('body')).toContainText('Percent(0%) = 100% - Total Percent of Active(113.617%) - Total Percent of Excipient(0%)');
    await expect(iframe.locator('body')).toContainText('Quantity(0g) = (100% - Total Percent of Active & Excipient(113.617%)) / 100 x Pack Stat(131) x (Final Units(100) + Wastage(0)) / 1000');
  });

  // Verify Warning message when total ingredient percentage is over 100%
  await test.step('Verify Warning message when total ingredient percentage is over 100%', async () => {
    await expect(iframe.locator('div').filter({ hasText: 'warningTotal ingredient' }).nth(2)).toBeVisible();
  });

});

test('Redirect to Pricing page and verify the behaviour', async ({ page }) => {

  // Click on the "Pricing" link
  await test.step('Click on the "Pricing" link', async () => {
    await page.getByRole('navigation').getByRole('link', { name: 'Pricing' }).click();
  });

  // Verify the Pricing page header
  await test.step('Verify the Pricing page header', async () => {
    await expect(page.getByRole('heading', { name: 'Pay as you grow. Switch at' })).toBeVisible();
  });

  // Verify the Pricing page main paragraph text
  await test.step('Verify the Pricing page main paragraph text', async () => {
    await expect(page.getByRole('main')).toContainText('No matter where you are at - our pricing is simple, transparent and adapts to the size of your company.');
  });

  // Verify the Pricing page Basic plan 329
  await test.step('Verify the Pricing page Basic plan 329', async () => {
    await expect(page.getByText('Basic$329/monthFor small compounders that only need the basics1 balanceUp to 5')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Book a Demo' }).nth(1)).toBeVisible();
  });

  //Verify the Pricing page Standard plan 599
  await test.step('Verify the Pricing page Standard plan 599', async () => {
    await expect(page.getByText('Standard$599/monthAdvanced compounding with dispensingUp to 2 balancesUp to 10')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Book a Demo' }).nth(2)).toBeVisible();
  });

  // Verify the Pricing page Premium plan
  await test.step('Verify the Pricing page Premium plan', async () => {
    await expect(page.getByText('PremiumContact SalesFor compounders that need flexibilityUp to 4 balancesUp to')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact Sales' }).first()).toBeVisible();
  });

  // Verify the Pricing page Enterprise plan
  await test.step('Verify the Pricing page Enterprise plan', async () => {
    await expect(page.getByText('EnterpriseContact SalesFor compounders who have complex business needsUp to 20')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact Sales' }).nth(1)).toBeVisible();
  });
});