import { expect, type Locator, type Page } from '@playwright/test';

export class ObjectEdgeHomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  }

  servicesMenuTrigger(): Locator {
    return this.page.getByRole('link', { name: /^services$/i });
  }

  menuButton(): Locator {
    return this.page.getByRole('button', { name: /menu/i });
  }

  mobileServicesLink(): Locator {
    return this.page.getByRole('link', { name: /^services$/i });
  }

  servicesSectionHeading(): Locator {
    return this.page.getByRole('heading', { name: /our services/i }).first();
  }

  servicesNavButton(): Locator {
    return this.page.getByRole('button', { name: /^services$/i });
  }

  private async anyVisible(locator: Locator): Promise<boolean> {
    const count = await locator.count();
    for (let index = 0; index < count; index++) {
      if (await locator.nth(index).isVisible().catch(() => false)) {
        return true;
      }
    }
    return false;
  }

  private async clickFirstVisible(locator: Locator): Promise<boolean> {
    const count = await locator.count();
    for (let index = 0; index < count; index++) {
      const candidate = locator.nth(index);
      if (await candidate.isVisible().catch(() => false)) {
        await candidate.click();
        return true;
      }
    }
    return false;
  }

  async openServicesMenu(): Promise<void> {
    const servicesLinks = this.servicesMenuTrigger();
    if (await this.anyVisible(servicesLinks)) {
      const count = await servicesLinks.count();
      for (let index = 0; index < count; index++) {
        const services = servicesLinks.nth(index);
        if (await services.isVisible().catch(() => false)) {
          await services.hover().catch(() => undefined);
          if (!(await this.isDigitalTransformationVisible())) {
            await services.click();
          }
          return;
        }
      }
      return;
    }

    const menu = this.menuButton();
    if (await this.clickFirstVisible(menu)) {
      const mobileServices = this.mobileServicesLink();
      if (await this.clickFirstVisible(mobileServices)) {
        return;
      }
      if (await this.clickFirstVisible(this.servicesNavButton())) {
        return;
      }
    }

    await expect(this.servicesSectionHeading()).toBeVisible();
  }

  digitalTransformationItem(): Locator {
    return this.page.getByRole('link', { name: /digital transformation/i }).first();
  }

  async isDigitalTransformationVisible(): Promise<boolean> {
    const item = this.digitalTransformationItem();
    return item.isVisible().catch(() => false);
  }

  async isServicesControlVisible(): Promise<boolean> {
    const linkVisible = await this.anyVisible(this.servicesMenuTrigger());
    if (linkVisible) {
      return true;
    }
    return this.anyVisible(this.servicesNavButton());
  }
}
