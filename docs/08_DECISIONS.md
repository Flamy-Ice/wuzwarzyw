# 08 — Rejestr decyzji, źródeł i luk

## Jak interpretować dokumentację

Pierwszeństwo: (1) jawna prośba właściciela projektu, (2) fakty z briefu, (3) decyzje opisane w wiadomości do klienta, (4) architektura treści i prezentacja, (5) finalna kolorowa makieta, (6) starszy wireframe, (7) dane demo potrzebne do implementacji. Nie poprawiaj ciszą sprzeczności — stosuj rozstrzygnięcia poniżej.

| ID | Decyzja | Dlaczego / źródło | Status |
| --- | --- | --- | --- |
| D01 | Marka: **`wuzwarzyw`** dokładnie | Jawna instrukcja właściciela; wcześniejsze materiały mają inne wersje | wiążąca |
| D02 | Serwis = landing + checkout + panel DEMO | Brief #8, s. 3 wymaga kodu, rozmiaru, dnia, pauzy i rezygnacji; użytkownik chce działający prototyp | wiążąca |
| D03 | Najpierw kod dostawy, ale można przeglądać ofertę bez kodu | Wiadomość do klienta, s. 1; usunięcie pułapki UX | wiążąca |
| D04 | Zawartość przykładowa przed szczegółowym cennikiem, **cena szybko dostępna i pełna** | Wiadomość do klienta, s. 1–2; architektura treści i screenshot finalny | wiążąca |
| D05 | 8 sekcji landing | `Architektura treści landing page'a.png`, kolumna „Sekcje strony”; `wyglad strony.png` potwierdza finalną narrację | wiążąca |
| D06 | 3 rozmiary, do wyboru także w panelu po P0 | Brief #8 s. 3 i screenshot UI | P0/P1 |
| D07 | Ceny 69/99/135 zł i dostawy 12/10/0 zł to wartości **tylko demo** | `wyglad strony.png`, ceny nie zostały potwierdzone w briefie | założenie demo |
| D08 | Wtorek/czwartek to dni **tylko demo** | Screenshot UI; brief podaje „dni dostaw”, lecz nie podaje dni tygodnia | założenie demo |
| D09 | 3 wspierane ZIP w demie, brak listy 37 | Brief podaje liczbę 37, a nie ich wykaz; nie wolno wywnioskować pokrycia z lokalizacji | założenie demo |
| D10 | Przykładowi rolnicy, profile i przepisy jawnie DEMO | Brief mówi o zdjęciach 12 rolników, ale nie otrzymaliśmy osobnych zweryfikowanych plików ze zdjęciami i danymi | założenie demo |
| D11 | Referencja wizualna: finalny screenshot ma pierwszeństwo przed wireframe | `wyglad strony.png` i `Układ strony.png` | wiążąca |
| D12 | Program poleceń dopiero po zakupie i w panelu | Brief #8 s. 3 + architektura treści „Nie na stronę” | wiążąca |
| D13 | Dodatki tylko w konfiguratorze, w landingu krótka wzmianka | Wiadomość do klienta s. 1, architektura treści | wiążąca |
| D14 | Brak rzeczywistych transakcji i kont | Prototyp offline-first bez dostępu do zewnętrznych systemów | architektura demo |
| D15 | Osobowych danych nie zapisujemy w localStorage | Odpowiedzialna minimalizacja danych w demonstracji | architektura demo |

## Źródła dostarczone przez użytkownika

- `Brief.pdf`, s. 2–3 — cele, odbiorcy, liczby, ograniczenia, funkcje.
- `Wiadomosc_do_klienta_Warzywoz.pdf`, s. 1–2 — uzasadnienie UX: mobilność, zawartość, cena, kod i łatwa rezygnacja. Dokument zawiera dawną nazwę — nie kopiuj jej.
- `Persona, heurystyka, makieta.pdf`, m.in. s. 5–8 i 11–14 — persona, user stories, user flow, heurystyki, makieta najpierw mobile.
- `Zajęcia 1.pdf`, s. 15–16 — projekt obejmuje architekturę, persony, makietę mobile/desktop, testy i prezentację; budowa strony jest rozwinięciem zadania.
- `Architektura treści landing page'a.png` — zakres sekcji i podział „poza landingiem”.
- `Prezentacja dla klienta.png` — uzasadnienie podjętych decyzji; inspiracja, nie rygor cennika.
- `Persona1.png`, `Persona2.png`, `user stories.png` — artefakty zespołu i potrzeby.
- `Układ strony.png` — szkic; `wyglad strony.png` — docelowa estetyka; `logo.png` — logo źródłowe.

## Co wymaga potwierdzenia przed realnym wdrożeniem

Zatwierdzony cennik i opłaty, 37 kodów pocztowych, realne daty i cut-off, polityka skrzynek i dodatków, zweryfikowani rolnicy i fotografie, prawa do zdjęć, szczegółowe zasady rabatów/poleceń, dane kontaktowe, polityka prywatności i regulamin, operator płatności oraz możliwość faktycznej anulacji. Żadnej z tych luk nie ukrywaj w interfejsie demonstracyjnym.

## D16 — fotograficzne odświeżenie po E6

Najnowsza jawna prośba właściciela ma pierwszeństwo przed starszymi wymaganiami widocznych etykiet DEMO: usunięto baner i techniczne określenia z interfejsu, w tym checkoutu i panelu. Pozostawiono rzeczową informację, że potwierdzenie nie pobiera opłaty i nie uruchamia dostawy ani e-maila, a dane kontaktowe nie są utrwalane. Nie zmieniono lokalnej architektury ani ograniczeń integracji; dane nadal nie są zatwierdzoną ofertą biznesową. Zdjęcia wygenerowane przez image_gen zastępują placeholdery SVG/CSS; pochodzenie AI jest podane w stopce, prompty w generated-assets.json. Dodano ruch respektujący prefers-reduced-motion bez dodatkowych zależności. Zmiana dotyczy prezentacji i copy, nie uruchomienia sklepu produkcyjnego.
