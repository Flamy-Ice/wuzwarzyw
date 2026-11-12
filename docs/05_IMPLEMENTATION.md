# 05 — Plan implementacji: małe, weryfikowalne etapy

**Zasada:** jeden etap = jedno zadanie agenta, jedna pula kontekstu, jedna weryfikacja, jeden handoff. Nie implementuj całego systemu „jednym strzałem”, jeśli kończy się to niedziałającym demo. Priorytet P0 przed animacjami. Każdy etap kończy się opisem faktycznych zmian i wyników komend w `docs/HANDOFF.md`.

## E0 — Fundament (bez zbędnej architektury)

Czytaj: `AGENTS.md`, `docs/04_ARCHITECTURE.md`, `docs/09_CONTEXT.md`.

- Utwórz Vite/React/TS, router i `package.json` ze skryptami `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `test:e2e`.
- Dodaj lokalne logo i assets, globalne style, error/404 i baner „Tryb demonstracyjny”.
- Wczytaj `data/demo-fixtures.json`, waliduj shape; przygotuj typy, helpery i adapter storage z fallbackiem.
- Uruchom `npm run lint`, `npm run typecheck`, `npm run build`. Dopiero potem E1.

## E1 — Landing i wzorzec wizualny

Czytaj: `design.md`, `docs/01_PRODUCT.md`, `docs/07_CONTENT.md`; obraz: `references/wyglad-strony.png` tylko teraz.

- Zaimplementuj wszystkie 8 sekcji, responsywną nawigację, hero, przyciski scroll/link, box cards, tabs zawartości tygodni, farmer cards (12), przepisy (pełne dialogi), FAQ accordion, footer.
- Sekcje mają prawdziwe copy i lokalne placeholdery, jeśli nie ma zweryfikowanych zdjęć.
- Przycisk „Wybieram” zachowuje box i kieruje do checkout; „Sprawdź dostawę” uruchamia walidację i jasno komunikuje wynik.
- Sprawdź ręcznie 360 i 1440 px, klawiaturę i menu.

## E2 — Logika domenowa i testy

Czytaj: `docs/03_DATA.md`, `docs/06_ACCEPTANCE.md` (tylko testy jednostkowe).

- Funkcje: format ZIP, klasyfikacja strefy, wyliczanie przyszłych dat, kalkulacja w groszach, kupon, przejścia subskrypcji, serializacja.
- Unit testy: formaty, obsługiwany/nieobsługiwany/unknown, ceny wszystkich rozmiarów, dodatki i rabat, edge cases dat i storage.
- Nie przechodź dalej, dopóki czyste funkcje nie mają testów i nie przechodzą.

## E3 — Checkout od A do Z

Czytaj: `docs/02_FLOWS.md`, `docs/03_DATA.md`, `docs/10_QUALITY.md`.

- `/zamow` ma 4 kroki, działające wstecz, walidację, aktywną korektę kosztu, wybór dostawy/dodatków/rabatu.
- Weryfikacja pozytywnego ZIP przed danymi, nie da się obejść Enterem lub direct URL.
- Po potwierdzeniu generuj rekord demo, zapisz nieosobowe dane do repo, usuń dane kontaktowe ze stanu, pokaż ekran sukcesu z identyfikatorem.
- Przetestuj błędy i przypadek refresh. Brak pozornych integracji.

## E4 — Panel demonstracyjny

Czytaj: `docs/02_FLOWS.md`, `docs/03_DATA.md`, `docs/06_ACCEPTANCE.md` (panel).

- `/panel`: pusty stan, opcjonalny seed demo, aktywna subskrypcja, pauza/wznowienie/anulowanie, reset demo, przejście do nowego zamówienia.
- Status i cena spójne po refresh. Nie pokazuj danych kontaktowych, których nie przechowujemy.
- Program poleceń dopiero po confirm i w panelu; kopiowanie działa.

## E5 — Odbiór jakości

Czytaj: `docs/06_ACCEPTANCE.md`, `docs/10_QUALITY.md`, właściwe fragmenty `design.md`.

- Dodaj test E2E: dobry kod → konfiguracja → confirmation → panel → pauza → reload → wznowienie → anulowanie; negatywny ZIP blokuje zamówienie.
- Popraw błędy a11y, kontrast, 320/360/768/1440, focus, błędy, brak martwych linków, brak horizontal overflow.
- `lint`, `typecheck`, unit, E2E i production `build` muszą się zakończyć zgodnie z `docs/06_ACCEPTANCE.md`.

## E6 — Finalizacja

Czytaj: `README.md`, `docs/06_ACCEPTANCE.md` (Definition of Done), `docs/09_CONTEXT.md`.

- Uzupełnij README o PRAWDZIWE komendy, scenariusze kodów DEMO, wytyczne uruchomienia, opis ograniczeń.
- Przygotuj krótką listę „co kliknąć na prezentacji” oraz mapę user flow.
- Zaktualizuj `docs/HANDOFF.md` i zaznacz brakujące rzeczy, jeśli jakieś pozostały.
- Nie pisz „gotowe”, jeśli P0 nie przechodzą.

## Procedura na koniec każdego etapu

1. Wymień dotknięte pliki i rozstrzygnięcia.
2. Uruchom i zapisz wyniki potrzebnych skryptów.
3. Zaktualizuj `docs/HANDOFF.md`: `DONE`, `KNOWN ISSUES`, `NEXT`, `FILES`, `TESTS`.
4. Na początku następnego etapu czytaj **tylko** AGENTS + HANDOFF + wskazane specyfikacje.

## Bezpieczny minimalny pionowy slice

Jeśli agent ma krótkie okno pracy, ukończ najpierw: hero z ZIP → trzy karty → wizard z 1 terminem i bez dodatków → confirm DEMO → panel pause/cancel. Dopiero potem dodawaj rabaty i treści drugorzędne. Nie zastępuj działającej ścieżki ozdobnym landingiem.
