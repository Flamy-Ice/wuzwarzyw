# 09 — Zarządzanie ograniczonym kontekstem agentów

## Problem

Zbyt obszerny prompt z PDF, screenshotami, kodem i poprzednią historią może zająć miejsce niezbędne do programowania, testowania i poprawiania błędów. Nie znamy rzeczywistego limitu narzędzia/modelu użytkownika, więc zamiast zakładać konkretną pojemność, **ograniczamy liczbę równocześnie wczytywanych materiałów**.

## Reguła praktyczna

- `AGENTS.md`: zawsze (krótki kontrakt).
- `docs/HANDOFF.md`: zawsze po E0 (≤600 słów).
- Jedna lub dwie specyfikacje na etap, maksymalnie jedna dodatkowa referencja wizualna. Docelowa ilość czytanej dokumentacji: **~6–8 tys. tokenów roboczych**, umowny miękki sufit **10 tys.**, NIE twierdzenie o limicie modelu.
- Jeśli opis jest większy: skopiuj do notatek tylko istotny fragment oraz nazwę oryginalnego pliku; nie tnij treści wymagań krytycznych.
- Nie dołączaj historii wszystkich rozmów ani zrzutu zawartości całego repo. Do diagnozy dostarczaj konkretny stack trace i pliki w problemie.
- Nie generuj 100 komponentów naraz. Pracuj w pionowym przekroju aż do prawdziwego przepływu E2E.

## Matryca kontekstu etapów

| Etap | Minimalny kontekst | Czego nie czytać |
| --- | --- | --- |
| E0 | AGENTS, 04, 09 | screenshoty i wszystkie PDF |
| E1 | AGENTS, design, 01, 07, wyglad strony | DATA, acceptance E2E, inne zdjęcia |
| E2 | AGENTS, 03, fragment 06 | obrazy i copy |
| E3 | AGENTS, 02, 03, 10 | screenshoty i pozostała teoria |
| E4 | AGENTS, 02, 03, fragment 06 | cała historia E1 |
| E5 | AGENTS, 06, 10, HANDOFF | całe źródłowe PDF |
| E6 | AGENTS, README, 06, HANDOFF | nowy redesign |

## `docs/HANDOFF.md` — format (utworzyć po E0)

```markdown
# HANDOFF — wuzwarzyw
Etap: E0 / E1 / ...
Data: YYYY-MM-DD
DONE: 3–7 krótkich punktów o faktycznych zmianach
FILES: pliki faktycznie dotknięte
TESTS: komenda → wynik PASS/FAIL/NOT RUN (+ powód)
DECISIONS: tylko odstępstwa od specyfikacji
KNOWN ISSUES: co nie działa; priorytet i jak odtworzyć
NEXT: jeden etap i pierwszy konkretny krok
```

Nie kopiuj do tego pliku całej rozmowy, kodu ani wymagań z innych dokumentów.

## Prompt kontynuacji po utracie kontekstu

```text
Kontynuuj projekt wuzwarzyw w tym repozytorium. Przeczytaj AGENTS.md oraz
aktualny docs/HANDOFF.md. Nie wczytuj całej dokumentacji. Na podstawie
pola NEXT sprawdź tylko przypisane do etapu pliki z docs/09_CONTEXT.md.
Nie powtarzaj etapów oznaczonych DONE, chyba że testy wykazują regresję.
Wykonaj jeden etap, uruchom testy, zaktualizuj HANDOFF i podaj następny krok.
Marka: wuzwarzyw (pisownia celowa). Wszystkie dane niepotwierdzone to DEMO.
```

## Gdy agent przybliża się do limitu

1. Zatrzymaj implementację w stanie dającym się zbudować.
2. Uzupełnij HANDOFF: fakty, błędy, stan testów, następne jedno zadanie.
3. Odrzuć stare logi i historię, otwórz nową sesję z promptem kontynuacji.
4. Nie rozwiązuj problemu przez kopiowanie nieograniczonego kodu do jednego okna.

## Ochrona przed „pozorami ukończenia”

Gdy agent odpowiada samym planem lub „zrobiłem”, ale brakuje kodu/testów, przywróć kryteria z `docs/06_ACCEPTANCE.md` i zażądaj fizycznych zmian, komend i wyników. Handoff jest dowodem procesu, nie dowodem że produkt działa.
