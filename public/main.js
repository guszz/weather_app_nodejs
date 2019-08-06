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
  })
})

const icon = new Skycons({ color: '#222' })
const locationElement = document.querySelector('[data-location]')
const temperatureElement = document.querySelector('[data-temperature]')
const temperatureMinElement = document.querySelector('[data-temperature-min]')
const temperatureMaxElement = document.querySelector('[data-temperature-max]')
icon.set('icon', 'clear-day')
icon.play()

function setWeatherData(data, place) {
  locationElement.textContent = place
  temperatureElement.textContent = Math.floor(data.currently.temperature) + ' Cº'
  temperatureMinElement.textContent = Math.floor(data.daily.data[0].temperatureMin) + ' Cº'
  temperatureMaxElement.textContent = Math.floor(data.daily.data[0].temperatureMax) + ' Cº'
  icon.set('icon', data.currently.icon)
  icon.play()
}