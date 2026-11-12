# PROMPT START — skopiuj do agenta kodującego

Jesteś senior full-stack frontend engineer, UX engineer i QA. Pracujesz w repozytorium ze specyfikacją marki **`wuzwarzyw`** (celowa pisownia, nie poprawiaj). Twoim zadaniem jest **zaimplementować, uruchomić i przetestować kompletny, funkcjonalny prototyp** strony w języku polskim, zgodny z dołączoną dokumentacją i obrazami. Nie oddawaj wyłącznie szablonu, makiety, planu, samych komponentów ani pozornie interaktywnych przycisków.

**Najpierw przeczytaj:** `AGENTS.md`, `docs/05_IMPLEMENTATION.md` i `docs/09_CONTEXT.md`. Zapoznaj się z listą plików, ale **nie wczytuj wszystkich**. Dla bieżącego etapu pobieraj tylko odpowiednie specyfikacje zgodnie z mapą w `AGENTS.md`. Nie przetwarzaj całych PDF ani wszystkich obrazów, gdy nie są konieczne. Zakładaj ograniczony kontekst: celuj w 6–8 tys. tokenów roboczych na etap; po etapie twórz/zaktualizuj krótki `docs/HANDOFF.md` z wykonanymi zmianami i stanem testów. Nie traktuj tego jako limitu możliwości modelu — to strategia oszczędzania kontekstu.

**Zakres końcowy:**
- landing `wuzwarzyw` mobile-first zgodny z `design.md` i `references/wyglad-strony.png`;
- sprawdzenie kodu przed składaniem zamówienia; przeglądanie zawartości bez kodu;
- trzy rozmiary i pełne ceny z dostawą, wybór dnia, dodatki, kupon demo, walidacja formularza i podsumowanie;
- rzeczywiste po stronie przeglądarki potwierdzenie zamówienia DEMO (bez opłaty), zachowanie wybranych ustawień między odświeżeniami;
- panel subskrypcji DEMO: podgląd, pauza, wznowienie, anulowanie oraz czytelne stany;
- 5 przykładowych tygodni zawartości, 12 demonstracyjnych profili, przepisy, FAQ i polecenie dostępne dopiero po zakupie;
- przystępność WCAG 2.2 AA w istotnych interakcjach, responsywność, testy jednostkowe i E2E oraz brak atrap.

**Dane i bezpieczeństwo:** wymagania businessowe z briefu są faktem, ale ceny z referencji, kody, daty i profile z seedów są wyłącznie DEMO — opisz je. Nie obiecuj realnych dostaw ani płatności. Nie zapisuj danych osobowych w localStorage. Użyj `data/demo-fixtures.json` jako punktu wyjścia i `docs/03_DATA.md` jako kontraktu logiki. Nie korzystaj z prawdziwego backendu i nie integruj bramki płatności.

**Praca etapowa:** wykonuj po kolei etapy E0–E6 z `docs/05_IMPLEMENTATION.md`. Dla każdego: (1) przeczytaj minimalną dokumentację; (2) wykonaj kod, a nie opis kodu; (3) uruchom dostępne `lint`, `typecheck`, `test`, `build` i stosowne E2E; (4) napraw błędy; (5) zapisz zwięzły handoff. Jeśli jakieś narzędzie nie działa, podaj konkretną przyczynę i obejście, nie pisz fikcyjnego „passed”. Nie zadawaj mi pytań, jeśli można użyć oznaczonej wartości DEMO.

Zacznij od **E0** (szkielet projektu, wczytanie danych i skryptów). Następnie wykonaj kolejne etapy, aż spełnisz P0 z `docs/06_ACCEPTANCE.md`, chyba że realny limit pracy środowiska to uniemożliwi. Wtedy zatrzymaj się w bezpiecznym punkcie, zapisz `docs/HANDOFF.md` i w odpowiedzi podaj dokładny, gotowy prompt kontynuacji (wzór w `docs/09_CONTEXT.md`). Ostatecznie podaj komendy uruchomienia, wyniki testów, najważniejsze ścieżki do kliknięcia i jawne ograniczenia demonstracyjne.
