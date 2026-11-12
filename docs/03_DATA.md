# 03 — Kontrakt danych i demonstracyjne reguły biznesowe

## Prawda a założenie

`data/demo-fixtures.json` zawiera **jawne dane demonstracyjne** wybrane do symulacji. Fakty z briefu: 3 rozmiary, 12 rolników, 37 *rzeczywistych* kodów dostaw (lista nieudostępniona), tygodniowo zmienne skrzynki, 65% ruchu mobilnego. Ceny i dostawy ze screena są przykładami, nie zatwierdzonymi warunkami handlowymi. **Nigdy nie generuj rzekomo oficjalnej listy 37 kodów**. Zaakceptuj tylko kody z demo-fixture; `unknown` jest osobnym wynikiem.

## Schematy TypeScript (docelowy wzorzec)

```ts
type BoxId = 'small' | 'medium' | 'large';
type PostalStatus = 'idle' | 'invalid' | 'supported' | 'unsupported' | 'unknown';
type SubscriptionStatus = 'active' | 'paused' | 'canceled';
type WeekId = 'current' | 'week-1' | 'week-2' | 'week-3' | 'week-4';

type Box = { id: BoxId; label: string; sizeNote: string; priceGrosze: number; shippingGrosze: number; description: string };
type Addon = { id: string; label: string; priceGrosze: number; maxQty: number };
type Cart = { boxId: BoxId; postalCode: string; deliveryDate: string; quantities: Record<string, number>; coupon: string | null };
type Subscription = {
  version: 1;
  id: string;
  status: SubscriptionStatus;
  boxId: BoxId;
  postalCode: string;
  deliveryDate: string;
  quantities: Record<string, number>;
  coupon: string | null;
  createdAt: string;
  updatedAt: string;
};
```

W danych produktu nie ma pola `guaranteedIngredients`: zawartość jest **przykładowa**, więc pokazuj deklarację sezonowej zmienności. Świadomie oddziel dane katalogowe od transakcji.

## Deterministyczne reguły

- ZIP: wyczyść białe znaki; 5 cyfr bez myślnika → `NN-NNN`; regex `^\d{2}-\d{3}$` po normalizacji. Wynik supported tylko na podstawie `supportedPostalCodes`; unsupported tylko z jawnej listy `unsupportedPostalCodes`; wszystkie inne poprawne formaty `unknown`.
- Cena: operuj na **groszach jako integer**; `subtotal = box.priceGrosze + box.shippingGrosze + Σ(qty × priceGrosze)`; `discount = coupon === 'START10' ? min(1000, subtotal) : 0`; `total = subtotal - discount`. Cena to „pierwsza dostawa”; nie obiecuj rabatu na kolejne dostawy. Warunki rabatu w demie jasne i jednokrotne na rekord.
- Dostawy: demo dni tygodnia `[2,4]` (wtorek, czwartek), lokalne `Europe/Warsaw`. Oblicz 4 najbliższe przyszłe daty w formacie `YYYY-MM-DD`. Nie używaj `Date.toISOString()` do wyświetlania lokalnego dnia bez kontroli strefy.
- Zamówienie: weryfikuj ZIP + dostępność daty + istniejący rozmiar + dozwolone ilości + zgodę na warunki DEMO. Podwójne kliknięcie potwierdzenia nie tworzy dwóch rekordów.
- Panel: aktualizacja stanu jest atomowa; `paused -> active`, `active|paused -> canceled`; z `canceled` nie wracamy na `active` bez nowego zamówienia.
- Pusta baza: panel ma stan pusty; jawny seed demo można włączyć kontrolką.
- Przechowywanie: klucz `wuzwarzyw.demo.v1`, w localStorage tylko `Subscription` + ewentualnie bezosobowy zapis draftu; nie utrwalaj danych kontaktowych, kart płatniczych ani IP. Dodaj przycisk „Wyczyść dane demonstracyjne” na panelu.
- Odporność: obsłuż błędny JSON, brak localStorage (try/catch i stan sesyjny), nieznany `version`, uszkodzony `boxId`, niedostępny dawny termin i reload na `/zamow/potwierdzenie`.

## Treści fixtures

- Rozmiary: `small` 69 zł + dostawa 12 zł; `medium` 99 zł + 10 zł; `large` 135 zł + 0 zł (wyłącznie **DEMO wg makiety**).
- Wspierane kody w demie: `60-001`, `60-002`, `61-001` (przykładowe, nie rzeczywista lista obsługiwanych obszarów). Niedostępny demonstracyjnie: `00-001`. Wszystkie inne zwracają `unknown`.
- Dodatki: jajka, chleb, miód; kwoty i limity wyłącznie z fixture.
- Zawartości: 5 przykładowych tygodni, bez związku z rzeczywistym kalendarzem dostaw.
- Rolnicy: 12 profili **pokazowych**; żadna osoba ani gospodarstwo nie mogą być przedstawiane jako zweryfikowany rzeczywisty dostawca.
- Opinie: nie wstawiaj cytatów z fikcyjnym nazwiskiem jako prawdziwych recenzji; jeśli dodajesz social proof, nazwij go symulacją UI.

## Walidacja pól demonstracyjnego kontaktu

- Imię: ≥2 znaki; e-mail: standardowy format; telefon opcjonalny albo polski format w miarę sensowny; ulica/numer i miasto wymagane dla symulacji, ale używaj etykiety „Podaj fikcyjne dane — nie zapisujemy ich”.
- Pola zablokowane/pominięte dla ZIP unknown/unsupported. Po confirm usuń kontakt z pamięci aplikacji; nigdy nie kopiuj do URL i localStorage.
- Bez rzeczywistego mailingu; komunikat nie może twierdzić „wysłaliśmy potwierdzenie na maila”.

## Granica implementacji

Wersja demo jest deterministyczna i offline-first; `data/demo-fixtures.json` importuje się lokalnie. Nie implementuj backendu, SSR baz danych ani serwera płatności tylko po to, żeby symulować działanie. Możesz przygotować interfejs repozytorium (`DemoRepository`) do późniejszej wymiany na API, ale nie tworzyć pozornej integracji.
