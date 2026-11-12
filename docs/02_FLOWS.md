# 02 — User flows, stany i komunikaty

## Routing

`/` landing; `/zamow` konfigurator; `/zamow/potwierdzenie` sukces z numerem demo; `/panel` panel stanu subskrypcji; `/*` 404 z powrotem na stronę. Nawigacja może używać natywnego React Routera. Linki anchor na landing: `#zawartosc`, `#skrzynki`, `#jak-to-dziala`, `#rolnicy`, `#przepisy`, `#faq`.

## Journey A: nowa osoba, dobry kod

1. Reklama/social → hero. Użytkownik widzi markę, treść oferty, możliwość wstrzymania/anulowania i pole kodu.
2. Wpisuje `60-001` (przykładowy **obsługiwany kod DEMO**). Normalizuj spacje; dopuszczaj `60001` i automatycznie format `60-001`, wyświetl potwierdzenie „W prototypie dostępna dostawa dla tego kodu”. Nie mów, że zweryfikowano prawdziwe pokrycie.
3. Może eksplorować zawartość/rozmiary i kliknąć „Wybieram tę skrzynkę”. Zachowaj zweryfikowany kod i wybraną skrzynkę.
4. `/zamow`, etapy: **1 Dostawa** (kod i wybór przykładowej daty), **2 Skrzynka** (rozmiar, dodatki, kod DEMO), **3 Dane** (pola, tylko w pamięci komponentu), **4 Podsumowanie** (pozycje, koszt łączny, status demo, potwierdzenie).
5. Kliknięcie „Potwierdź zamówienie demonstracyjne” po walidacji generuje identyfikator demo, zapisuje nieosobowy stan do localStorage i przechodzi do potwierdzenia. Na stronie sukcesu: „To demonstracja — nie złożono prawdziwego zamówienia ani nie pobrano opłaty”, link do panelu i polecenie.
6. `/panel`: status aktywny, rozmiar, dzień, kod, cena demo, „Wstrzymaj”, „Anuluj”. Zmiana zapisuje się między odświeżeniami.

## Journey B: nieobsługiwany albo nieznany kod

- Brak kodu: błąd „Wpisz kod pocztowy”. Zły format: „Użyj formatu 00-000”.
- Kod z listy `unsupportedPostalCodes`: „W demonstracji ten kod jest poza strefą dostaw”. Widoczny link powrotu do oferty, ale **blokada potwierdzenia zamówienia**.
- Kod poprawny, nieobecny w żadnej liście: wynik **unknown**, „Nie mamy potwierdzenia dostawy dla tego kodu w danych demo”. Nie interpretuj tego jako rzeczywistego braku dostawy. Zmiana kodu i powtórzenie próby.
- Formularz `/zamow` nie zbiera danych kontaktowych, dopóki kod nie jest potwierdzony `supported`.
- Nie oferuj niedziałającego „powiadom mnie e-mailem”.

## Journey C: użytkownik przegląda skrzynki bez kodu

- W hero wybiera „Zobacz skrzynki bez podawania kodu” → scroll do `#skrzynki`.
- Wybiera rozmiar → `/zamow?box=medium` lub stan aplikacji z widocznym wyborem.
- Jeśli kod niezweryfikowany, wizard pokazuje od razu etap 1 i **blokuje** następny etap. Wybrany rozmiar nie znika.

## Journey D: dostawa, dodatki, rabat

- Dni dostawy w danych demo: wtorek/czwartek. Wygeneruj 4 najbliższe przyszłe dostępne daty według `Europe/Warsaw`, nie pokazuj dat przeszłych. Nie komunikuj realnych gwarancji dostawy ani cut-offów logistycznych.
- Dodatki są opcjonalne; zmiana ilości 0–5 i zastosowanie/usunięcie `START10` (DEMO, jednorazowy na pierwszą skrzynkę) aktualizuje total, bez ujemnych wartości.
- Przy błędzie formularza fokusuj pierwsze niepoprawne pole. Back zachowuje dokonane wybory.
- Podsumowanie: kwota skrzynki + dostawa + dodatki – zniżka = suma. Nie chowaj kosztu dostawy za CTA.

## Journey E: panel, pauza, wznowienie, anulowanie

- Stan `active`: CTA „Wstrzymaj następne dostawy” → natychmiast `paused`; „Anuluj subskrypcję” → natychmiast `canceled` z komunikatem i możliwością cofnięcia ostatniej akcji. To DEMO; brak zapytań sieciowych.
- Stan `paused`: „Wznów dostawy” → `active`; można anulować.
- Stan `canceled`: brak przycisku „Wznów” w tej samej subskrypcji; „Skonfiguruj nową skrzynkę” prowadzi do nowego zamówienia.
- W każdym stanie użytkownik wie, co aktualnie jest zapisane. Zmiany demonstrują kontrolę nad zobowiązaniem, nie pobierają pieniędzy. Jedno działanie = jeden klik, bez ciemnych wzorców i ukrytego procesu rezygnacji.
- `Undo` po anulowaniu/pauzie jest opcjonalnym usprawnieniem, ale jeśli widoczne, musi działać i nie może wprowadzać niespójności.

## Journey F: pusty panel i polecenia

- Wejście do `/panel` bez rekordu: pusty stan i „Utwórz subskrypcję DEMO” → `/zamow`. Dodatkowo jawny przycisk „Załaduj przykładową subskrypcję” dla prezentacji, bez fałszywego uwierzytelnienia.
- Program poleceń tylko na potwierdzeniu lub w panelu. Klik „Kopiuj kod DEMO” naprawdę kopiuje i pokazuje status; bez obietnicy prawdziwych bonusów.

## Przejścia

```text
landing -> (code supported?) -> wizard delivery -> box/add-ons -> contact -> summary -> confirmation -> panel
      \-> browse without code -> choose box -> wizard delivery (requires code)
code invalid/unsupported/unknown -> explain -> edit ZIP (no checkout)
active -> paused -> active
active/paused -> canceled -> new checkout only
```

## Komunikaty i decyzje UX

Każdy błąd jest inline przy polu, opisowy i dostępny dla czytnika ekranu (`aria-describedby`, `role=alert` stosowane oszczędnie). Sukcesy mają `aria-live=polite`. Nie wymuszaj loginu dla demo, nie pokazuj atrapy Apple Pay, nie zapowiadaj potwierdzenia e-mail.
