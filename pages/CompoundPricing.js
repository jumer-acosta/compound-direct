import { expect } from '@playwright/test';

export class CompoundPricingPage {
    constructor(page) {
        this.page = page;
        this.pricePage = page.getByRole('navigation').getByRole('link', { name: 'Pricing' });
        this.pricePageHeader = page.getByRole('heading', { name: 'Pay as you grow. Switch at any time.' });
        this.pricePageMain = page.getByRole('main');
    };


    // Method actions
    async navigateCompoundDirectPage() {
        await this.page.goto('https://compound.direct');
    };

    async clickPricingLink() {
        await this.pricePage.click();
    }

    // Method assertions
    async assertPricingPageHeader() {
        await expect(this.pricePageHeader).toBeVisible();
    };

    async assertPricingPageMain(mainText) {
        await expect(this.pricePageMain).toContainText(mainText);
    };

    async assertPricingPagePlan(plan) {
        this.pricePagePlan = this.page.getByText(plan);
        await expect(this.pricePagePlan).toBeVisible();
    };

    async assertPricingPlanButton(buttonPlan, index) {
        this.pricePageButton = this.page.getByRole('link', { name: buttonPlan }).nth(index);
        await expect(this.pricePageButton).toBeVisible();
    }

    async assertPricingPlanButton2(buttonPlan) {
        this.pricePageButton = this.page.getByRole('link', { name: buttonPlan }).first();
        await expect(this.pricePageButton).toBeVisible();
    }
};
