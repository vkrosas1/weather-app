(function() {

    var app = document.querySelector('#app');
    var cityForm = app.querySelector('.city-form');
    var cityInput = cityForm.querySelector('.city-input');
    var getWeatherButton = cityForm.querySelector('.get-weather-button');
    var cityWeather = app.querySelector('.city-weather');


    var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
    var DARKSKY_API_KEY = '212b57b5b56e5a5c7a982f73187fa411';
    var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  
    var GOOGLE_MAPS_API_KEY = 'AIzaSyDzMKm_amZAJSuZFgTkVlystIf-wzNYSPU';
    var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';


      var icons = new Skycons({ "color": "white" });

      icons.set("icons1", Skycons.CLEAR_DAY);
      icons.set("clear-night", Skycons.CLEAR_NIGHT);
      icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
      icons.set("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
      icons.set("cloudy", Skycons.CLOUDY);
      icons.set("rain", Skycons.RAIN);
      icons.set("sleet", Skycons.SLEET);
      icons.set("snow", Skycons.SNOW);
      icons.set("wind", Skycons.WIND);
      icons.set("fog", Skycons.FOG);

      icons.play(); 
  
      
  
    // THE DARKSKY CURRENT WEATHER
    function getCurrentWeather(coords) {
      var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}`;
  
      return (
        fetch(url)
        .then(response => response.json())
      );
    }

    // THE GOOGLE API WEATHER
    function getCoordinatesForCity(cityName) {
      var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;
  
      return (
        fetch(url)
        .then(response => response.json())
        .then(data => data.results[0].geometry.location)
      );
    }
  

    function getForcastForCity(coords) {
      var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}`;
      return (
        fetch(url)
        .then(response => response.json())
      );
    }

    // DOM stuff
    cityForm.addEventListener('submit', function(event) {
      event.preventDefault(); // prevent the form from submitting
      cityWeather.innerText = "Loading..."; 

      var city = cityInput.value;
      
   


      getCoordinatesForCity(city)
      .then(getCurrentWeather) // the one from darksky --> to go from currently to data
      .then(function(data) {
        var weather = data.currently
        console.log(data)

        // converter to get it all in the correct format
        var icons = new Skycons({ "color": "white" });
        var converter = {
          'partly-cloudy-day': Skycons.PARTLY_CLOUDY_DAY,
          'partly-cloudy-night': Skycons.PARTLY_CLOUDY_NIGHT,
          'clear-day': Skycons.CLEAR_DAY,
          'clear-night': Skycons.CLEAR_NIGHT,
          'cloudy': Skycons.CLOUDY, 
          'rain': Skycons.RAIN, 
          'sleet':Skycons.SLEET, 
          'snow': Skycons.SNOW, 
          'wind': Skycons.WIND, 
          'fog':Skycons.FOG 

        }
        icons.set("myIcon", converter[data.currently.icon]);
        icons.play(); 
        

        var calculation = Math.round(weather.temperature - 32 * (5/9)); 
         // data.daily.weather
          // look at weather api to see if the things are different -- change here for currently 
        cityWeather.innerHTML = "<p>The following information is for " + city+ ": </p>" +'<p>Current temperature: ' + Math.round(weather.temperature) + '°F | ' + calculation + '°C</p>' + 
        '\n' + '<p>Current Wind Speed: ' + weather.windSpeed + ' mph</p>'  + 
        '<p>Current Visibility: ' +  weather.visibility + '</p>' + 
        '<p>Current Storm Distance: ' + weather.nearestStormDistance + ' miles</p>' +
        '<p>Weather Summary: ' + weather.summary + '</p>';



        var forecastDiv = document.getElementById("forecast")

        var fiveDays = data.daily.data; 
        for (i = 0; i < 5; i++) { 
          var dayDiv = document.createElement('div')
          
          dayDiv.className = "day"

          var dayValue = document.createTextNode("Forecast for Day " + fiveDays[i]+ ":");
          var textNodeHigh = document.createTextNode("Temperature High: "+ Math.round(fiveDays[i].temperatureHigh) + '°F' )
          var spacing = document.createTextNode('\n');
          var textNodeLow = document.createTextNode("Temperature Low: "+Math.round(fiveDays[i].temperatureLow) + '°F' )

          
       
          dayDiv.appendChild(textNodeHigh);
          dayDiv.appendChild(spacing);
          dayDiv.appendChild(textNodeLow);
          forecastDiv.appendChild(dayDiv)

          
          // console.log({data: fiveDays[i]})

          // document.getElementById("myP").style.font = "italic bold 20px arial,serif";  



          

        } // end of for loop 
    

      })// end of getCoordinatesForCity 







      
    });// end of EventListener

  })();

  





