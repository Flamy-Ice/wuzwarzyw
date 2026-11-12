# 11 — Jeśli używasz kilku agentów równolegle

Nie zakładaj stałego limitu agentów ani wielkości kontekstu konkretnego modelu: zależy to od aplikacji, planu i konfiguracji. Ten plik definiuje **bezpieczną organizację pracy**, a nie gwarancję liczby agentów. Domyślnie wystarcza **jeden agent wykonujący etapy po kolei**. Jeśli narzędzie pozwala, uruchamiaj najwyżej dwa równoległe zadania, wyłącznie z niepokrywającymi się plikami.

## Podział ról (osobne krótkie sesje, niekoniecznie osobne procesy)

| Rola | Dokumenty | Własność plików | Wynik |
| --- | --- | --- | --- |
| Koordynator | AGENTS, 05, 09, HANDOFF | router/konfiguracja/README | scala, testuje, rozstrzyga |
| UI | AGENTS, design, 07 + screenshot | `components/landing`, CSS | responsive landing |
| Domain | AGENTS, 03, fragment 06 | `domain`, `data`, unit tests | ZIP, ceny, daty, statusy |
| Checkout | AGENTS, 02, 03, 10 | `components/checkout`, `pages/Checkout` | zamówienie od A do Z |
| Panel/QA | AGENTS, 02, 06, 10 | `dashboard`, tests/E2E | panel, regresje, dostępność |

## Synchronizacja

1. Koordynator realizuje E0 i stabilizuje typy (`BoxId`, `Cart`, `Subscription`) oraz fixture przed równoległą pracą.
2. UI i Domain mogą wykonać E1 oraz E2 równolegle tylko wtedy, gdy nie modyfikują tych samych plików lub eksportów. Każdy kończy testami dla własnego obszaru.
3. Checkout zaczyna się dopiero po scaleniu domeny E2; panel po spójnym checkout E3.
4. QA analizuje kod po scaleniu, nie podczas konflikujących zmian.
5. **Tylko jeden agent** może edytować `package.json`, wspólne typy i adapter storage naraz.
6. Nie przekazuj logów całych sesji: przekazuj `docs/HANDOFF.md`, listę zmienionych plików, API i wyniki testów.

## Kontrakt zlecenia dla agenta pomocniczego

```text
Pracujesz w projekcie wuzwarzyw. Wczytaj AGENTS.md oraz tylko [wymienione dokumenty].
Twoim zakresem są pliki: [lista]. NIE edytuj nic poza nimi, szczególnie wspólnych typów,
package.json, routera i storage, chyba że koordynator wyrazi zgodę.
Zrealizuj [jedno zadanie], uruchom odpowiednie testy i przekaż:
- zmienione pliki,
- opis API,
- wynik testów,
- blokery.
Nie kopiuj do odpowiedzi plików źródłowych w całości.
```

## Gdy narzędzie ma sztywny limit wywołań albo równoległości

Wybierz strategię sekwencyjną: E0 → E1 → E2 → E3 → E4 → E5 → E6. Przy mocnym ograniczeniu czasu wykonaj najpierw minimalny pionowy slice opisany w `docs/05_IMPLEMENTATION.md`. Jakość i dokończenie jednej ścieżki są ważniejsze niż jednoczesne rozpoczęcie wielu niedokończonych modułów.
