# design.md — interfejs wuzwarzyw

## Kierunek artystyczny

Projekt ma zachować charakter dostarczonej makiety `references/wyglad-strony.png`: **ciepła, nowoczesna marka lokalnej żywności**. Jasne, lekko kremowe tło; głęboka zieleń; oszczędne pomarańczowe akcenty; duże, zwarte nagłówki; miękkie narożniki; proste karty; sporo oddechu. Logo z `references/logo.png` (ikonka rośliny w wózku) jest zasobem źródłowym. Nie próbuj go odtwarzać emoji ani zewnętrznym obrazkiem. Używaj nazwy `wuzwarzyw` w treści, alt i stopce.

**Ważne:** screenshot stanowi referencję wizualną, NIE zatwierdzony cennik, fotografie konkretnych rolników, dowód faktycznych dostaw czy kontakt do firmy. Nie przenoś bez oznaczenia demo wymyślonych nazwisk, dni, ocen, telefonów i innych szczegółów.

## Tokens (proponowane, dopracuj kontrast)

```css
:root {
  --bg: #faf9f5;
  --surface: #ffffff;
  --surface-alt: #f5f4ec;
  --forest: #1e3c2b;
  --forest-strong: #173322;
  --sage: #e4eee5;
  --accent: #e96b2c;
  --text: #203328;
  --muted: #607067;
  --border: #e0e6dd;
  --danger: #9a332b;
  --success: #25643d;
  --focus: #ea792d;
  --radius-card: 18px;
  --radius-control: 12px;
  --container: 1180px;
}
```

Kolor pomarańczowy stosuj na głównym CTA w wyróżnionej karcie, krótkich etykietach i detalach; tekst CTA musi przechodzić AA — w razie słabego kontrastu zmień kolor tekstu lub odcień. Unikaj czystej czerni; preferuj ciemną zieleń.

## Typografia i siatka

- Font: `Manrope` lub czytelny fallback `Inter, system-ui, sans-serif`; wersja działająca bez pobierania fontu z sieci.
- H1: clamp(2.5rem, 5vw, 4.5rem), 700–800, maksymalnie ~11 słów/linia; mocny mobile H1, bez ucięcia.
- H2: clamp(1.8rem, 3vw, 2.75rem); body: 16–18 px, line-height ≥1.5.
- Maksymalna szerokość 1180 px; content wąski w tekstach 65–75 znaków; padding mobile 16–20 px; duży ekran 24–32 px.
- Karty: promień 16–18 px, delikatna ramka i subtelny cień tylko gdzie potrzebny.
- Minimalny cel dotykowy 44 × 44 px; logiczne stany hover/focus/disabled, nie polegaj wyłącznie na kolorze.

## Struktura landing page (obowiązuje)

1. **Nagłówek / hero + kod**: logo, menu, H1 „Świeże warzywa spod Poznania. Pod Twoje drzwi.”; opis 12 lokalnych rolników; wyjaśnienie subskrypcji oraz anulowania w panelu; pole `XX-XXX`, przycisk „Sprawdź dostawę”; wtórny link „Zobacz skrzynki bez podawania kodu”. *Nie wymagaj kodu do przeglądania oferty.*
2. **Przykładowa skrzynka**: poglądowa zawartość bieżącego tygodnia i 4 wcześniejszych; zakładki klikalne; nigdy nie zapewniaj, że zestaw jest gwarantowany.
3. **Wybierz skrzynkę**: 3 wyraźne karty z wielkością, przeznaczeniem i pełną ceną wraz z kosztem dostawy; środkowa karta wyróżniona zgodnie z referencją; link do dokładnej konfiguracji. Informacja o pauzie na wysokości kart.
4. **Jak to działa**: trzy kroki: sprawdź kod → wybierz skrzynkę i termin → odbieraj i zarządzaj.
5. **Poznaj ludzi za warzywami**: 6 kart na start; przycisk pokazania dalszych profili (12 łącznie w demie). Osobne szczegóły przez rozwinięcie lub modal. Dane nieweryfikowane opisane jako przykładowe.
6. **Wykorzystaj całą skrzynkę**: trzy przepisy z możliwością otwarcia pełnych instrukcji; porada o przechowywaniu i ograniczeniu marnowania jedzenia.
7. **FAQ**: sześć pytań o zawartość, strefy, koszt, termin, anulowanie i nadmiar produktów, działający accordion.
8. **Końcowe CTA**: „Twoja pierwsza skrzynka zaczyna się tutaj.” + „Sprawdź dostawę” i „Wybierz skrzynkę”; stopka z linkiem do demo panelu i informacją o prototypie.

Każda sekcja ma cel odpowiadający potrzebie użytkownika. Program poleceń nie konkuruje z zakupem; pokaż go dopiero na ekranie potwierdzenia i w panelu.

## Interakcje i zachowanie

- Sticky nagłówek na desktop; na mobile dyskretne menu rozwijane (bez blokowania głównego CTA). `scroll-margin-top` chroni sekcje przed zakryciem nagłówkiem.
- Pole kodu od razu na mobile; klawiatura numeryczna, przykład `60-001`, formatowanie i błąd bez czyszczenia pola.
- Zakładki tygodni są semantycznymi przyciskami/`tablist` z klawiaturą; aktywny stan czytelny bez koloru.
- Karty skrzynek nie mogą doprowadzać do zamówienia bez kodu: jeśli kod niezweryfikowany, zachowaj wybór skrzynki i poproś o kod w pierwszym kroku konfiguratora.
- Konfigurator: czytelny wskaźnik kroków, cofanie bez utraty wyborów, podsumowanie stale widoczne na desktop i na końcu formularza na mobile.
- W panelu widoczny status `active`, `paused` lub `canceled`; przyciski dają natychmiastowy, zrozumiały feedback. Po anulowaniu pokaż działającą ścieżkę ponownego zamówienia.
- Nie dodawaj animacji, które opóźniają nawigację; respektuj `prefers-reduced-motion`.

## Responsywność

Projektuj od 360 px; weryfikuj 320 / 360 / 390 / 768 / 1024 / 1440 px. Karty rozmiarów mobile jedna pod drugą, tablet 2 kolumny jeśli wystarcza miejsca, desktop 3. Sekcja przykładowej skrzynki mobile: media nad tekstem, desktop: 2 kolumny. Rolnicy mobile 1, tablet 2, desktop 3. Brak zawijających się niezrozumiale cen lub rozmiarów. Menu nie nachodzi na H1.

## Assets

- `references/logo.png`: oryginalna ikonka (sprawdź transparentność w przeglądarce).
- `references/wyglad-strony.png`: wizualna referencja koloru i kompozycji.
- `references/uklad-strony.png`: wcześniejszy wireframe — mniej aktualny niż screenshot finalny.
- `references/architektura-tresci.png`: decyzje o sekcjach.
- Nie używaj zdjęć ze zrzutu ekranu jako samodzielnych zdjęć oferty. Jeśli brak autentycznych materiałów, zastosuj schludne, lokalne ilustracje CSS/SVG, a profile podpisz „Zdjęcie demonstracyjne”. Zakazane: niedziałające zewnętrzne URL-e i fałszywe logotypy certyfikatów.

## UX writing

Ton lokalny, ciepły i konkretny. Krótkie CTA w formie działania: „Sprawdź dostawę”, „Wybieram tę skrzynkę”, „Potwierdź zamówienie demonstracyjne”, „Wstrzymaj”, „Wznów”, „Anuluj”. Koszt łączny i warunki subskrypcji bez ukrytego drobnego druku. Szczegółowy tekst: `docs/07_CONTENT.md`.
