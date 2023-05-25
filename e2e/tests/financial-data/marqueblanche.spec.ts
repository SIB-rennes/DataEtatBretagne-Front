import { test, expect } from "@playwright/test"
import mockRefApi from "../utils/mock-api";

test.describe("Page d'accueil", () => {
    test.beforeEach(async ({ page }) => {
        const navigationPromise = page.waitForNavigation({
            waitUntil: 'networkidle',
        });
        await mockRefApi(page);
        await page.goto('./');
        await navigationPromise;
    });

  test("L'utilisateur est connecté", async ({ page }) => {
    await expect(page).toHaveTitle(
      /^Données financières de l'état en Bretagne*/
    );
  });
});

const urlparam = `?programmes=101,102`

test.describe("Lorsque l'on spécifie deux programmes", () => {
  test("Les filtres sont pré remplis", async ({ page }) => {
    const navigationPromise = page.waitForNavigation({
      waitUntil: 'networkidle',
    });
    await page.goto(`/${urlparam}`);
    await navigationPromise;

    let programmes = page.locator('[data-test-id="programmes-form-field"]')

    await expect(programmes).toContainText('101')
    await expect(programmes).toContainText('Accès au droit et à la justice')
    await expect(programmes).toContainText('102')
    await expect(programmes).toContainText("Accès et retour à l'emploi")
    await expect(programmes).not.toContainText("103")
    await expect(programmes).not.toContainText("Accompagnement des mutations")
  });
});