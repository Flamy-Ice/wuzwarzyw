# 10 — Jakość, dostępność, prywatność

## Dostępność

Docelowo kluczowe interakcje spełniają WCAG 2.2 AA. Wszystko obsługiwalne klawiaturą, logiczny porządek TAB, wyraźny `:focus-visible`, czytelny kontrast, etykiety zamiast samych placeholderów, inline error + `aria-describedby`, statusy komunikowane w `aria-live` (bez spamowania). Headings mają logiczną hierarchię. Obrazy merytoryczne mają opisowe alt; dekoracyjne mają `alt=""`. Nigdy nie ukrywaj ważnych informacji wyłącznie w obrazie lub kolorze.

Accordion ma `aria-expanded` i kontrolowane panele; tabs mają prawidłowe role i sterowanie strzałkami lub prostą semantykę przycisków; dialog ma focus trap i Escape, po zamknięciu oddaje focus. Nie buduj pseudokontrolek z `div onClick`. Na mobile cel dotykowy min. 44 px.

## Wydajność

Buduj bez ciężkich UI frameworków, jeśli nie wnoszą wartości. Lazy-load duże zdjęcia i sekcje poniżej pierwszego ekranu; ustaw wymiary grafik; nie powoduj layout shift. Unikaj fontów i zewnętrznych skryptów blokujących render. Prototyp musi działać w przeglądarce w trybie offline po wcześniejszym załadowaniu zasobów z lokalnego serwera (nie obiecuj PWA bez service workera).

## Prywatność i bezpieczeństwo demonstracji

- Interfejs widocznie mówi „Tryb demonstracyjny — brak płatności i prawdziwych dostaw”.
- Nie wysyłaj danych formularza na serwer; nie zapisuj imienia, adresu, telefonu, e-maila do `localStorage`, URL ani logów.
- Nie stosuj loginu imitującego realną ochronę danych. Panel jest dostępny w tej przeglądarce, nie „na koncie” w chmurze.
- Nie proś o dane karty. Nie pokazuj ikon „certyfikowanej płatności” bez integracji.
- Do odczytu localStorage stosuj walidację shape i obsługę wyjątku; renderuj dane w React bez `dangerouslySetInnerHTML`.
- W repozytorium nie ma sekretnych kluczy, haseł ani tokenów; `.env` tylko jeśli naprawdę potrzebny.
- Nie podawaj fikcyjnych opinii, konkretnych rolników lub kontaktu jako dowodu autentyczności.

## Stabilność i testowanie

- Testy domenowe nie zależą od prawdziwego zegara; wstrzykuj aktualną datę w funkcjach do terminów.
- Testy E2E resetują localStorage przed każdym scenariuszem. Weryfikuj reload.
- Zadbaj o granice 320 px, 360 px, 768 px, 1440 px i jasną informację o nieprawidłowym ZIP.
- Stany `loading`, `error`, `success` istnieją tylko tam, gdzie jest prawdziwa operacja (nie dodawaj sztucznego kilkusekundowego spinnera przy lokalnym sprawdzaniu kodu).
- Jeśli wprowadzisz clipboard API, daj sensowną obsługę braku uprawnienia i ręczne skopiowanie kodu.

## Zakończenie

Dopiero po sprawdzeniu testów P0 agent aktualizuje README. W raporcie końcowym oddziel **potwierdzone** od **niezweryfikowanych** testów i funkcji. Poprawność zachowań jest ważniejsza niż perfekcyjny pixel matching.
