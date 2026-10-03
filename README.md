# AurumtradE

Strona AurumtradE w wybranym kierunku **GARAGE**: ciemne, surowe tło,
techniczne detale, mocna typografia i warsztatowy charakter. Autorski znak
przedstawia geometryczny przód samochodu. Nazwa firmy pozostaje bez zmian.
Strona zawiera katalog aut, galerie zdjęć, filtry, listę ulubionych i kontakt.

Podgląd online: https://mateuszjoe.github.io/aurumtrade/

## Publikacja

GitHub Pages publikuje katalog główny gałęzi `main`. Zmiany wysłane do tej gałęzi
automatycznie aktualizują stronę. Strona jest statyczna i nie wymaga instalowania
zależności ani budowania projektu. Plik `.nojekyll` wyłącza przetwarzanie Jekyll.

`index.html` można otworzyć bezpośrednio w przeglądarce. Zdjęcia oraz fonty są lokalne.
Style są ładowane kolejno: `design.css` (układ bazowy i animacje),
`responsive.css` (bazowe reguły dla ekranów różnej szerokości) oraz
`automotive.css` (wygląd GARAGE wraz z własnymi regułami responsywnymi).
Kolejność ma znaczenie: ostatni arkusz nadpisuje wcześniejszą estetykę.
`app.js` obsługuje katalog, ulubione, wybór auta w sekcji głównej i galerie.
Animacje respektują ustawienie ograniczonego ruchu. Ulubione działają w pamięci
bieżącej karty; odświeżenie strony zeruje listę. Wyczyść filtry przywraca pełny
katalog, ale zachowuje zaznaczone serca.

## Oferty

Katalog zawiera siedem ogłoszeń odczytanych 3 października 2026 r. z profilu
[AurumtradE na OTOMOTO](https://aurumtrade.otomoto.pl/inventory).
Jest to liczba zaimportowanych ogłoszeń, nie potwierdzenie dostępności siedmiu aut.
Linki do poszczególnych ogłoszeń i informacje o niejednoznacznościach źródła są
w `data/stock.json` oraz w wyświetlanym katalogu.

Import jest jednorazowy. Zmiany cen, dostępności i nowe samochody trzeba aktualizować
w `data/stock.json` oraz `stock.js`. Przeglądarka odczytuje dane z `stock.js`.

Na pierwszym zdjęciu Sprintera znajduje się oznaczenie **SPRZEDANY**, choć podczas
importu jego ogłoszenie pozostawało widoczne. Karta ma etykietę „Dostępność do
potwierdzenia”, a szczegóły wyjaśniają rozbieżność. Przed przyjazdem trzeba
potwierdzić dostępność i cenę każdego auta bezpośrednio u sprzedawcy.

Nazwa firmy, kontakt i odniesienia do istniejącej marki pochodzą z
[profilu AurumtradE na Facebooku](https://www.facebook.com/people/AurumtradE/61595070023337/).
Nowy znak SVG jest w `assets/aurumtrade-symbol.svg`, a wersja z nazwą w
`assets/aurumtrade-logo.svg`. Rysunek techniczny samochodu jest w `assets/garage-blueprint.svg`. Nagłówki i elementy identyfikacji korzystają z
Barlow Condensed Bold (`assets/fonts/barlow-condensed-bold.ttf`), a teksty
z Manrope (`manrope-regular.ttf` i `manrope-bold.ttf`). Techniczne etykiety
używają systemowej czcionki monospace. Do lokalnych fontów dołączono licencje
SIL OFL w `assets/fonts`. Pliki Instrument Serif pozostały po wcześniejszej
wersji; nie są podstawą typografii GARAGE.

Wersja podglądowa zachowuje znacznik `noindex`.
