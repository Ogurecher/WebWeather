const apiKey = "1a7a782e704e44d6a40130524191809";
const weatherUrl = "http://api.worldweatheronline.com/premium/v1/weather.ashx";
const request = new XMLHttpRequest();
const source = document.getElementById("handlebarsTemplate").innerHTML;
const template = Handlebars.compile(source);

getWeather=(city) => {
    const badResponseCounter = 0;
    request.open("GET", weatherUrl+"?key="+apiKey+"&q="+city+"&num_of_days=1");
    request.send();
    
    request.onreadystatechange=(e)=> {
        if (request.responseXML.getElementsByTagName("error").length != 0) {
            alert("Please enter a correct location name");
            return;
        }
        const previousLayout = document.getElementById("outputLayout");
        if (previousLayout) {
            previousLayout.remove();
        }
        console.log(request.response);

        const main = document.getElementById("main");

        const context = {weatherDesc: request.responseXML.getElementsByTagName("weatherDesc")[0].textContent,
            weatherIcon: request.responseXML.getElementsByTagName("weatherIconUrl")[0].textContent,
            temperature: request.responseXML.getElementsByTagName("temp_C")[0].textContent,
            sunrise: request.responseXML.getElementsByTagName("sunrise")[0].textContent,
            sunset: request.responseXML.getElementsByTagName("sunset")[0].textContent,
            rain: request.responseXML.getElementsByTagName("chanceofrain")[0].textContent,
            humidity: request.responseXML.getElementsByTagName("humidity")[0].textContent,
            windDir: request.responseXML.getElementsByTagName("winddir16Point")[0].textContent,
            windSpd: request.responseXML.getElementsByTagName("windspeedKmph")[0].textContent,
            sunriseIcon: "http://icons.iconarchive.com/icons/iconsmind/outline/64/Sunrise-icon.png",
            windIcon: "https://image.flaticon.com/icons/png/128/184/184971.png"}
        const html = template(context);
        const wrapper= document.createElement('div');
        wrapper.innerHTML = html;
        const div= wrapper.firstChild;
        div.id = "outputLayout";

        main.appendChild(div);
    }
    
}