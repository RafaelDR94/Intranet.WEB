import { Page, expect } from "@playwright/test";
import { fillStable } from "./actions-helpers";


export async function getUserFromIndexedDB(page: Page) {
    return page.evaluate(() => {


        return new Promise<any | null>((resolve, reject) => {

            const DB_NAME = 'LoginDatabase';
            const STORE = 'documents';
            const KEY = 1; // según tu screenshot
            const open = indexedDB.open(DB_NAME);
            open.onerror = () => reject(open.error);

            // Si la DB no existe aún en este origin, evita bloquear (resuelve null)
            open.onupgradeneeded = () => resolve(null);

            open.onsuccess = () => {
                const db = open.result;
                if (!db.objectStoreNames.contains(STORE)) return resolve(null);

                const tx = db.transaction(STORE, 'readonly');
                const store = tx.objectStore(STORE);

                const req = store.get(KEY);
                req.onerror = () => reject(req.error);
                req.onsuccess = () => {
                    const found = req.result as { id?: unknown; user?: any } | undefined;
                    if (found && 'user' in found) return resolve(found.user ?? null);

                    // fallback: toma el primer registro del store
                    const curReq = store.openCursor();
                    curReq.onerror = () => reject(curReq.error);
                    curReq.onsuccess = () => {
                        const cur = curReq.result;
                        if (!cur) return resolve(null);
                        const val = cur.value as { user?: any };
                        resolve(val?.user ?? null);
                    };
                };
            };
        });
    });
}

export const IndexDbUserSaved = async (page: Page) => {
    await page.waitForFunction(() => {
        return new Promise<boolean>((resolve) => {
            const open = indexedDB.open('LoginDatabase');
            open.onsuccess = () => {
                const db = open.result;
                const tx = db.transaction('documents', 'readonly');
                const st = tx.objectStore('documents');
                const g = st.get(1);
                g.onsuccess = () => resolve(!!g.result?.user);
                g.onerror = () => resolve(false);
            };
            open.onerror = () => resolve(false);
        });
    });
}

export const fastLogin = async (page: Page, email: string, password: string) => {

    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    const emailBox = page.getByTestId('login-email');
    const passBox = page.getByTestId('login-password');
    await fillStable(emailBox, email);
    await fillStable(passBox, password);
    const clickPromise = page.getByTestId('login-primary')
        .or(page.getByRole('button', { name: /Iniciar sesi/i }))
        .click();
    await clickPromise;
    await IndexDbUserSaved(page);




}