const apiKey = "1a7a782e704e44d6a40130524191809";
const weatherUrl = "http://api.worldweatheronline.com/premium/v1/weather.ashx";
const request = new XMLHttpRequest();

getWeather=(city) => {
    console.log(city);
    request.open("GET", weatherUrl+"?key="+apiKey+"&q="+city);
    request.send();
    request.onreadystatechange=(e)=> {
        const main = document.getElementById("main");
        const outputLayout = document.createElement("div");
        outputLayout.className = "outputLayout";
        const weatherDescription = document.createElement("div");
        /*weatherDescription.className = "weatherDescription";
        const descriptionText = document.createTextNode(request.responseXML.getElementsByTagName("current_condition"));
        const descriptionText2 = descriptionText.getElementsByTagName("weatherdesc");
        weatherDescription.appendChild(descriptionText);

        main.appendChild(outputLayout);
        outputLayout.appendChild(weatherDescription);*/

        console.log(request.responseXML.getElementsByTagName("weatherDesc")[0]);
        /*console.log(descriptionText2);*/
    }
}