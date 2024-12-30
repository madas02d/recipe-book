
export async function getWeatherData (){
    const weatherDiv = document.querySelector('.weather')

    const url ="https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"

    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log(data);
        getData(data)
    } catch (error) {
        console.log('Network Error :',error);
    }
    // console.log(weatherDiv);
}

function getData(unit){
    const temperature = document.querySelector('.temp')
    
    temperature.textContent =''
    temperature.textContent = `${unit.current.temperature_2m} °C `
    console.log(unit.current.temperature_2m);

    getCity(unit.latitude,unit.longitude)

}

async function getCity(latitude,longitude) {
    const loc = document.querySelector('.location')
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    
    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log(data);
        const city = data.display_name.split(',')
        console.log(city[2]);
        loc.textContent =''
        loc.textContent = `${city[2]} `;
        
    } catch (error) {
        console.log('Network Error :',error);
    }
}