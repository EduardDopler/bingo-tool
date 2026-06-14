import { test, expect } from "@playwright/test";

test.describe("PWA Offline Behavior", () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage and unregister service workers to start fresh
    await page.goto("/");
    await page.evaluate(async () => {
      localStorage.clear();
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      const keys = await caches.keys();
      for (const key of keys) {
        await caches.delete(key);
      }
    });
  });

  test("should register service worker, cache resources, and load app offline", async ({
    page,
    context,
  }) => {
    // 1. Load the page online
    await page.goto("/");

    // 2. Register the service worker and wait for it to be active
    const swStatus = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return "unsupported";

      const reg = await navigator.serviceWorker.register("/sw.js");

      return new Promise<string>((resolve) => {
        if (reg.active) {
          resolve("activated");
          return;
        }

        const checkState = (worker: ServiceWorker | null) => {
          if (worker) {
            worker.addEventListener("statechange", () => {
              if (worker.state === "activated") {
                resolve("activated");
              }
            });
          }
        };

        checkState(reg.installing || reg.waiting);

        reg.addEventListener("updatefound", () => {
          checkState(reg.installing);
        });

        // Timeout fallback
        setTimeout(() => resolve(reg.active ? "activated" : "timeout"), 10000);
      });
    });

    expect(swStatus).toBe("activated");

    // 3. Reload the page online while the service worker is active
    // This allows the service worker to intercept and cache all dynamic assets (TS, CSS, etc.)
    await page.reload();
    await page.waitForLoadState("networkidle");

    // 4. Set page context to offline
    await context.setOffline(true);

    // 5. Reload page offline
    await page.reload();

    // 6. Verify that the app loads and elements are present offline
    const activeBoardName = page.locator(".active-board-name");
    await expect(activeBoardName).toBeVisible();

    // 7. Verify we can interact with the app offline (e.g. toggle to edit mode)
    const modeBadge = page.locator(".mode-badge");
    await expect(modeBadge).toHaveText("Play Mode");

    const editBtn = page.getByRole("button", { name: "Edit Board" });
    await editBtn.click();
    await expect(modeBadge).toHaveText("Edit Mode");
  });
});
