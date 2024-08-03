var weatherApi = "/weather";
const weatherForm = document.querySelector("form");

const search = document.querySelector("input");

const weatherIcon = document.querySelector(".weatherIcon i");

const weatherCondition = document.querySelector(".weatherCondition");

const tempElement = document.querySelector(".temperature span");

const locationElement = document.querySelector(".place");

const dateElement = document.querySelector(".date");
const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleString("en-US", options);
dateElement.textContent = new Date().getDate() + ", " + monthName;

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log(search.value);
  locationElement.textContent = "Loading...";
  weatherIcon.className = "";
  tempElement.textContent = "";
  weatherCondition.textContent = "";

  showData(search.value);
});

if("geolocation" in navigator) {
    locationElement.textContent = "Loading...";
    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
            
            fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
            if (data && data.address && data.address.city) {
                const city = data.address.city;

                showData(city);
            }
            else {
                console.error("City not found in location data.");
            }
            })
            .catch((error) => {
            console.error("Error fetching location data:", error);
            });
        },
        function (error) {
        console.error("Error getting location:", error.message);
        }
    );
} else {
  console.error("Geolocation is not available in this browser.");
}

  // function showData(city) {
  //   getWeatherData(city, (result) => {
  //     //console.log(result); 
  //     if(result.cod == 200) {
  //       weatherIcon.className = "wi wi-day-cloudy";
  //       locationElement.textContent = result?.name + ", " + result?.sys.country;
  //       tempElement.textContent = (result?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176) + "C";
  //       weatherCondition.textContent = result?.weather[0]?.description?.toUpperCase();
  //     }
  //     else {
  //       locationElement.textContent = "City not found";
  //     }
  //   });
  // }
  
  function showData(city) {
    getWeatherData(city, (result) => {
        // console.log(result);
        if (result.cod == 200) {
            const weatherDescription = result?.weather[0]?.description?.toLowerCase();
            const iconClass = getWeatherIconClass(weatherDescription);

            weatherIcon.className = `wi ${iconClass}`;
            locationElement.textContent = `${result?.name}, ${result?.sys.country}`;
            tempElement.textContent = `${(result?.main?.temp - 273.5).toFixed(2)}${String.fromCharCode(176)}C`;
            weatherCondition.textContent = weatherDescription?.toUpperCase();
        } else {
            locationElement.textContent = "City not found";
        }
    });
}

function getWeatherIconClass(description) {
    const weatherIcons = {
        'clear sky': 'wi-day-sunny',
        'few clouds': 'wi-day-cloudy',
        'scattered clouds': 'wi-cloud',
        'broken clouds': 'wi-cloudy',
        'shower rain': 'wi-showers',
        'rain': 'wi-rain',
        'thunderstorm': 'wi-thunderstorm',
        'snow': 'wi-snow',
        'mist': 'wi-fog',
        'overcast clouds': 'wi-day-cloudy',
        'light rain': 'wi-hail',
        'moderate rain': 'wi-hail',
        'heavy intensity rain': 'wi-rain',
        'haze': 'wi-day-haze',
        'fog': 'wi-day-fog'
        // Add more mappings as needed
    };

    return weatherIcons[description] || 'wi-na'; // Default to 'wi-na' if description not found
}

  function getWeatherData(city, callback) {
    const locationApi = weatherApi + "?address=" + city;
    fetch(locationApi).then((response) => {
      response.json().then((response) => {
        callback(response);
      });
    });
  }