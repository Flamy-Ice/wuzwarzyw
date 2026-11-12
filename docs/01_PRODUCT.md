# 01 — Produkt i zakres

## Pochodzenie wymagań

Podstawa: `Brief.pdf`, brief #8, s. 2–3; `Wiadomosc_do_klienta_Warzywoz.pdf`, s. 1–2; własne obrazy `Architektura treści landing page'a.png`, `Prezentacja dla klienta.png`, `Persona1.png`, `Persona2.png`, `user stories.png` oraz `wyglad strony.png`. W źródłach występuje wcześniejsza nazwa „Warzywóz” i wariant „Wuzwarzyw”; nadrzędna decyzja właściciela projektu brzmi **`wuzwarzyw`**.

## Zadanie biznesowe (potwierdzone w briefie)

Firma dostarcza co tydzień skrzynki sezonowych warzyw i owoców od 12 rolników spod Poznania. Ma 300 klientów, dąży do podwojenia bazy. **Konwersja główna:** zamówienie pierwszej skrzynki w subskrypcji. **Konwersja dodatkowa:** polecenie znajomemu, nie może przeszkadzać w zakupie. Cel biznesowy briefu: 150 nowych subskrypcji w 2 miesiące, retencja ≥70% po miesiącu. Prototyp nie jest podłączony do analityki produkcyjnej, więc nie raportuj realizacji KPI.

Grupa docelowa: pary/rodziny 28–45 lat, gotujące w domu, wrażliwe na świeżość, pochodzenie i oszczędność czasu. **65% wejść z telefonu**, 50% Facebook/Instagram, 30% polecenia, 20% Google. Główne bariery: „nie wiem, co dostanę” oraz „trudno zrezygnować”. Główna obawa o rezygnację z rzeczywistej usługi: za dużo produktów i ryzyko marnowania żywności. Stąd porównanie rozmiarów i przepisy.

Persona z materiałów zespołu: Tomasz Mazowiecki, 41 lat, z Poznania, zapracowany rodzic; urządzenie: telefon, często wieczorem. To **artefakt projektowy**, nie potwierdzony klient. Cel: przejrzeć przykład skrzynki, sprawdzić pełną cenę i możliwość pauzy, a następnie zamówić bez zbędnych kroków.

## P0 — musi działać

- W pełni responsywny landing zgodny z `design.md` i sekcjami 1–8.
- Kod pocztowy: walidacja `NN-NNN`; wynik obsługiwany/nieobsługiwany/niezweryfikowany; brak fałszywego potwierdzenia poza seedami.
- Trzy skrzynki: rozmiar, koszt produktu, koszt dostawy, cena łączna i wybór.
- Formularz zamówienia jako wizard z wyborem terminu, opcjonalnymi dodatkami, kodem DEMO, przeglądem kosztu, polami kontaktowymi z walidacją oraz świadomym potwierdzeniem DEMO.
- Potwierdzenie bez realnej transakcji; zapis nieosobowych parametrów subskrypcji i stanu w przeglądarce.
- Panel demonstracyjny: aktywna/wstrzymana/anulowana, przejście między stanami, utrzymanie stanu po reloadzie, podgląd planu i kolejnego terminu.
- Zawartość bieżącego + czterech poprzednich tygodni; informacje, że zawartość zmienia się i jest przykładowa.
- FAQ, przepisy, profile rolników, nawigacja, funkcjonalne CTA, focus klawiatury, brak martwych przycisków.

## P1 — gdy P0 ukończone

- Demonstracyjny kod polecający i kopiowanie tekstu/linku na potwierdzeniu/panelu.
- Możliwość zmiany rozmiaru, terminu i dodatków w panelu, zawsze z rekalkulacją.
- Łagodna obsługa przerwanej konfiguracji z pamiętaniem wyborów bez danych osobowych.
- Przegląd historii zdarzeń pauza/wznowienie/anulowanie (tylko w lokalnym demie).
- Użyteczne puste stany, filtry/lista rolników i przepisy jako szczegóły.

## Poza zakresem prototypu

Prawdziwe płatności, realne zamówienia i logistyka, wysyłka e-mail/SMS, konto z hasłem, bezpieczeństwo serwerowe, podłączenie do listy 37 faktycznych kodów, prawdziwe dane rolników, produkcyjne promocje, certyfikaty i opinie niepotwierdzone w źródłach, pełny sklep spożywczy, geolokalizacja, mapa typu Google Maps. Nie dodawaj fałszywych ikon „bezpieczne płatności” ani nie twórz fikcyjnej polityki prywatności jako obowiązującej prawnie.

## Priorytety UX

1. Bez pułapki: sprawdź strefę dostawy przed zbieraniem danych.
2. Bez niespodzianek: pokaż pełną cenę z dostawą i wyjaśnij sezonowość.
3. Bez lęku: jasno widoczna pauza i anulowanie; w panelu działają jednym działaniem.
4. Mniej marnowania: porównanie wielkości i konkretne przepisy.
5. Pochodzenie: ludzi i gospodarstwa pokazuj uczciwie, demo ≠ autentyczne profile.

## Kryteria sukcesu makiety

Użytkownik w 360 px rozpoznaje usługę, może sprawdzić dostawę i dotrzeć do kalkulacji ceny; przejście od landing do potwierdzenia nie wymaga niczego poza lokalnym prototypem; zmiana stanu subskrypcji działa po odświeżeniu. Testy w `docs/06_ACCEPTANCE.md`.
