# AGENTS.md — wuzwarzyw

> Instrukcja operacyjna dla dowolnego agenta programistycznego. Nazwa marki jest **celowo** zapisana `wuzwarzyw` (małymi literami); nie poprawiaj jej na „Warzywóz”, „Wuzwarzyw” ani inną formę. W tekstach zdań, jeśli to potrzebne, stosuj dokładnie `wuzwarzyw`.

## Cel
Zbuduj i uruchom **funkcjonalny, mobilny prototyp** polskojęzycznego serwisu subskrypcyjnych skrzynek od rolników spod Poznania: landing → sprawdzenie kodu → konfiguracja → zamówienie demonstracyjne → panel klienta (pauza/wznowienie/anulowanie). Prototyp nie przetwarza rzeczywistych płatności ani nie udaje połączonej produkcyjnej usługi.

## Hierarchia i kolejność lektury
1. `AGENTS.md` — zawsze; plik jest krótki i nadrzędny operacyjnie.
2. `docs/01_PRODUCT.md` + `docs/02_FLOWS.md` — tylko przy decyzjach produktowych lub o zachowaniu interfejsu.
3. `design.md` + odpowiednie obrazy z `references/` — tylko przy UI.
4. `docs/03_DATA.md` — tylko przy logice i danych.
5. `docs/04_ARCHITECTURE.md` — przy strukturze projektu i integracji.
6. `docs/06_ACCEPTANCE.md` — przy testowaniu i odbiorze.
7. `docs/05_IMPLEMENTATION.md` — gdy rozpoczynasz kolejny etap.
8. `docs/08_DECISIONS.md` — gdy trzeba rozstrzygnąć sprzeczne sygnały.
9. `docs/11_MULTI_AGENT.md` — tylko przy pracy równoległej lub delegowaniu.

**Nie ładuj wszystkich plików jednocześnie.** Pracuj nad JEDNYM etapem naraz; utrzymuj kontekst zadania orientacyjnie do 6–8 tys. tokenów (maksimum robocze 10 tys., nie jest to limit modelu). Otwieraj tylko pliki istotne do bieżącej zmiany. Po etapie zapisz 5–10 zdań stanu w `docs/HANDOFF.md` według `docs/09_CONTEXT.md`, zamiast przenosić całą historię rozmowy.

## Reguły bez wyjątków
- Projektowanie mobile-first; pochodzenie, przewidywalność zawartości, cena z dostawą i łatwe wyjście z subskrypcji są priorytetami UX.
- **Nie zezwalaj na zakończenie zamówienia bez pozytywnej walidacji kodu.** Kod sprawdź przed podaniem danych w formularzu.
- Ceny, konkretne kody, terminy, profile rolników, zdjęcia, przepisy, rabaty i opinie nieweryfikowalne w briefie traktuj jako **DEMO**; nie przedstawiaj ich jako faktycznych danych biznesowych.
- Dane z `data/demo-fixtures.json` są jedynym źródłem demonstracyjnych wartości liczbowych. Nie duplikuj kwot w komponentach.
- Nie implementuj prawdziwych płatności, zapisu do newslettera, wysyłania e-maili, kont użytkowników ani realnej autoryzacji. Funkcje „zamawianie” i „panel” działają w **localStorage** i są jawnie opisane jako prototyp.
- Nie zapisuj danych osobowych z formularza (imię, telefon, e-mail, ulica) w `localStorage` ani analityce. Zapamiętuj tylko nieosobowe ustawienia demonstracyjnej subskrypcji; usuń dane formularza po potwierdzeniu.
- Każdy widoczny przycisk, link, filtr, karta z akcją i formularz muszą mieć sensowny efekt; nic nie może być atrapą.
- Każdy krok ma obsługę stanu `loading`/`success`/`error` lub ich odpowiednika tam, gdzie dotyczy; uwzględnij klawiaturę i komunikaty dostępności.
- Przed dodaniem zależności sprawdź jej konieczność. Preferuj proste rozwiązania. Nie zmieniaj stosu samodzielnie bez uzasadnienia w `docs/HANDOFF.md`.
- Zawsze wykonaj `lint`, `typecheck`, `test`, `build` (gdy dostępne); napraw błędy przed zakończeniem etapu.

## Warunki ukończenia
- Wszystkie testy P0 z `docs/06_ACCEPTANCE.md` przechodzą.
- Desktop i mobile nie mają poziomego przewijania ani uciętych CTA.
- Po odświeżeniu zamówienie i status pauzy/wznowienia/anulowania pozostają spójne.
- Wszystkie niezrealizowane integracje/ograniczenia są jasno opisane w `README.md` i widoczne w interfejsie jako „Tryb demonstracyjny”.
- Ostatnia odpowiedź: faktycznie wykonane pliki, uruchomione komendy i wyniki, znane ograniczenia, następny krok. Nie deklaruj ukończenia bez weryfikacji.
