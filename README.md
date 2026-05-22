# GymSystem - Aplikacja Webowa

Kliencka aplikacja webowa będąca częścią kompleksowego systemu zarządzania siłownią. Projekt obsługuje interfejsy dla różnych ról użytkowników, umożliwiając m.in. zakup karnetów, zarządzanie zajęciami oraz przeglądanie interaktywnej mapy placówek.

---

## Główne Funkcjonalności

Aplikacja dostosowuje swój interfejs i możliwości w zależności od poziomu autoryzacji:

| Rola | Dostępne funkcje |
| :--- | :--- |
| **Gość (Niezalogowany)** | Przeglądanie mapy wszystkich lokalizacji siłowni, dostęp do materiałów marketingowych i opisowych systemu. |
| **Użytkownik (Klient)** | Sprawdzanie statusu i zakup karnetu, przeglądanie pełnego grafiku, zapisywanie się i wypisywanie z zajęć, podgląd podstawowych danych profilu. |
| **Trener** | Tworzenie, edycja i usuwanie własnych zajęć, przeglądanie list uczestników, pełne zarządzanie profilem (specjalizacja, biografia, zdjęcie profilowe). |

---

## Stack Technologiczny

Projekt został zbudowany w oparciu o nowoczesny ekosystem narzędzi frontendowych:

* **Framework:** React 19
* **Język:** TypeScript
* **Narzędzie budujące (Bundler):** Vite
* **Style:** Tailwind CSS 4
* **Routing:** React Router
* **Komunikacja z API:** Axios, SockJS / STOMP (obsługa WebSockets)
* **Mapy:** Leaflet
* **Wielojęzyczność (i18n):** i18next

---

## Struktura Projektu

Główny kod aplikacji znajduje się w katalogu `src`, który utrzymuje podział na logiczne moduły:

* `assets` - Statyczne pliki takie jak obrazy, ikony.
* `components` - Wielokrotnego użytku komponenty UI.
* `context` - Konteksty Reacta zarządzające globalnym stanem aplikacji.
* `hooks` - Niestandardowe hooki z logiką biznesową.
* `locales` - Pliki z tłumaczeniami aplikacji.
* `pages` - Główne widoki/strony przypisane do konkretnych ścieżek w routingu.
* `utils` - Funkcje pomocnicze, formatowanie danych, konfiguracje.

---

## Uruchomienie Lokalne

Aby uruchomić projekt w środowisku deweloperskim, wykonaj poniższe kroki. Wymagane jest posiadanie zainstalowanego środowiska Node.js.

1. Sklonuj repozytorium na swój komputer.
2. Zainstaluj wymagane zależności za pomocą menedżera pakietów:
   ```bash
   npm install
3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ``` 
   Aplikacja będzie domyślnie dostępna pod adresem podanym w konsoli (najczęściej `http://localhost:5173`)
   

## Informacje o wdrożeniu

* **Zmienne środowiskowe:** Aplikacja w obecnej architekturze nie wymaga konfiguracji pliku `.env` po stronie klienta.
* **Wersja produkcyjna:** Aby zbudować zoptymalizowaną wersję aplikacji gotową do wdrożenia, należy użyć polecenia:
    ```bash
    npm run build
    ```