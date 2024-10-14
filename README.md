Installation & Setup
Befolge die folgenden Schritte, um die Wetter-App auf deinem lokalen Rechner einzurichten und auszuführen.

Voraussetzungen
Stelle sicher, dass du Folgendes installiert hast:

-Node.js (v14 oder höher)
-npm (Node Package Manager)
-Schritt-für-Schritt Anleitung
-Repository klonen:

-bash
-Code kopieren
-git clone https://github.com/Mariusdeveanu/wtterapp.git
-cd dein-repository
Abhängigkeiten installieren: Führe den folgenden Befehl aus, um alle benötigten Pakete zu installieren:

-bash
-Code kopieren
-npm install
Erstelle eine .env Datei: Im Hauptverzeichnis deines Projekts erstellst du eine .env-Datei mit folgendem Inhalt:

-bash
-Code kopieren
-API_KEY=dein_openweather_api_key
-Ersetze dein_openweather_api_key durch deinen tatsächlichen API-Schlüssel von OpenWeatherMap.

-Starte die Anwendung: Um den Server zu starten, führe folgenden Befehl aus:

-bash
-Code kopieren
npm start
Die Anwendung wird unter der Adresse http://localhost:8080 ausgeführt.

-API-Schlüssel Einrichtung
Du benötigst einen API-Schlüssel von OpenWeatherMap, um Wetterdaten abzurufen. Registriere dich hier, falls du noch keinen API-Schlüssel hast.
Sobald du den Schlüssel hast, füge ihn in deine .env-Datei wie oben gezeigt ein.
Ausführen der Anwendung
Sobald alles eingerichtet ist, wird die Anwendung die Wetterdaten auf deinem lokalen Rechner unter http://localhost:8080 bereitstellen. Du kannst dann den Namen einer Stadt in das Suchformular eingeben, um die Wetterdaten für diesen Ort anzuzeigen.

-Verfügbare Befehle
npm start: Startet den Server und stellt die Anwendung unter http://localhost:8080 bereit.
npm install: Installiert alle Abhängigkeiten, die in der package.json-Datei aufgelistet sind.

<=========================================================================================================================================================================>

# Wetter App - Funktionsübersicht

## Event Listener für Formularübermittlung:

Der Code fügt einen Event Listener zu einem Formular mit der ID `search-form` hinzu.  
Wenn der Benutzer das Formular absendet, wird das Standardverhalten (Formularübermittlung) verhindert und die Benutzereingabe (Standort) abgerufen.

- Eine Geocodierungsanfrage wird an die **Nominatim OpenStreetMap API** gesendet, um die geografischen Koordinaten (Breitengrad und Längengrad) des eingegebenen Standorts zu erhalten.
- Wenn der Standort gefunden wird, wird die Karte auf die Koordinaten zentriert und die Wetterdaten für diesen Standort werden durch den Aufruf der Funktion `fetchWeatherData()` abgerufen.

## Abrufen von Wetterdaten:

Die Funktion `fetchWeatherData()` sendet eine Anfrage an eine Backend-API (`/api/weather/${location}`), um Wetterinformationen basierend auf dem Standortnamen, Breitengrad und Längengrad abzurufen.

Die abgerufenen Wetterdaten umfassen:
- Aktuelle Temperatur
- Windgeschwindigkeit
- Luftdruck
- Luftfeuchtigkeit
- Und mehr...

Die Funktion aktualisiert die Benutzeroberfläche, um das aktuelle Wetter anzuzeigen, und ruft eine Funktion auf, um Winddaten auf der Karte anzuzeigen, falls verfügbar.

## Hinzufügen eines Wettermarkers auf der Karte:

Die Funktion `addWeatherMarker()` erstellt einen Marker auf der Karte an der angegebenen Breite und Länge.  
Dieser zeigt:
- Den Namen der Stadt
- Die Temperatur
- Den Wetterzustand in einem Popup

## Aktualisieren der Wettervorhersage:

Die Funktion `updateWeatherForecast()` aktualisiert den HTML-Inhalt eines Vorhersagebereichs mit den aktuellen Wetterdaten und der täglichen Vorhersage.

- Sie durchläuft die täglichen Vorhersagedaten und erstellt einzelne Vorhersageblöcke für jeden Tag mit Wetterinformationen wie:
  - Temperatur
  - Luftfeuchtigkeit
  - Windgeschwindigkeit
  - Wettersymbole

## Aktualisieren der Karte mit neuen Wetterdaten:

Die Funktion `updateMap()` aktualisiert die Karte, indem ein Marker an den Koordinaten des Standorts hinzugefügt wird.  
Zusätzlich:
- Die Karte wird auf den neuen Standort zentriert
- Es wird auf Zoomstufe 10 gesetzt

## Abrufen von Wettersymbolen basierend auf den Bedingungen:

Die Funktion `getWeatherIcon()` gibt ein Wettersymbol basierend auf den Wetterbedingungen zurück, z. B.:
- Gewitter
- Klarer Himmel
- Wolken

Die Funktion verwendet eine einfache `switch`-Anweisung, um das richtige Symbol für jede Wetterbedingung auszuwählen.

## Abrufen der Stadtkoordinaten mit der OpenWeather API:

Die Funktion `fetchCityCoordinates()` ruft die Koordinaten (Breitengrad und Längengrad) einer Stadt ab, indem eine Anfrage an die **OpenWeather API** gesendet wird.  
Falls die Stadt nicht gefunden wird, löst die Funktion einen Fehler aus.

## Anzeige des aktuellen Wetters:

Die Funktion `displayCurrentWeather()` aktualisiert die Benutzeroberfläche, um die aktuellen Wetterdetails anzuzeigen, darunter:
- Temperatur
- Gefühlte Temperatur
- Minimal- und Maximaltemperatur
- Luftfeuchtigkeit
- Windgeschwindigkeit
- Wettersymbol

## Automatische Wetteraktualisierung alle 5 Minuten:

Der Code enthält einen Intervall-Timer, der die Wetterdaten für den eingegebenen Standort alle 5 Minuten (300.000 Millisekunden) erneut abruft.


<=======================================================================================================================================================================>


app.js
Dies ist der Backend-Servercode für eine Wetteranwendung, die mit Node.js und Express erstellt wurde. Er stellt eine API zur Verfügung, um Wetterdaten von der OpenWeatherMap API abzurufen, und dient als statischer Server für die Bereitstellung von Frontend-Dateien.

Hauptfunktionen:
Express Statischer Server:

Dient statische Dateien wie HTML, CSS und JavaScript aus dem public-Ordner aus. Dadurch wird das Frontend über den Server gehostet.
Haupt-Route (/):

Sendet die Datei index.html an den Client, wenn die Haupt-URL aufgerufen wird.
Wetter-API-Route (/api/weather/:city):

Verarbeitet Anfragen, um Wetterdaten für eine bestimmte Stadt abzurufen.
Verwendet axios, um eine Anfrage an die OpenWeatherMap API zu senden.
Der API-Schlüssel von OpenWeatherMap wird sicher in einer .env-Datei gespeichert und über process.env.API_KEY abgerufen.
Die Route gibt Wetterinformationen im JSON-Format zurück, darunter Temperatur, Windgeschwindigkeit, Luftfeuchtigkeit und mehr.
API-Schlüssel Route (/api/getApiKey):

Stellt den API-Schlüssel bei Bedarf für clientseitige Anfragen zur Verfügung.
Fehlerbehandlung:

Fängt Fehler ab, die beim Abrufen von Wetterdaten auftreten, und gibt eine entsprechende Fehlermeldung zurück.
Server-Initialisierung:

Die Anwendung läuft auf Port 8080 und gibt beim Start eine Meldung mit der URL aus, unter der die Anwendung erreichbar ist (http://localhost:8080).
Dieses Skript bildet die zentrale Backend-Funktionalität zum Abrufen und Bereitstellen von Wetterdaten für das Frontend und nutzt Umgebungsvariablen für sensible Informationen wie API-Schlüssel.
