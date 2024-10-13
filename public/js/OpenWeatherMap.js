// 1. Eventlistener für das Formular
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    const location = document.getElementById('search-input').value; // Nutzereingabe erhalten

    // Nominatim für Geokodierung verwenden
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;

                // Karte auf den neuen Standort zentrieren
                map.setView([lat, lon], 12); // Zoomstufe 12

                // Aktuelles Wetter und 7-Tage-Vorhersage abrufen
                fetchWeatherData(location, lat, lon); // Funktion aufrufen, um Wetterdaten abzurufen
            } else {
                alert('Ort nicht gefunden. Bitte versuchen Sie es erneut.');
            }
        })
        .catch(error => console.error('Fehler beim Abrufen des Standorts:', error));
});

// 2. Wetterdaten mit Standort, Breite und Länge abrufen
function fetchWeatherData(location, lat, lon) {
    fetch(`/api/weather/${location}`)
        .then(response => response.json())
        .then(weatherData => {
            if (weatherData.cod !== 200) {
                alert('Der Standort wurde nicht gefunden. Bitte versuchen Sie es erneut.');
                return;
            }

            // Relevante Informationen extrahieren
            const currentWeather = {
                temp: weatherData.main.temp,
                feelsLike: weatherData.main.feels_like,
                tempMin: weatherData.main.temp_min,
                tempMax: weatherData.main.temp_max,
                humidity: weatherData.main.humidity,
                pressure: weatherData.main.pressure,
                windSpeed: weatherData.wind.speed,
                windDirection: weatherData.wind.deg,  // Windrichtung hinzufügen
                weatherDescription: weatherData.weather[0].description,
                weatherIcon: weatherData.weather[0].icon,
                sunrise: weatherData.sys.sunrise * 1000,
                sunset: weatherData.sys.sunset * 1000,
                cityName: weatherData.name
            };

            // Benutzeroberfläche aktualisieren
            displayCurrentWeather(currentWeather);

            // Windeffekt auf der Karte anzeigen, wenn Winddaten vorhanden sind
            if (currentWeather.windSpeed > 0) {
                displayWindLayer(lat, lon);
            } else {
                console.log('Keine Winddaten für diesen Standort verfügbar.');
            }
        })
        .catch(error => console.error('Fehler beim Abrufen der Wetterdaten:', error));
}

// 3. Wettermarker auf der Karte hinzufügen
function addWeatherMarker(lat, lon, weather) {
    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`
        <b>${weather.cityName}</b><br>
        <b>:</b> ${Math.round(weather.temp)}°C<br>
        <b>Bedingung:</b> ${weather.weatherDescription}
    `).openPopup();
}

// 4. Wettervorhersage aktualisieren
function updateWeatherForecast(currentWeather, dailyForecast) {
    const currentWeatherDiv = document.getElementById('current-weather');
    currentWeatherDiv.innerHTML = `
        <h4>Aktuelles Wetter</h4>
        <p>Temperatur: ${currentWeather.temp} °C</p>
        <p>Feuchtigkeit: ${currentWeather.humidity}%</p>
        <p>Windgeschwindigkeit: ${currentWeather.windSpeed} m/s</p>
        <p>Druck: ${currentWeather.pressure} hPa</p>
        <img src="img/${currentWeather.weatherIcon}.png" alt="${currentWeather.weatherDescription}" />
        <p>${currentWeather.weatherDescription}</p>
    `;

    const dailyForecastDiv = document.getElementById('daily-forecast');
    dailyForecastDiv.innerHTML = ''; // Vorherigen Inhalt zurücksetzen

    dailyForecast.forEach(day => {
        const date = new Date(day.dt * 1000); // Zeitstempel in Millisekunden umwandeln
        const dayName = date.toLocaleDateString('de-DE', { weekday: 'long' });
        const icon = day.weather[0].icon;

        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-forecast', 'border', 'p-2');
        dayDiv.innerHTML = `
            <h5>${dayName}</h5>
            <p>Temperatur: ${day.temp.day} °C</p>
            <p>Feuchtigkeit: ${day.humidity}%</p>
            <p>Windgeschwindigkeit: ${day.wind_speed} m/s</p>
            <p>Druck: ${day.pressure} hPa</p>
            <img src="img/${icon}.png" alt="${day.weather[0].description}" />
            <p>${day.weather[0].description}</p>
        `;
        
        dailyForecastDiv.appendChild(dayDiv);
    });
}

// 5. Karte mit neuen Wetterdaten aktualisieren
function updateMap(city, currentWeather) {
    const marker = L.marker([currentWeather.lat, currentWeather.lon]).addTo(map);
    marker.bindPopup(`
        <b>${city}</b><br>
        <i class="${getWeatherIcon(currentWeather.weatherDescription)}"></i>
        Temp: ${Math.round(currentWeather.temp)}°C<br>
        Bedingung: ${currentWeather.weatherDescription}
    `).openPopup();

    map.setView([currentWeather.lat, currentWeather.lon], 10); // Zoomstufe 10
}

// 6. Wetter-Icon basierend auf Wetterbedingungen erhalten
function getWeatherIcon(weatherCondition) {
    switch (weatherCondition) {
        case 'Thunderstorm':
            return 'img/icons8-storm-94.png';
        case 'Clear':
            return 'img/icons8-partly-cloudy-day-96.png';
        case 'Clouds':
            return 'img/icons8-cloud-96.png';
        case 'Wind':
            return 'img/icons8-night-wind-96.png';
        default:
            return 'img/default-icon.png';
    }
}

// 7. Stadtkoordinaten mit OpenWeather API abrufen
function fetchCityCoordinates(city) {
    const apiKey = '7ab0049305473ce37d750bba674d3981';
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Stadt nicht gefunden.');
            }
            return response.json();
        })
        .then(data => ({
            lat: data.coord.lat,
            lon: data.coord.lon
        }));
}

// 8. Aktuelles Wetter anzeigen
function displayCurrentWeather(currentWeather) {
    const weatherContainer = document.getElementById('current-weather');
    weatherContainer.innerHTML = `
        <h2>Aktuelles Wetter in ${currentWeather.cityName}</h2>
        <p>Temperatur: ${currentWeather.temp} °C</p>
        <p>Gefühlt wie: ${currentWeather.feelsLike} °C</p>
        <p>Min. Temperatur: ${currentWeather.tempMin} °C</p>
        <p>Max. Temperatur: ${currentWeather.tempMax} °C</p>
        <p>Feuchtigkeit: ${currentWeather.humidity}%</p>
        <p>Druck: ${currentWeather.pressure} hPa</p>
        <p>Windgeschwindigkeit: ${currentWeather.windSpeed} m/s</p>
        <p>Bedingung: ${currentWeather.weatherDescription}</p>
        <img src="https://openweathermap.org/img/wn/${currentWeather.weatherIcon}@2x.png" alt="${currentWeather.weatherDescription}" />
    `;
}

// 9. Automatische Aktualisierung der Wetterdaten alle 5 Minuten
setInterval(() => {
    const location = document.getElementById('search-input').value; // Input abrufen
    if (location) {
        fetchWeatherData(location);
    }
}, 300000); // 300000 ms = 5 Minuten
