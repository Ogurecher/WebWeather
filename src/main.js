const apiKey = 'ccd71a6330b04e499ef144020190612';
const weatherUrl = 'http://api.worldweatheronline.com/premium/v1/weather.ashx';
const source = document.getElementById('handlebarsTemplate').innerHTML;
const template = Handlebars.compile(source);
const errorTemplate = Handlebars.compile(document.getElementById('errorTemplate').innerHTML);

getWeather=async (event) => {
    event.preventDefault();
    await fetch(weatherUrl+'?key='+apiKey+'&q='+event.target[0].value+'&num_of_days=1&format=json')
    .then(response => response.json())
    .then((data) => {

        if (document.getElementById('outputLayout')) {
            const previousLayout = document.getElementById('outputLayout');
            previousLayout.remove();
        };

        if (data.data.error) {
            /*console.log('error detected');
            console.log({city: event.target[0].value});
            console.log(renderError);*/
            renderError({city: event.target[0].value});
        } else {
            renderContent(formContext(data.data));
        };
    });
};

formContext=(data) => {
    const weather = data.current_condition[0];
    return {
        weatherDesc: weather.weatherDesc[0].value,
        weatherIcon: weather.weatherIconUrl[0].value,
        temperature: weather.temp_C,
        sunrise: data.weather[0].astronomy[0].sunrise,
        sunset: data.weather[0].astronomy[0].sunset,
        rain: data.weather[0].hourly[0].chanceofrain,
        humidity: weather.humidity,
        windDir: weather.winddir16Point,
        windSpd: weather.windspeedKmph,
        sunriseIcon: 'http://icons.iconarchive.com/icons/iconsmind/outline/64/Sunrise-icon.png',
        windIcon: 'https://image.flaticon.com/icons/png/128/184/184971.png'
    };
};

renderContent=(context) => {
    const main = document.getElementById('main');
    const html = template(context);
    const div= document.createElement('div');
    div.innerHTML = html;
    div.id = 'outputLayout';
    div.className = 'outputLayout';

    main.appendChild(div);
};

renderError=(context) => {
    //console.log('entered renderError');
    const main = document.getElementById('main');
    const html = errorTemplate(context);
    const div= document.createElement('div');
    div.innerHTML = html;
    div.id = 'outputLayout';

    main.appendChild(div);
    //bconsole.log('exiting renderError');
};

document.getElementById('inputForm').addEventListener('submit', getWeather);
module.exports = {
    getWeather: getWeather,
    renderContent: renderContent,
    renderError: renderError,
    formContext: formContext,
    template: template,
    errorTemplate: errorTemplate
};