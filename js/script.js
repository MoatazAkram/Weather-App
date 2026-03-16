
let finalData = []

let degLocation;
let currentDeg;
let timeout;
let lastCity;

let searchInput = document.getElementById('search')

searchInput.addEventListener("input", function(){
  clearTimeout(timeout)

  if(searchInput.value.length === 0){
  if(lastCity){
    getWeather(lastCity)
  }
  return
}
  
 timeout = setTimeout(function() {
   let cityValue = searchInput.value
   if(cityValue.length >= 3){
    getWeather(cityValue)
   }
 }, 300);

})

 document.getElementById('searchBtn').addEventListener("click", function(){
  let cityValue = searchInput.value
  if(cityValue.length >= 3){
    getWeather(cityValue)
  }
 })

async function getWeather(city){

  showLoading()

   try {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=658cee358af142ee86b24554261403&q=${city}&days=3`)

    if(!response.ok){
      showError('City not found, please try again.')
      return
    }
   let data = await response.json()

   currentDeg = data.current
   
   degLocation = data.location
   
   finalData = data.forecast.forecastday
   lastCity = city;

   displayWeather()

   } catch (error) {

    showError('Something wrong, check your connection.')
   }  
     
}

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(function(position){
    let lat = position.coords.latitude
    let lon = position.coords.longitude

     lastCity = `${lat},${lon}`
    getWeather(lastCity)
    setInterval(()=>{
      getWeather(lastCity)
    } , 30 * 60 * 1000)

  }, function(){
    lastCity = "cairo"
    getWeather(lastCity)
      setInterval(()=>{
      getWeather(lastCity)
    } , 30 * 60 * 1000)
  })
}

function showLoading(){
  const container = document.querySelector('.forecast-container')
  container.classList.add('container-centered')
  container.innerHTML = `
  <div class="sk-chase">
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
  </div>
  `
}

function showError(message){
  const container = document.querySelector('.forecast-container')
  container.classList.add('container-centered')
  container.innerHTML = `
  <P class = "alert alert-danger p-3">${message}</P>
  `

}


function displayWeather(){

  const container = document.querySelector('.forecast-container')
  container.classList.remove('container-centered')
  
   let weatherData = ``

   for(let i =0; i<finalData.length; i++){
    const day = finalData[i]
    const dateobj = new Date(day.date)
    const dayName = dateobj.toLocaleDateString('en-US', {weekday: "long"})
    const dayNumberMonth = dateobj.toLocaleDateString('en-US', {day: "numeric", month: "short"})
   
       weatherData += `
                   <div class="forecast ${i === 0 ? 'today' : i === 1 ? 'tomorrow' : 'after-tomorrow'}">
        <div class="forecast-header">
                ${i === 0 ? `<div class="date">${dayName}</div>
                <div class="date">${dayNumberMonth}</div>` : ` <div class="date">${dayName}</div>` }
              </div>
              <div class="forecast-content">
                ${i === 0 ? `<h5 class="city">${degLocation.name}</h5>` : " "}
                <div class="degree">
                  ${ i === 0 ? `<div class="num">${currentDeg.temp_c}°C</div>
                  <img
                    class="forecast-icon"
                    src="${currentDeg.condition.icon}"
                    alt=""
                  /> ` : `  <img
                    class="forecast-icon"
                    src="${day.day.condition.icon}"
                    alt=""
                  /> 
                  <div class="num">${day.day.maxtemp_c}°C</div> `}
  
                </div>
                <small> ${day.day.mintemp_c}°C </small>
                <p class="custom">${day.day.condition.text}</p>
                ${i === 0 ? `<div class="details">
                  <span>
                    <img src="./images/icon-umberella.png" alt="" />
                    ${day.day.daily_chance_of_rain}%
                  </span>
                  <span>
                    <img src="./images/icon-wind.png" alt="" />
                    ${currentDeg.wind_kph}km/h
                  </span>
                  <span>
                    <img src="./images/icon-compass.png" alt="" />
                    ${currentDeg.wind_dir}
                  </span>
                </div> ` : " "}
              </div>
            </div>

         `
   }
   
            document.querySelector('.forecast-container').innerHTML= weatherData
}