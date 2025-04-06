// @ts-check
import { test, expect } from '@playwright/test';
import { CompoundDirectPage } from '../pages/CompoundDirectPage.js';
import { CompoundPricingPage } from '../pages/CompoundPricing.js';

//Use let to define variables for changePlanPage and initiativePage at the top of the file.
//Import the page object classes in your test script.
let compoundDirectPage;
let compoundPricingPage;

test.beforeEach(async ({ page }) => {
  compoundDirectPage = new CompoundDirectPage(page);
  compoundPricingPage = new CompoundPricingPage(page);
  // Navigate to the Compound Direct website
  await compoundDirectPage.navigateCompoundDirectPage(); // Replace with the actual URL of the Compound Direct website');
});

test('Redirect to Pricing page and verify the behaviour', async ({ page }) => {
  // Click on the "Pricing" link
  await test.step('Click on the "Pricing" link', async () => {
    await compoundPricingPage.clickPricingLink();
  });

  // Verify the Pricing page header
  await test.step('Verify the Pricing page header', async () => {
    await compoundPricingPage.assertPricingPageHeader();
  });

  // Verify the Pricing page main paragraph text
  await test.step('Verify the Pricing page main paragraph text', async () => {
    await compoundPricingPage.assertPricingPageMain('No matter where you are at - our pricing is simple, transparent and adapts to the size of your company.');
  });

  // Verify the Pricing page Basic plan 329
  await test.step('Verify the Pricing page Basic plan 329', async () => {
    await compoundPricingPage.assertPricingPagePlan('Basic$329/monthFor small compounders that only need the basics1 balanceUp to 5');
    await compoundPricingPage.assertPricingPlanButton('Book a Demo', 1);
  });

  //Verify the Pricing page Standard plan 599
  await test.step('Verify the Pricing page Standard plan 599', async () => {
    await compoundPricingPage.assertPricingPagePlan('Standard$599/monthAdvanced compounding with dispensingUp to 2 balancesUp to 10');
    await compoundPricingPage.assertPricingPlanButton('Book a Demo', 2);
  });

  // Verify the Pricing page Premium plan
  await test.step('Verify the Pricing page Premium plan', async () => {
    await compoundPricingPage.assertPricingPagePlan('PremiumContact SalesFor compounders that need flexibilityUp to 4 balancesUp to');
    await compoundPricingPage.assertPricingPlanButton2('Contact Sales');
  });

  // Verify the Pricing page Enterprise plan
  await test.step('Verify the Pricing page Enterprise plan', async () => {
    await compoundPricingPage.assertPricingPagePlan('EnterpriseContact SalesFor compounders who have complex business needsUp to 20');
    await compoundPricingPage.assertPricingPlanButton('Contact Sales', 1);
  });
});

test.afterEach(async ({ page }) => {
    // Close the browser after each test
    await page.close();
  });