const apiKey = '1a7a782e704e44d6a40130524191809';
const weatherUrl = 'http://api.worldweatheronline.com/premium/v1/weather.ashx';
const request = new XMLHttpRequest();
const source = document.getElementById('handlebarsTemplate').innerHTML;
const template = Handlebars.compile(source);
const errorTemplate = Handlebars.compile(document.getElementById('errorTemplate').innerHTML);

getWeather=(city) => {
    city.preventDefault();
    request.open('GET', weatherUrl+'?key='+apiKey+'&q='+city.target[0].value+'&num_of_days=1');
    request.send();

    request.onreadystatechange=(e)=> {
        if (request.responseXML == null) {
            return;
        }

        const previousLayout = document.getElementById('outputLayout');
        if (previousLayout) {
            previousLayout.remove();
        }

        if (request.responseXML.getElementsByTagName('error').length != 0) {
            renderError({city: city.target[0].value});
            return;
        }

        const context = {weatherDesc: request.responseXML.getElementsByTagName('weatherDesc')[0].textContent,
            weatherIcon: request.responseXML.getElementsByTagName('weatherIconUrl')[0].textContent,
            temperature: request.responseXML.getElementsByTagName('temp_C')[0].textContent,
            sunrise: request.responseXML.getElementsByTagName('sunrise')[0].textContent,
            sunset: request.responseXML.getElementsByTagName('sunset')[0].textContent,
            rain: request.responseXML.getElementsByTagName('chanceofrain')[0].textContent,
            humidity: request.responseXML.getElementsByTagName('humidity')[0].textContent,
            windDir: request.responseXML.getElementsByTagName('winddir16Point')[0].textContent,
            windSpd: request.responseXML.getElementsByTagName('windspeedKmph')[0].textContent,
            sunriseIcon: 'http://icons.iconarchive.com/icons/iconsmind/outline/64/Sunrise-icon.png',
            windIcon: 'https://image.flaticon.com/icons/png/128/184/184971.png'};
        
        renderContent(context);
    }
}

renderContent=(context)=> {
    const main = document.getElementById('main');
    const html = template(context);
    const div= document.createElement('div');
    div.innerHTML = html;
    div.id = 'outputLayout';
    div.className = 'outputLayout';

    main.appendChild(div);
}

renderError=(context)=> {
    const main = document.getElementById('main');
    const html = errorTemplate(context);
    const div= document.createElement('div');
    div.innerHTML = html;
    div.id = 'outputLayout';

    main.appendChild(div);
}

document.getElementById('inputForm').addEventListener('submit', getWeather);