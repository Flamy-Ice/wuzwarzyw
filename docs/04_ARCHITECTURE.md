# 04 — Architektura techniczna i kontrakty

## Preferowany stos (prototyp)

**Vite + React + TypeScript**, **React Router**, **Tailwind CSS** (wersja stabilna kompatybilna z projektem), **React Hook Form + Zod** (opcjonalnie, jeśli upraszcza formularz), **Vitest + Testing Library**, **Playwright** do kluczowych ścieżek E2E. Ikony lokalne lub lekka biblioteka SVG. Nie dopinaj Next.js, Supabase, Firebase ani serwera, skoro dane żyją lokalnie. Instaluj tylko potrzebne pakiety. Trzymaj konfigurację i dokumentację rzeczywistych wersji w wygenerowanym `package.json`.

## Proponowane drzewo kodu

```text
src/
  app/                 # router, root layout, providers
  pages/               # Landing, Checkout, Confirmation, Dashboard, NotFound
  components/
    layout/            # Header, Footer, DemoNotice
    landing/           # Hero, WeekContents, BoxCards, HowItWorks, Farmers, Recipes, FAQ, FinalCTA
    checkout/          # Wizard, PostalStep, BoxStep, ContactStep, SummaryStep
    dashboard/         # SubscriptionStatus, Controls, DemoReferral
    ui/                # Button, Input, Dialog, Accordion, Tabs, Toast
  domain/
    types.ts
    postalCode.ts
    pricing.ts
    deliveryDates.ts
    subscriptionMachine.ts
    validation.ts
  data/
    fixtures.ts        # import `data/demo-fixtures.json` lub kopia z walidacją
    demoRepository.ts  # localStorage adapter z try/catch
  hooks/               # useDemoSubscription, useCheckout, etc.
  styles/              # globals.css, tokens
  tests/               # domain, komponenty, ścieżki
public/
  logo.png
```

Nie kopiuj całości dokumentacji do `src`. Dane mogą być importowane z root `data/` przez alias lub skopiowane w trakcie budowy, ale bez ręcznego powielania kwot.

## Granice odpowiedzialności

- `domain/*`: czyste, testowalne funkcje bez DOM, React i `localStorage`.
- `DemoRepository`: jedyny moduł mający dostęp do storage; walidacja kształtu przy odczycie; migracja/odrzucenie nieobsługiwanych wersji; event `storage` gdy używa się kilku kart.
- Hook checkout: przechowuje roboczy stan. Dane kontaktowe TYLKO w pamięci procesu; po sukcesie czyści je.
- UI: żadnej logiki kalkulacji cen wewnątrz JSX; komponenty renderują gotowe wartości i używają funkcji domenowych.
- Testy domenowe obejmują ZIP, strefy, daty i pieniądze; test E2E obejmuje pełny zakup.

## Strony i semantyka

- Landing zawiera jedną główną `h1`. Działy `h2`, karty `h3`. Nawigacja używa `<a href="#...">` i prawidłowego focus management.
- Wizard prezentuje etapy z aktualnym krokiem (np. `aria-current="step"`), wstecz/dalej, bloki walidacji, podsumowanie.
- Confirmation ma trwały `id` demokonta; wejście bez rekordu pokazuje neutralny pusty stan, nie fałszywy sukces.
- Dashboard nie udaje autoryzacji: użyj nagłówka „Panel demonstracyjny” i linku do resetu danych.
- 404 działa na bezpośrednie wejście w ścieżkę. Konfiguracja dev/prod hosting musi obsługiwać fallback SPA (np. Netlify/Vercel static rewrite) albo użyj hash routera, jeśli brak kontroli rewrite; nie pozostawiaj błędu refresh.

## Obsługa błędów

- Brak storage/quota exceeded: informuj „Zmiany są dostępne tylko w tej sesji”; zakup/zmiana statusu nadal działa w memory fallback.
- Brak dostawy: nie można przejść dalej; błędny ZIP nie zeruje wyboru skrzynki.
- Nieprawidłowa cena/addon w seedzie: walidacja datasetu przy starcie z czytelnym błędem deweloperskim, nie `NaN zł`.
- Kontroluj `onSubmit`, aby Enter nie ominął walidacji kroków.
- Nie opieraj się na zewnętrznych obrazkach. Assety są lokalne i nie zakładają połączenia z siecią.

## Niefunkcjonalne

- Render i działanie przy 320 px, 360 px, 768 px, 1440 px; kontrast, focus i rozmiary klikalne zgodne z `docs/10_QUALITY.md`.
- Preferuj lazy-loading ciężkich sekcji/obrazów; nie blokuj głównej ścieżki animacją.
- Zamieniaj daty na polskie, ceny przez `Intl.NumberFormat('pl-PL', {style:'currency',currency:'PLN'})` z groszy/100.
- `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e` mają działać w docelowym repo. Zadbaj o `package-lock.json` i jasny README.
- Brak analityki, analytics SDK, trackerów, cookies marketingowych i zdalnych żądań personalnych w prototypie.

## Cel architektury

Prostota > moda. Implementacja ma być wystarczająco czysta do zademonstrowania użytkownikom i obrony decyzji UX, nie być pozornie produkcyjnym sklepem. Jeśli wybrany stack odbiega od tego dokumentu, podaj powód i zapis decyzji w `docs/HANDOFF.md`.
