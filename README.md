# 🌐 GymSystem Web App
Webowa część systemu zarządzania siłownią realizowana w ramach projektu ZMP. Aplikacja stanowi responsywne centrum obsługi dla klientów siłowni oraz panel operacyjny dla kadry trenerskiej.

## 🛠 Tech Stack & Wersje
* **Framework**: React 19.2.0
* **Build Tool**: Vite 7.3.1
* **Język**: TypeScript 5.9.3
* **Komunikacja API**: Axios (obsługa zapytań REST, interceptory JWT)
* **Stylizacja**: Tailwind CSS

## 🚀 Funkcjonalności (Roadmap)
Na podstawie analizy wymagań, aplikacja realizuje następujące moduły:

**🔐 Autoryzacja i Dostęp**
* Kompletny system logowania i rejestracji.
* Logowanie przez zewnętrzne serwisy (oAuth).
* Procedura resetowania zapomnianego hasła.
* Wybór wersji językowej interfejsu.

**👤 Panel Użytkownika (Klient)**
* **Profil**: Zarządzanie danymi użytkownika i status karnetu.
* **Harmonogram**: Pełny podgląd grafiku zajęć w ujęciu miesięcznym.
* **Karnety**: Przegląd dostępnych pakietów, cenników oraz dodatkowych benefitów.
* **Mapa**: Interaktywna lokalizacja placówek siłowni.

**🏋️ Panel Trenera**
* Dedykowany interfejs dla kadry zarządzającej treningami.
* **Zarządzanie zajęciami**: Możliwość przekładania oraz odwoływania treningów.
* Dostęp do szczegółowych informacji o grupach i uczestnikach.

**ℹ️ Informacje i Content**
* Sekcja "O nas": Galeria zdjęć obiektu oraz informacje o siłowni.
* Lista trenerów: Prezentacja kadry wraz z opisami kompetencji.
* Rozszerzone informacje o wszystkich usługach systemu.