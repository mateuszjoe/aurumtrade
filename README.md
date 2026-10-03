# AurumtradE

Strona AurumtradE z katalogiem samochodów, galeriami zdjęć, filtrami i kontaktem.

Podgląd online: https://mateuszjoe.github.io/aurumtrade/

## Publikacja

GitHub Pages publikuje katalog główny gałęzi `main`. Zmiany wysłane do tej gałęzi
automatycznie aktualizują stronę. Strona jest statyczna i nie wymaga instalowania
zależności ani budowania projektu. Plik `.nojekyll` wyłącza przetwarzanie Jekyll.

`index.html` można otworzyć bezpośrednio w przeglądarce. Wszystkie zdjęcia są lokalne.

## Oferty

Siedem ogłoszeń zweryfikowano 3 października 2026 r. w ofercie
[AurumtradE na OTOMOTO](https://aurumtrade.otomoto.pl/inventory).
Linki do poszczególnych ogłoszeń i informacje o niejednoznacznościach źródła są
w `data/stock.json` oraz w wyświetlanym katalogu.

Import jest jednorazowy. Zmiany cen, dostępności i nowe samochody trzeba aktualizować
w `data/stock.json` oraz `stock.js`. Przeglądarka odczytuje dane z `stock.js`.

Logo, kolorystyka i kontakt pochodzą z
[profilu AurumtradE na Facebooku](https://www.facebook.com/people/AurumtradE/61595070023337/).
Projekt rozwija dostarczony koncept v5. Wersja podglądowa zachowuje znacznik `noindex`.
