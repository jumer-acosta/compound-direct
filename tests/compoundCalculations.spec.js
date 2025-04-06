// @ts-check
import { test, expect } from '@playwright/test';
import { CompoundDirectPage } from '../pages/CompoundDirectPage.js';

//Use let to define variables for changePlanPage and initiativePage at the top of the file.
//Import the page object classes in your test script.
let compoundDirectPage;

test.beforeEach(async ({ page }) => {
  compoundDirectPage = new CompoundDirectPage(page);
  // Navigate to the Compound Direct website
  await compoundDirectPage.navigateCompoundDirectPage(); // Replace with the actual URL of the Compound Direct website');
});

test('Cycle through the 6 dosage forms and screenshot each view', async ({ page }) => {
  // Take screenshot of the "Capsule" Dosage form
  await test.step('Take screenshot of the "Capsule" Dosage form', async () => {
    await compoundDirectPage.navDosageForm(/^Capsule$/);
    await compoundDirectPage.assertDosageForm('Dosage FormCapsule');
    await compoundDirectPage.dosageFormScreenshot('screenshots/capsule.png');
  });

  // Take screenshot of the "Troche" Dosage form
  await test.step('Take screenshot of the "Troche" Dosage form', async () => {
    await compoundDirectPage.navDosageForm(/^Try MeTroche$/);
    await compoundDirectPage.assertDosageForm('Dosage FormTroche');
    await compoundDirectPage.dosageFormScreenshot('screenshots/troche.png');
  });

  // Take screenshot of the "Oral Liquid" Dosage form
  await test.step('Take screenshot of the "Oral Liquid" Dosage form', async () => {
    await compoundDirectPage.navDosageForm(/^Oral Liquid$/);
    await compoundDirectPage.assertDosageForm('Dosage FormOral');
    await compoundDirectPage.dosageFormScreenshot('screenshots/oral-liquid.png');
  });

  // Take screenshot of the "Cream" Dosage form
  await test.step('Take screenshot of the "Cream" Dosage form', async () => {
    await compoundDirectPage.navDosageForm(/^Cream$/);
    await compoundDirectPage.assertDosageForm('Dosage FormCream');
    await compoundDirectPage.dosageFormScreenshot('screenshots/cream.png');
  });

  // Take screenshot of the "Suppository" Dosage form
  await test.step('Take screenshot of the "Suppository" Dosage form', async () => {
    await compoundDirectPage.navDosageForm(/^Suppository$/);
    await compoundDirectPage.assertDosageForm('Dosage FormSuppository');
    await compoundDirectPage.dosageFormScreenshot('screenshots/suppository.png');
  });

  // Take screenshot of the "Powder" Dosage form
  await test.step('Take screenshot of the "Powder" Dosage form', async () => {
    await compoundDirectPage.navDosageForm(/^Powder$/);
    await compoundDirectPage.assertDosageForm('Dosage FormPowder');
    await compoundDirectPage.dosageFormScreenshot('screenshots/powder.png');
  });
});

test('On "Cream" Dosage Form*', async ({ page }) => {
  // Click on "Cream" Dosage form
  await test.step('Click on "Cream" Dosage form', async () => {
    await compoundDirectPage.navDosageForm(/^Cream$/);
    await compoundDirectPage.assertDosageForm('Dosage FormCream');
  });

  // Verify initial ingredients 
  await test.step('Verify Cream initial ingredients', async () => {
    await compoundDirectPage.assertInitialIngredient('SALICYLIC ACID , USPActive');
    await compoundDirectPage.assertInitialIngredient('PROPYLENE GLYCOLExcipient');
    await compoundDirectPage.assertInitialIngredient('SORBOLENE CREAMBase');
  });

  // Verify behaviour when expiry days, final units and wastage percentage initial values are multiplied by 2.
  await test.step('Verify behaviour when expiry days, final units and wastage percentage initial values are multiplied by 2', async () => {
    await compoundDirectPage.verifyAndUpdateFieldValues(/^Dosage FormCreamExpiry Days$/, 2); // expiry days field, multiplier
  });

  // Verify Melatonin (2% Strength) ingredient is added
  await test.step('Verify behaviour when Melatonin (2% Strength) ingredient is added', async () => {
    await compoundDirectPage.searchCLickIngredient('search'); // Click on the search icon
    await compoundDirectPage.fillSearchField('Melatonin'); // Fill the search field with 'Melatonin'
    await compoundDirectPage.searchCLickIngredient('MELATONIN'); // Click on the Melatonin ingredient
    await compoundDirectPage.clickFillStrength('reorderMELATONINActive%', '2'); // Fill the strength field with '2'

    await compoundDirectPage.assertAddedIngredient('MELATONINActive');// Verify the Melatonin ingredient is added
    await compoundDirectPage.assertStrengthVal('2') // Verify the strength value is 2%
    await compoundDirectPage.assertPercentage('2%') // verify the percentage exact value is 2%
    await compoundDirectPage.assertAddedIngredient('SALICYLIC ACID 12%, MELATONIN 2% TOPICAL CREAM'); // Verify the Compound Name is updated to include Melatonin 2%

    await compoundDirectPage.hoverInfoicon(3); // Hover over the info icon for Melatonin
    await compoundDirectPage.assertInfoDetails('MELATONINActive');
    await compoundDirectPage.assertInfoDetails('Percent(2.004%) = Strength(2% — 20mg) / 10 x Adjustment Factor(1.002)');
    await compoundDirectPage.assertInfoDetails('Quantity(4.208g) = Strength(2% — 20mg) / milligram ➞ gram (1000) x Adjustment Factor(1.002) x (Final Units(200) + Wastage(10))');
    await compoundDirectPage.dosageFormScreenshot('screenshots/cream/cream-melatonin-info.png');
  });

  // Base type ingredients will dynamically change percentage to complete the 100%, verify this behaviour as well
  await test.step('Base type ingredients will dynamically change percentage to complete the 100%, verify this behaviour as well', async () => {
    await compoundDirectPage.clickFillStrength('reorderSALICYLIC ACID ,', '0'); // Fill the strength field with '0'
    await compoundDirectPage.clickPercentageField(/^%$/); // Click on the Propylene Glycol percentage field
    await compoundDirectPage.fillPercentageField('0'); // Fill the Propylene Glycol percentage field with '0'
    await compoundDirectPage.clickFillStrength('reorderMELATONINActive%', '0'); // Click & Fill the strength field with '0'

    await compoundDirectPage.assertDosageForm('100%'); // Verify the total percentage is 100%
    await compoundDirectPage.assertAddedIngredient('SALICYLIC ACID 0%, MELATONIN 0% TOPICAL CREAM');

    await compoundDirectPage.hoverInfoicon(2); // Hover over the info icon for Sorbolene Cream
    await compoundDirectPage.assertInfoDetails('SORBOLENE CREAMBase');
    await compoundDirectPage.assertInfoDetails('Percent(100%) = 100% - Total Percent of Active(0%) - Total Percent of Excipient(0%)');
    await compoundDirectPage.assertInfoDetails('Quantity(210g) = (Final Units(200) + Wastage(10)) - Total Weight of Active & Excipient(0g)');
    await compoundDirectPage.dosageFormScreenshot('screenshots/cream/cream-sobrolene-base-info.png');
  });

  // Verify behaviour when Melatonin’s more_vert icon is clicked and ‘use as excipient’ option is clicked
  await test.step('Verify behaviour when Melatonin’s more_vert icon is clicked and ‘use as excipient’ option is clicked', async () => {
    await compoundDirectPage.clickMoreVertIcon(); // Click on the more_vert icon for Melatonin
    await compoundDirectPage.clickMoreOptions('Use as Excipient'); // Click on the More Options button
    await compoundDirectPage.clickMoreVertIcon(); // Click on the more_vert icon for Melatonin
    await compoundDirectPage.assertAddedIngredient('MELATONINExcipient'); // Verify the Melatonin ingredient is now an excipient
  });

  // Verify behaviour when Melatonin’s more_vert icon is clicked and ‘remove’ option is clicked
  await test.step('Verify behaviour when Melatonin’s more_vert icon is clicked and ‘remove’ option is clicked', async () => {
    await compoundDirectPage.clickMoreVertIcon(); // Click on the more_vert icon for Melatonin
    await compoundDirectPage.clickMoreOptions('Remove'); // Click on the More Options button
    await compoundDirectPage.assertRemovedIngredient('reorderMELATONINExcipient%'); // Verify the Melatonin ingredient is removed
  });

  // Bonus: Verify behaviour when ingredient’s order is reversed
  await test.step('Verify behaviour when ingredient’s order is reversed', async () => {
    await page.reload();

    await compoundDirectPage.navDosageForm(/^Cream$/); // Click on "Cream" Dosage form
    await compoundDirectPage.assertDosageForm('Dosage FormCream'); // Verify the Cream dosage form is selected

    // Verify the initial Salicylic Acid ingredient is added
    await compoundDirectPage.assertInitialIngredient('SALICYLIC ACID , USPActive'); // Verify the initial ingredients
    await compoundDirectPage.assertStrengthPercentageValue('Strength', '12'); // Verify the strength value is 12%
    await compoundDirectPage.assertPercentageValue2('12%'); // Verify the percentage value is 12%
    await compoundDirectPage.hoverInfoFirstIcon(); // Hover over the info icon for Salicylic Acid
    await compoundDirectPage.assertInfoDetails('SALICYLIC ACID , USPActive'); // Verify the info details for Salicylic Acid
    await compoundDirectPage.assertInfoDetails('Percent(12%) = Strength(12% — 120mg) / 10 x Adjustment Factor(1)'); // Verify the info details for Salicylic Acid
    await compoundDirectPage.assertInfoDetails('Quantity(12.3g) = Strength(12% — 120mg) / milligram ➞ gram (1000) x Adjustment Factor(1) x (Final Units(100) + Wastage(2.5))'); // Verify the info details for Salicylic Acid

    // Verify the initial Propylene Glycol ingredient is added
    await compoundDirectPage.clickReorderIngredient('reorderPROPYLENE'); // Click on the reorder button for Propylene Glycol
    await compoundDirectPage.assertInitialIngredient('PROPYLENE GLYCOLExcipient'); // Verify the Propylene Glycol ingredient is added
    await compoundDirectPage.assertStrengthPercentageValue('Percentage', '10'); // Verify the strength value is 10%
    await compoundDirectPage.hoverInfoicon(1); // Hover over the info icon for Propylene Glycol
    await compoundDirectPage.assertInfoDetails('PROPYLENE GLYCOLExcipient'); // Verify the info details for Propylene Glycol
    await compoundDirectPage.assertInfoDetails('Quantity(10.25g — 10.02mL) = (Final Units(100) + Wastage(2.5)) x Percentage(10%) / 100'); // Verify the info details for Propylene Glycol
    await compoundDirectPage.assertInfoDetails('Liquid Volume(10.02mL) = Quantity(10.25g) / Liquid Density(1.023g/mL)'); // Verify the info details for Propylene Glycol

    // Verify the initial Sorbolene Cream ingredient is added
    await compoundDirectPage.clickReorderIngredient('reorderSORBOLENE CREAMBase78%'); // Click on the reorder button for Sorbolene Cream
    await compoundDirectPage.assertInitialIngredient('SORBOLENE CREAMBase'); // Verify the Sorbolene Cream ingredient is added
    await compoundDirectPage.assertInitialIngredient('78%'); // Verify the percentage value is 78%
    await compoundDirectPage.hoverInfoicon(2); // Hover over the info icon for Sorbolene Cream
    await compoundDirectPage.assertInfoDetails('SORBOLENE CREAMBase'); // Verify the info details for Sorbolene Cream
    await compoundDirectPage.assertInfoDetails('Percent(78%) = 100% - Total Percent of Active(12%) - Total Percent of Excipient(10%)'); // Verify the info details for Sorbolene Cream
    await compoundDirectPage.assertInfoDetails('Quantity(79.95g) = (Final Units(100) + Wastage(2.5)) - Total Weight of Active & Excipient(22.55g)'); // Verify the info details for Sorbolene Cream
  });
});

test('On the "Capsule" Dosage Form*', async ({ page }) => {
  // Click on "Capsule" Dosage form
  await test.step('Click on "Capsule" Dosage form', async () => {
    await compoundDirectPage.navDosageForm(/^Capsule$/);
    await compoundDirectPage.assertDosageForm('Dosage FormCapsule');
  });

  // Verify initial ingredients
  await test.step('Verify initial ingredients', async () => {
    await compoundDirectPage.assertInitialIngredient('DHEA (DEHYDROEPIANDROSTERONE)Active');
    await compoundDirectPage.assertInitialIngredient('SELENOMETHIONINE-LActive');
    await compoundDirectPage.assertInitialIngredient('VITAMIN D3Active');
    await compoundDirectPage.assertInitialIngredient('ZINC PICOLINATEActive');
    await compoundDirectPage.assertInitialIngredient('MAGNESIUM GLYCINATEActive');
    await compoundDirectPage.assertInitialIngredient('MICROCRYSTALLINE CELLULOSEBase');
  });

  // Verify behaviour when capsule size is changed to #3
  await test.step('Change capsule size to #3', async () => {
    await compoundDirectPage.clickCapsuleSizeField(/^Dosage FormCapsuleCapsule Size#1Expiry Days$/); // Click on the capsule size #3
    await compoundDirectPage.clickMoreOptions('#3'); // Click on the capsule size #3
  });

  // Verify DHEA ingredient
  await test.step('Verify DHEA Ingredient', async () => {
    await compoundDirectPage.assertInitialIngredient('19.74%'); // Verify the DHEA ingredient percentage
    await compoundDirectPage.hoverInfoIcon2('reorderDHEA ('); // Hover over the info icon for DHEA
    await compoundDirectPage.assertInfoDetails('DHEA (DEHYDROEPIANDROSTERONE)Active'); // Verify the info details for DHEA
    await compoundDirectPage.assertInfoDetails('Percent(19.737%) = Strength(30mg) x Adjustment Factor(1) / Pack Stat(152) x 100'); // Verify the info details for DHEA
    await compoundDirectPage.assertInfoDetails('Quantity(3g) = Strength(30mg) / milligram ➞ gram (1000) x Adjustment Factor(1) x (Final Units(100) + Wastage(0))'); // Verify the info details for DHEA
  });

  // Verify the SELENOMETHIONINE-L ingredient
  await test.step('Verify SELENOMETHIONINE-L Ingredient', async () => {
    await compoundDirectPage.assertInitialIngredient('5.17%'); // Verify the SELENOMETHIONINE-L ingredient percentage
    await compoundDirectPage.hoverInfoIcon2('reorderSELENOMETHIONINE-'); // Hover over the info icon for SELENOMETHIONINE-L
    await compoundDirectPage.assertInfoDetails('SELENOMETHIONINE-LActive'); // Verify the info details for SELENOMETHIONINE-L
    await compoundDirectPage.assertInfoDetails('Percent(5.173%) = Strength(100mcg) / milligram ➞ microgram (1000) x Adjustment Factor(185.2) / Pack Stat(358) x 100'); // Verify the info details for SELENOMETHIONINE-L
    await compoundDirectPage.assertInfoDetails('Quantity(1.852g) = Strength(100mcg) / microgram ➞ gram (1000,000) x Adjustment Factor(185.2) x (Final Units(100) + Wastage(0))'); // Verify the info details for SELENOMETHIONINE-L
  });

  // Verify the VITAMIN D3 ingredient
  await test.step('Verify VITAMIN D3 Ingredient', async () => {
    await compoundDirectPage.assertInitialIngredient('6.94%'); // Verify the VITAMIN D3 ingredient percentage
    await compoundDirectPage.hoverInfoIcon2('reorderVITAMIN D3ActiveIU6.94'); // Hover over the info icon for VITAMIN D3
    await compoundDirectPage.assertInfoDetails('VITAMIN D3Active'); // Verify the info details for VITAMIN D3   
    await compoundDirectPage.assertInfoDetails('Percent(6.94%) = Strength(2000IU) x Adjustment Factor(0.00811952) / Pack Stat(234) x 100'); // Verify the info details for VITAMIN D3
    await compoundDirectPage.assertInfoDetails('Quantity(1.624g) = Strength(2000IU) / milligram ➞ gram (1000) x Adjustment Factor(0.00811952) x (Final Units(100) + Wastage(0))'); // Verify the info details for VITAMIN D3
  });

  // Verify the ZINC PICOLINATE ingredient
  await test.step('Verify ZINC PICOLINATE Ingredient', async () => {
    await compoundDirectPage.assertInitialIngredient('15.22%'); // Verify the ZINC PICOLINATE ingredient percentage
    await compoundDirectPage.hoverInfoIcon2('reorderZINC'); // Hover over the info icon for ZINC PICOLINATE
    await compoundDirectPage.assertInfoDetails('ZINC PICOLINATEActive'); // Verify the info details for ZINC PICOLINATE
    await compoundDirectPage.assertInfoDetails('Percent(15.215%) = Strength(10mg) x Adjustment Factor(4.3668) / Pack Stat(287) x 100'); // Verify the info details for ZINC PICOLINATE
    await compoundDirectPage.assertInfoDetails('Quantity(4.367g) = Strength(10mg) / milligram ➞ gram (1000) x Adjustment Factor(4.3668) x (Final Units(100) + Wastage(0))'); // Verify the info details for ZINC PICOLINATE
  });

  // Verify the MAGNESIUM GLYCINATE ingredient
  await test.step('Verify MAGNESIUM GLYCINATE Ingredient', async () => {
    await compoundDirectPage.assertInitialIngredient('66.55%'); // Verify the MAGNESIUM GLYCINATE ingredient percentage
    await compoundDirectPage.hoverInfoIcon2('reorderMAGNESIUM'); // Hover over the info icon for MAGNESIUM GLYCINATE 
    await compoundDirectPage.assertInfoDetails('MAGNESIUM GLYCINATEActive'); // Verify the info details for MAGNESIUM GLYCINATE
    await compoundDirectPage.assertInfoDetails('Percent(66.552%) = Strength(50mg) x Adjustment Factor(4.2194) / Pack Stat(317) x 100'); // Verify the info details for MAGNESIUM GLYCINATE
    await compoundDirectPage.assertInfoDetails('Quantity(21.097g) = Strength(50mg) / milligram ➞ gram (1000) x Adjustment Factor(4.2194) x (Final Units(100) + Wastage(0))'); // Verify the info details for MAGNESIUM GLYCINATE
  });

  //  Verify the MICROCRYSTALLINE CELLULOSE ingredient
  await test.step('Verify MICROCRYSTALLINE CELLULOSE Ingredient', async () => {
    await compoundDirectPage.assertInitialIngredient('0%'); // Verify the MICROCRYSTALLINE CELLULOSE ingredient percentage
    await compoundDirectPage.hoverInfoIcon2('reorderMICROCRYSTALLINE'); // Hover over the info icon for MICROCRYSTALLINE CELLULOSE
    await compoundDirectPage.assertInfoDetails('MICROCRYSTALLINE CELLULOSEBase'); // Verify the info details for MICROCRYSTALLINE CELLULOSE
    await compoundDirectPage.assertInfoDetails('Percent(0%) = 100% - Total Percent of Active(113.617%) - Total Percent of Excipient(0%)'); // Verify the info details for MICROCRYSTALLINE CELLULOSE
    await compoundDirectPage.assertInfoDetails('Quantity(0g) = (100% - Total Percent of Active & Excipient(113.617%)) / 100 x Pack Stat(131) x (Final Units(100) + Wastage(0)) / 1000'); // Verify the info details for MICROCRYSTALLINE CELLULOSE
  });

  // Verify Warning message when total ingredient percentage is over 100%
  await test.step('Verify Warning message when total ingredient percentage is over 100%', async () => {
    await compoundDirectPage.assertWarningMessage('warningTotal ingredient'); // Verify the warning message
  });
});

test.afterEach(async ({ page }) => {
  // Close the browser after each test
  await page.close();
});