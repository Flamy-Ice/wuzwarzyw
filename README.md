# wuzwarzyw

Funkcjonalny, polskojęzyczny prototyp subskrypcji sezonowych skrzynek od rolników spod Poznania. Landing, czterostopniowy konfigurator, potwierdzenie i panel działają w przeglądarce. Interfejs został odświeżony fotograficznie. Na prośbę właściciela usunięto banery i etykiety DEMO; przy potwierdzeniu pozostaje informacja o braku opłaty i realizacji dostawy.

## Uruchomienie lokalne

Sprawdzono na Windows, Node.js 24.14.0 i npm 11.9.0. W PowerShell użyj `npm.cmd`, ponieważ lokalna polityka blokuje `npm.ps1`. Na innych systemach użyj `npm` i `npx` bez rozszerzenia `.cmd`.

```powershell
npm.cmd ci --cache .npm-cache --no-audit --prefer-offline
npm.cmd run dev -- --port 5173 --strictPort
```

Otwórz http://127.0.0.1:5173/. Podczas implementacji zależności zainstalowano przez `npm.cmd install`; `package-lock.json` utrwala wersje do kolejnych instalacji. Instalacja wymaga dostępu do rejestru npm. Sam prototyp nie wymaga zewnętrznych usług.

```powershell
npm.cmd run build
npm.cmd run preview -- --port 4173 --strictPort
```

Build trafia do `dist/`. Preview jest dostępne pod http://127.0.0.1:4173/. Odświeżanie tras działa w Vite dev/preview. Inny hosting statyczny musi kierować nieznane ścieżki na `index.html`; dołączono `public/_redirects` dla hostów obsługujących ten format. Nie otwieraj `dist/index.html` przez `file://`.

## Co kliknąć na prezentacji

1. Na `/` przejrzyj zawartość pięciu przykładowych tygodni. Otwórz przepisy, FAQ i wszystkie profile gospodarstw DEMO.
2. Sprawdź kod `00-001`: wynik poza przykładową strefą. Kod `99-999` daje osobny wynik „brak danych”, a nie rzeczywisty brak dostawy. Pusty kod, litery i `12` dają błąd formatu.
3. Wpisz `60-001` albo `60001`. Pozostałe obsługiwane kody DEMO: `60-002`, `61-001`. Lista rzeczywistych kodów nie została udostępniona i nie jest symulowana.
4. Wybierz skrzynkę. `/zamow` prowadzi przez Dostawę → Skrzynkę → Dane → Podsumowanie. Można też wybrać rozmiar bez kodu; walidacja jest wtedy wymagana w konfiguratorze.
5. Wybierz termin, dodatki i kupon `START10` z fixture. Rabat dotyczy tylko pierwszej dostawy danego rekordu DEMO. Zmień ilości lub usuń kupon i obserwuj pełny koszt.
6. Do podglądu podaj fikcyjne dane, np. Testowa, demo@example.com, Fikcyjna 1, Poznań. Telefon jest opcjonalny. Zaznacz zgodę na zasady DEMO i potwierdź — żadna opłata nie zostanie pobrana.
7. `/zamow/potwierdzenie` pokazuje numer i podsumowanie. Odśwież stronę, przejdź do `/panel`, wstrzymaj, odśwież, wznów, odśwież i anuluj. Anulowanego rekordu nie można wznowić; można utworzyć nowy.
8. Skopiuj kod polecenia DEMO albo użyj opcji ręcznej przy blokadzie schowka. Na koniec kliknij „Wyczyść ustawienia”. Pusty panel ma też jawny przycisk wczytania przykładowej subskrypcji.

## Testy i wyniki

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npx.cmd playwright install chromium
npm.cmd run test:e2e
npm.cmd run build
```

Playwright uruchamia serwer na porcie 5173 lub używa już działającego. Port musi być wolny albo obsługiwany przez ten projekt. Pierwsza instalacja Chromium wymaga internetu; kolejne testy używają lokalnej przeglądarki.

Odbiór 2026-11-05: lint i typecheck PASS, 30 testów jednostkowych PASS, 11 testów E2E w Chromium PASS, produkcyjny build PASS. Testy pokrywają krytyczne scenariusze z `docs/06_ACCEPTANCE.md`; mapowanie zawiera `docs/QA.md`. Axe nie wykrył naruszeń badanych reguł WCAG A/AA. Sprawdzono layout przy 320, 360, 390, 768, 1024 i 1440 px oraz klawiaturę, dialogi, powrót focusu i przeładowania.

Screenshoty powstają w `test-results/` (katalog jest ignorowany i odnawiany przy kolejnym uruchomieniu E2E). Ślady Playwright są zapisywane przy błędach. Automatyczny skan nie zastępuje pełnego audytu WCAG ani testu z czytnikiem ekranu; nie przeprowadzono badań z użytkownikami ani testów Safari/Firefox.

## Dane, prywatność i granice demonstracji

- Jedynym źródłem cen, rabatów, limitów, kodów, zawartości i terminów tygodnia jest `data/demo-fixtures.json`, walidowany przy starcie przez Zod. W interfejsie użyto lokalnych fotografii wygenerowanych przez image_gen. Nie przedstawiają zatwierdzonych rzeczywistych dostawców. Profile i przepisy są demonstracyjne.
- Brak backendu, płatności, prawdziwych dostaw, kont, autoryzacji, wysyłania e-mail/SMS, newslettera i analityki. Panel jest lokalny, bez zabezpieczenia kontem; nie jest usługą produkcyjną.
- Klucz `wuzwarzyw.demo.v1` zawiera tylko identyfikator, status, wariant, kod strefy DEMO, termin, dodatki, kupon, wersję i znaczniki czasu. Dane kontaktowe żyją wyłącznie w stanie formularza i są czyszczone po potwierdzeniu. Nie trafiają do storage, URL ani sieci.
- Zablokowany storage lub brak miejsca uruchamia fallback w pamięci i czytelny komunikat. Wtedy odświeżenie usuwa stan sesyjny. Uszkodzony lub nieobsługiwany zapis jest odrzucany. Otwarte karty synchronizują prawidłowy zapis przez zdarzenie `storage`.
- Konfigurator nie utrwala niedokończonego formularza. Finalna subskrypcja pozostaje po reloadzie. Panel pokazuje przyszły termin, gdy pierwotny termin już minął; pauza i anulowanie wyłączają planowanie DEMO. Edycja ustawień istniejącej subskrypcji i historia zdarzeń pozostają opcjonalnym zakresem P1.
- Interakcje działają lokalnie po załadowaniu aplikacji. Brak service workera/PWA; ponowne otwarcie wymaga działającego lokalnego serwera. Schowek zależy od uprawnień przeglądarki i ma ręczny fallback.
- `npm audit` zgłosił 10 umiarkowanych ostrzeżeń w narzędziach developerskich ESLint/typescript-eslint przez `minimatch` 10.2.6; brak ostrzeżeń high/critical i brak zgłoszonych podatności zależności produkcyjnych. Nie zastosowano wymuszonej zmiany głównych wersji narzędzi.

## Kod i przepływ

`src/Landing.tsx` — osiem sekcji, `src/Checkout.tsx` — wizard i potwierdzenie, `src/Dashboard.tsx` — panel, `src/Referral.tsx` — polecenie. `src/domain/` zawiera czyste funkcje, `src/data/` walidację i repozytorium, `src/tests/` testy jednostkowe, a `e2e/` testy Playwright i axe. Stos: Vite, React, TypeScript, React Router, Zod i zwykły CSS; wersje znajdują się w `package.json` i lockfile.

```text
landing → kod DEMO → dostawa → skrzynka/dodatki/kupon → fikcyjne dane → podsumowanie
                                                                        ↓
panel ← potwierdzenie ← lokalny rekord bez danych osobowych
  aktywna → wstrzymana → aktywna
  aktywna / wstrzymana → anulowana → nowa konfiguracja
```

Następny krok: prezentacja według powyższego scenariusza i moderowane testy z użytkownikami. Przed jakąkolwiek produkcją potrzebne są zatwierdzone dane, odrębny projekt backendu i rzeczywistych integracji.

## Odświeżenie wizualne

Na najnowszą prośbę właściciela landing zyskał fotografię skrzynki w hero, zdjęcia gospodarstw, trzy zdjęcia potraw, fotograficzne końcowe CTA i nową typografię. Widoczne etykiety DEMO oraz baner usunięto również z formularza i panelu; starsze użycia słowa DEMO w dokumentacji opisują architekturę i dane, a nie aktualne copy interfejsu. Backend, płatności i realizacja dostaw pozostają poza zakresem. Formularz zachowuje krótki rzeczowy komunikat o braku opłaty i realizacji.

Pliki zdjęć: public/images/{harvest,farm,farm-grid,soup,potatoes,salad}.jpg. Fotografie wygenerowano wbudowanym image_gen; pełne prompty i ścieżki zawiera docs/generated-assets.json. JPEG zapisano z jakością 87, bez zewnętrznych URL-i i nowych zależności. Kolaż gospodarstw zawiera sześć osobnych kadrów i jest kadrowany w CSS.

Animacje: wejście hero, odsłanianie sekcji i kart przy przewijaniu przez IntersectionObserver/Web Animations API, interakcje hover, zdjęcia, zakładki, FAQ i dialogi oraz pasek postępu przewijania. Automatyczne animacje nie zapętlają się bez końca. prefers-reduced-motion wyłącza animacje i płynne przewijanie; zmiana ustawienia anuluje też animacje wejścia. Treść pozostaje widoczna bez uruchomionego obserwatora.

Po odświeżeniu: lint, typecheck, 30 unitów, 11 E2E i build PASS. Axe nie wykrył naruszeń badanych reguł. Sprawdzono lokalne zdjęcia, brak etykiet technicznych, tryby ruchu oraz istniejące ścieżki zakupu i panelu.
