// configurando Geoloacation
$(document).ready(function () {
  let lat;
  let long;
  let myPlace;
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      const geoCode =

        $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyDSXm9iGOJQqBYzk77OSmbQkqE9NMTTQNI", function (data) {
          myPlace = data.results[4];
        });
      fetch('/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: long
        })
      }).then(res => res.json()).then(data => {
        setWeatherData(data, myPlace.formatted_address)
      })
    })
  else
    console.log('geolocation is not supported')
})

// adcionando coordenadas
const searchElement = document.querySelector('[data-city-search]')
const searchBox = new google.maps.places.SearchBox(searchElement)
searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0]
  if (place == null) return
  const latitude = place.geometry.location.lat()
  const longitude = place.geometry.location.lng()
  fetch('/weather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      latitude: latitude,
      longitude: longitude
    })
  }).then(res => res.json()).then(data => {
    setWeatherData(data, place.formatted_address)
    closeModal()
  })
})

const icon = new Skycons({ color: '#222' })
const locationElement = document.querySelector('[data-location]')
const temperatureElement = document.querySelector('[data-temperature]')
const temperatureMinElement = document.querySelector('[data-temperature-min]')
const temperatureMaxElement = document.querySelector('[data-temperature-max]')
icon.set('icon', 'clear-day')
icon.play()

function setWeatherData(data, place, myPlace) {
  locationElement.textContent = myPlace
  locationElement.textContent = place
  temperatureElement.textContent = Math.floor(data.currently.temperature) + ' Cº'
  temperatureMinElement.textContent = Math.floor(data.daily.data[0].temperatureMin) + ' Cº'
  temperatureMaxElement.textContent = Math.floor(data.daily.data[0].temperatureMax) + ' Cº'
  icon.set('icon', data.currently.icon)
  icon.play()
}

// configurando Modal
document.getElementById('container').addEventListener('click', () => {
  document.querySelector('.modal-container').style.display = 'flex'
  document.querySelector('[data-city-search]').focus()
})
document.getElementById('fecha-modal').addEventListener('click', () => {
  document.querySelector('.modal-container').style.display = 'none'
})

function closeModal() {
  document.querySelector('.modal-container').style.display = 'none'
}