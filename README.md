# AurumtradE

Strona AurumtradE z autorskim znakiem, katalogiem samochodów, galeriami zdjęć,
filtrami, listą ulubionych i kontaktem. Nazwa firmy pozostaje bez zmian.

Podgląd online: https://mateuszjoe.github.io/aurumtrade/

## Publikacja

GitHub Pages publikuje katalog główny gałęzi `main`. Zmiany wysłane do tej gałęzi
automatycznie aktualizują stronę. Strona jest statyczna i nie wymaga instalowania
zależności ani budowania projektu. Plik `.nojekyll` wyłącza przetwarzanie Jekyll.

`index.html` można otworzyć bezpośrednio w przeglądarce. Zdjęcia oraz fonty są lokalne.
Układ i animacje są w `design.css`, reguły responsywne w `responsive.css`,
a obsługa katalogu w `app.js`. Animacje respektują ustawienie ograniczonego ruchu.
Ulubione działają w pamięci bieżącej karty; odświeżenie strony zeruje listę.

## Oferty

Siedem ogłoszeń zweryfikowano 3 października 2026 r. w ofercie
[AurumtradE na OTOMOTO](https://aurumtrade.otomoto.pl/inventory).
Linki do poszczególnych ogłoszeń i informacje o niejednoznacznościach źródła są
w `data/stock.json` oraz w wyświetlanym katalogu.

Import jest jednorazowy. Zmiany cen, dostępności i nowe samochody trzeba aktualizować
w `data/stock.json` oraz `stock.js`. Przeglądarka odczytuje dane z `stock.js`.

Na zdjęciu Sprintera znajduje się oznaczenie SPRZEDANY, choć jego ogłoszenie
pozostaje widoczne. Karta i szczegóły wskazują konieczność potwierdzenia dostępności.

Nazwa firmy, wyjściowe inspiracje kolorystyczne i kontakt pochodzą z
[profilu AurumtradE na Facebooku](https://www.facebook.com/people/AurumtradE/61595070023337/).
Nowy znak SVG jest w `assets/aurumtrade-symbol.svg`, a wersja z nazwą w
`assets/aurumtrade-logo.svg`. Fonty Manrope i Instrument Serif mają dołączone
licencje SIL OFL w `assets/fonts`. Wersja podglądowa zachowuje znacznik `noindex`.
