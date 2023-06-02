import { test, expect, Page } from "@playwright/test"
import { __await } from "tslib";


test.describe("Lorsque l'on spécifie deux programmes", () => {
  const urlparam = `?programmes=101,102`;
  test("Les filtres sont pré remplis", async ({ page }) => {
    await _navigate(page, `/${urlparam}`);

    let programmes = page.locator('[data-test-id="programmes-form-field"]')
    let annees = page.locator('[data-test-id="annees-form-field"]')

    await expect(programmes).toContainText('101')
    await expect(programmes).toContainText('Accès au droit et à la justice')
    await expect(programmes).toContainText('102')
    await expect(programmes).toContainText("Accès et retour à l'emploi")
    await expect(programmes).not.toContainText("103")
    await expect(programmes).not.toContainText("Accompagnement des mutations")

    // Puisque, par défaut, on choisit l'année courante
    let curr = `${new Date().getFullYear()}`;
    await expect(annees).toContainText(curr);
  });
});

test.describe("Lorsque l'on spécifie une localiation", () => {
  const urlparam = `?niveau_geo=Département&code_geo=35`;

  test("Les filtres sont pré remplis", async ({ page }) => {
    await _navigate(page, `/${urlparam}`);

    let localisation = page.locator('[data-test-id="localisation-select"]')

    await expect(localisation).toContainText("Ille-et-Vilaine");
  });
});

test.describe("Lorsque l'on spécifie une année min/max", () => {
  const urlparam = `?annee_min=2019&annee_max=2020`;

  test("Les filtres sont pré remplis", async ({ page }) => {
    await _navigate(page, `/${urlparam}`);

    let annees = page.locator('[data-test-id="annees-form-field"]')

    await expect(annees).toContainText("2019");
    await expect(annees).toContainText("2020");
    await expect(annees).not.toContainText("2023");
  });
});


async function _navigate(page: Page, url: string) {
    const navigationPromise = page.waitForNavigation({
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.goto(url);
    return await navigationPromise;
}