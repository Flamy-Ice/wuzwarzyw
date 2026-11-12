# 06 — Kryteria odbioru i scenariusze testowe

## Definition of Done

P0: wszystkie poniższe scenariusze muszą przechodzić w działającej przeglądarce, po reloadzie i bez sieciowych integracji biznesowych. Weryfikacja: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, `npm run build`; jeśli któraś komenda nie uruchamia się w środowisku, zapisz powód i zweryfikuj ręcznie tam, gdzie możliwe. Nie deklaruj pełnego ukończenia, jeśli krytyczny test pozostaje niezweryfikowany.

## P0 — przepływy krytyczne

| ID | Test | Oczekiwany rezultat |
| --- | --- | --- |
| P0-01 | Otwórz `/` przy 360 px | H1, kod, CTA i informacja o rezygnacji są widoczne; brak poziomego scrolla |
| P0-02 | `60-001` w polu kodu | Komunikat `supported` wyraźnie oznaczony DEMO, można przejść dalej |
| P0-03 | `60001`, spacje wokół | Normalizacja do `60-001`, brak sztucznego błędu |
| P0-04 | `12`, pusty kod, litery | Zrozumiały komunikat formatu, brak przejścia do formularza danych |
| P0-05 | `00-001` | `unsupported`; checkout zablokowany |
| P0-06 | `99-999` | `unknown`, nie traktuj jako rzeczywiste `unsupported`, checkout zablokowany |
| P0-07 | Wybierz medium bez kodu | Wybrany wariant zachowany, kod wymagany dopiero w checkout |
| P0-08 | Zmień rozmiar 3 razy | Podsumowanie zgadza się z fixture, bez hardcodowanych kwot |
| P0-09 | Daty dostaw | 4 przyszłe wtorki/czwartki, żaden dzień przeszły, prawidłowa polska etykieta |
| P0-10 | Dodaj 2 jednostki dodatku, wpisz `START10` | Rozpiska i total aktualne; usunięcie kuponu przywraca cenę |
| P0-11 | `START10` z małym koszykiem | Total nigdy nie spada poniżej 0 zł |
| P0-12 | Przejdź krok formularza z brakami | Walidacja inline i focus na pierwszym błędzie; bez utraty koszyka |
| P0-13 | Potwierdź zamówienie demo | Jeden rekord, unikalny ID, komunikat brak pobranej opłaty i brak realnej dostawy |
| P0-14 | Odśwież `/zamow/potwierdzenie` | Widoczny istniejący rezultat lub kontrolowany stan „brak zamówienia”; brak fikcyjnego sukcesu |
| P0-15 | Wejdź do `/panel` po zamówieniu | Widoczne wybrane dane bez informacji osobowych; status aktywny |
| P0-16 | Wstrzymaj → refresh → Wznów → refresh | Status każdorazowo poprawny i utrzymany |
| P0-17 | Anuluj | Status `canceled`; brak przycisku wznowienia tej subskrypcji; możliwe nowe zamówienie |
| P0-18 | Wejdź do pustego `/panel` | Pusty stan, działający link do checkout i opcja demonstracyjna |
| P0-19 | Wyczyść dane demonstracyjne | Storage i widok wracają do pustego stanu |
| P0-20 | Pobaw się 5 zakładkami zawartości | Każda zmienia wyświetlany skład; komunikat „przykładowy” jest zachowany |
| P0-21 | Otwórz FAQ i 3 przepisy | Treści rozwijają się; przejścia i zamknięcia obsługują klawiaturę |
| P0-22 | Otwórz 12 profili demo rolników | Wszystkie dostępne z odpowiednią etykietą „demo” i możliwością powrotu |
| P0-23 | Program poleceń | Niedostępny jako konkurencyjne CTA hero, działa kopiowanie w panelu/confirm |
| P0-24 | Przejdź wszystkimi linkami w header/footer | Brak `href="#"` bez docelowej akcji, brak 404 poza zamierzonym `/*` |

## P0 — warunki jakościowe

- Mobile 320/360/390, tablet 768, desktop 1024/1440: brak poziomego overflow, nachodzenia pól, ukrytego CTA; 44px dotyk.
- W pełni na klawiaturze: mobile menu, tabs, accordion, formularz, opcje terminu, dialog z przepisem, przyciski stanu w panelu. `Escape` zamyka modal; focus wraca do wywołującego.
- Nazwy pól i błędów powiązane z kontrolkami; `aria-live` przy ZIP, kosztach i statusie subskrypcji.
- Co najmniej AA dla kontrastu tekstu, widoczne focus rings, brak krytycznych błędów automatycznej analizy a11y.
- Formularze nie wysyłają prawdziwych żądań; w Network brak obcych skryptów analitycznych i płatności.
- LocalStorage nie zawiera `email`, `phone`, `street`, `name` użytkownika. Sprawdź ręcznie devtools.
- W nagłówku i stopce oraz title dokumentu występuje `wuzwarzyw`, bez niezamierzonych wariantów.
- Wszystkie realne liczby z demo UI są spójne z `data/demo-fixtures.json`.

## P1 — usprawnienia (po P0)

- Wybrany kod i wariant zachowywane po powrocie z wizardu; draft bez danych kontaktowych.
- Panel pozwala zmienić przyszły termin, dodatki i rozmiar; wyraźny feedback i rekalkulacja.
- Test odporności na skasowany/błędny localStorage i wyłączony storage.
- `prefers-reduced-motion` wyłącza zbędne animacje.
- Co najmniej 3 moderowane testy z użytkownikami: sprawdź czy rozumieją sezonowość, koszt łączny i pauzę; spisz obserwacje i poprawki, nie wymyślaj wyników.

## Proponowany skrypt demonstracji (ok. 3 min)

1. Landing mobile → pokaż informacje o subskrypcji i zawartość z 5 tygodni.
2. Wpisz `00-001`, pokaż jasne ograniczenie; zmień na `60-001`, pokaż sukces DEMO.
3. Wybierz średnią skrzynkę, termin, chleb i `START10` → podsumowanie z kosztami.
4. Potwierdź i wejdź do panelu → pauza → reload → wznowienie → anulowanie.
5. Pokaż polecenie w panelu oraz reset danych demo.
