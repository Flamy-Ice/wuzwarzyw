# Odbiór prototypu — 2026-11-05

Zakres: E0–E6, scenariusze P0 z `06_ACCEPTANCE.md`. Przeglądarka: lokalny Chromium Playwright, Windows, Node 24.14.0. Bez testów moderowanych z użytkownikami oraz bez weryfikacji Safari/Firefox. Ceny i dane pochodzą z lokalnego fixture DEMO.

| Kryteria P0 | Dowód |
| --- | --- |
| 01: mobile hero, kod, rezygnacja i szerokość | `landing.spec.ts`, `quality.spec.ts`: sześć szerokości, screenshoty; ogląd mobilnego landingu |
| 02–06: normalizacja, format i trzy wyniki ZIP | `domain.test.ts`, negatywne kody w `checkout.spec.ts`, test zmiany sprawdzonego kodu |
| 07: wybór bez kodu | `quality.spec.ts`: duża skrzynka zachowana, formularz danych zablokowany |
| 08: zmiana trzech rozmiarów i kosztu | `quality.spec.ts`: wszystkie rozmiary, kwoty wyliczone z fixture |
| 09: terminy | jednostkowe daty przy zmianie roku i czasu, cztery opcje E2E |
| 10–11: dodatki, kupon i nieujemna cena | unit pricing i E2E: dwie jednostki dodatku, rabat, usunięcie kuponu |
| 12: walidacja i focus | checkout: puste pola, pierwszy błąd, checkbox zgody; klawiatura |
| 13–14: jeden rekord i reload potwierdzenia | checkout: podwójne kliknięcie, zapis bez kontaktu, reload; pusty stan potwierdzenia |
| 15–17: panel i przejścia | zakup → pauza/reload → wznowienie/reload → anulowanie/reload, brak wznowienia canceled |
| 18–19: pusty panel, seed, reset | checkout: pusty widok, seed, skasowany storage i pusty stan po resecie |
| 20: pięć tygodni | landing: każda zakładka, stan wybrania; strzałki klawiatury |
| 21: FAQ i przepisy | landing: sześć rozwinięć i trzy pełne przepisy, Escape i powrót focusu |
| 22: dwanaście profili | landing: pokazanie wszystkich i otwarcie każdego dialogu |
| 23: polecenie | kod tylko na potwierdzeniu/panelu, odczyt schowka w E2E i ręczny fallback przy blokadzie |
| 24: nawigacja | quality: wszystkie cele header/footer istnieją, zamierzona strona 404 |

Wynik komend: `lint` PASS, `typecheck` PASS, `test` 30/30 PASS, `test:e2e` 9/9 PASS, `build` PASS. Szczegóły konkretnych scenariuszy znajdują się w kodzie testów; handoff zawiera stan prac.

Kontrole jakości obejmują brak poziomego overflow na 320/360/390/768/1024/1440 px w landingu, czterech krokach checkoutu, potwierdzeniu i panelu. Obejrzano screenshoty landingu mobile oraz checkoutu i panelu desktop; screenshoty formularza mobile również są generowane. Axe w badanych widokach (w tym mobile i dialog) nie zgłosił naruszeń wybranych reguł WCAG A/AA. Testy klawiatury obejmują menu, zakładki, radio, formularz i dialogi. To kontrola prototypu, nie certyfikacja WCAG.

Prywatność: sprawdzono zapis bez imienia, e-maila, telefonu i ulicy oraz brak zewnętrznych żądań w nawigacji. Odczyt i zapis są zamknięte w repozytorium z walidacją shape; testowano uszkodzony JSON, nieznaną wersję, nieprawidłową skrzynkę, dawny termin, blokadę storage i drugą kartę. Brak prawdziwych integracji biznesowych.

Znane ograniczenia: stan przy blokadzie storage żyje tylko w sesji; brak PWA i testów innych silników; opcjonalna edycja istniejącego planu i historia nie zostały wdrożone. Audyt npm zgłosił 10 umiarkowanych ostrzeżeń narzędzi developerskich przez minimatch; zero high/critical. Nie wykonano `audit fix --force` zmieniającego główne wersje stosu.

Testy uruchomiono także bez wcześniej działającego serwera. `e2e/server.ts` uruchamia i zamyka Vite przez jego API, omijając problem zamykania drzewa procesów npm w ograniczonym środowisku Windows. Cała komenda E2E zakończyła się kodem 0 (9/9, 23 s). Czysta instalacja z lockfile przeszła przez `npm.cmd ci --cache .npm-cache --no-audit --prefer-offline`; ponownie przeszły lint, typecheck, unit i build. Produkcyjny preview zwrócił HTTP 200 dla `/`, `/panel` i `/zamow/potwierdzenie`.

## Odbiór odświeżenia fotograficznego

Po najnowszej prośbie właściciela usunięto widoczne etykiety DEMO, a starsze kryteria dotyczące tych słów zastępuje decyzja D16. Zachowano blokadę kodu, walidację, brak danych osobowych w storage i wszystkie przejścia stanów. Wynik: lint PASS, typecheck PASS, unit 30/30 PASS, E2E 11/11 PASS, build PASS. Axe nie wykrył naruszeń badanych reguł po poprawie kontrastu numerów kroków i FAQ. Sześć lokalnych plików fotografii AI ma zweryfikowane ładowanie; kadry gospodarstw korzystają z jednego kolażu. Nowe scenariusze w e2e/refresh.spec.ts sprawdzają fotografie, usunięcie etykiet, hover, animacje hero, pasek przewijania i ograniczenie ruchu. Obejrzano pełne zrzuty landingu desktop i mobile po załadowaniu zdjęć; nadal brak overflow na sześciu wymaganych szerokościach. Pełne prompty oraz pochodzenie zdjęć zapisano w generated-assets.json.
