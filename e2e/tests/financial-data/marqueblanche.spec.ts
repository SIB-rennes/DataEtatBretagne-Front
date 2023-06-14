import { test, expect, Page } from "@playwright/test"
import { __await } from "tslib";
import mockRefApi from "../utils/mock-api";

test.describe("Lorsque l'on définit le paramètre `grouper_par`", () => {
  const urlparam = "?programmes=107&grouper_par=theme,beneficiaire";

  test("Les colonnes de grouping sont pré-remplies", async ({ page }) => {
    await _navigate(page, `/${urlparam}`)

    await page.locator('[data-test-id="group-by-btn"]').click({ force: true })

    let group_choices = page.locator('[data-test-id="group-choice-dialog"]')

    await expect(group_choices).toContainText("Thème")
    await expect(group_choices).toContainText("Siret")
    await expect(group_choices).not.toContainText("Programme")
  })
});

test.describe("Lorsque l'on définit le paramètre `grouper_par` invalide", () => {
  const urlparam = "?programmes=107&grouper_par=inexistant";

  test("Une erreur s'affiche avec un message compréhensible", async ({ page }) => {
    await _navigate(page, `/${urlparam}`)

    let error_message = page.locator('[data-test-id="search-cmp-error-msg"]')

    await expect(error_message).toContainText("inexistant n'est pas un membre de")
  })
});

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

    let annees = page.locator('[data-test-id="annees-form-field"]');

    await expect(annees).toContainText("2019");
    await expect(annees).toContainText("2020");
    await expect(annees).not.toContainText("2023");
  });
});

test.describe("Lorsque l'on spécifie le plein écran", () => {
  const urlparam = `?programmes=107&plein_ecran=true`

  test("Les filtres sont pré-remplis", async ({page}) => {
    await _navigate(page, `/${urlparam}`);
    await expect(page.locator('[data-test-id="toggle-grid-fullscreen-btn"]')).toContainText("Rétrécir");
  })
})

test.describe("Lorsque l'on spécifie des domaines fonctionnels", () => {
  const urlparam = "?domaines_fonctionnels=0103-03-02&annee_min=2019&annee_max=2019";

  test("Un message notifie que l'on recherche également sur le domaine fonctionnel", async({ page }) => {
    await _navigate(page, `/${urlparam}`);

    await expect(page.locator('[data-test-id="notif-additionnal-search-on-domaines-fonctionnels"]'))
      .toContainText("filtre sur le domaine fonctionnel")
  })
})


test.describe("Lorsque l'on spécifie des referentiels de programmation", () => {
  const urlparam = "?referentiels_programmation=0119010101A9,010101040101&annee_min=2019&annee_max=2019";

  test("Un message notifie que l'on recherche également sur le referentiel de programmation", async({ page }) => {
    await _navigate(page, `/${urlparam}`);

    await expect(page.locator('[data-test-id="notif-additionnal-search-on-referentiels-programmation"]'))
      .toContainText("filtre sur le réferentiel de programmation")
  })
})

test.describe("Lorsque l'on spécifie des regions source", () => {
  const urlparam = "?source_region=035,53&annee_min=2022&annee_max=2022&programmes=107";

  test("Un message notifie que l'on recherche également sur les source de region", async({ page }) => {
    await _navigate(page, `/${urlparam}`);

    await expect(page.locator('[data-test-id="notif-additionnal-search-on-source-region"]'))
      .toContainText("filtre sur la source region")
  })
})


async function _navigate(page: Page, url: string) {
    const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle' });
    await mockRefApi(page);

    await page.goto(url);
    await navigationPromise;
}
