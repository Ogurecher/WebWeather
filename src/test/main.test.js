const chai = require("chai");
const sinon = require("sinon");
const handlebars = require("handlebars");
const expect = chai.expect;


global.document = {
  getElementById: (arg) => {
    return {
      innerHTML: () => '',
      addEventListener: () => '',
      appendChild: () => ''
    };
  },
  createElement: (arg) => {
    return {
      innerHTML: '',
      id: '',
      className: ''
    };
  }
};

global.Handlebars = {
  compile: (arg) => {
    return (context) => context
  }
};

const compileTemplateFake = (context) => context;
const compileTemplateSpy = sinon.spy(compileTemplateFake);
const handlebarsCompileStub = sinon.stub(global.Handlebars, 'compile').returns(compileTemplateSpy);

const documentCreateElementStub = sinon.stub(global.document, 'createElement').returns({
  innerHTML: '',
  id: '',
  className: ''
});

const documentAppendChildSpy = sinon.spy();
const removeSpy = sinon.spy();
const documentGetByIdStub = sinon.stub(global.document, 'getElementById').returns({
  innerHTML() {return ''},
  addEventListener() {return ''},
  appendChild: documentAppendChildSpy,
  remove: removeSpy
});

const mainjs = require('../main.js');



describe('getWeather', () => {

  const renderContentSpy = sinon.spy(mainjs, 'renderContent');
  global.renderContent = renderContentSpy;

  const renderErrorSpy = sinon.spy(mainjs, 'renderError');
  global.renderError = renderErrorSpy;

  const fetchMock = require('fetch-mock');
  const fetchSpy = sinon.spy(fetchMock);

  const correctResponse = {
    data: {
      current_condition: [{
        weatherDesc: [{
          value: ''
        }],
        weatherIconUrl: [{
          value: ''
        }],
        temp_C: '',
        humidity: '',
        winddir16Point: '',
        windspeedKmph: ''
      }],
      weather: [{
        astronomy: [{
          sunrise: '',
          sunset: ''
        }],
        hourly: [{
          chanceofrain: ''
        }]
      }]
    }
  };

  const errorResponse = {
    data: {
      error: '404'
    }
  };

  const targetFake = [{
      value: 'london'
  }];
  
  it('sends API request', async () => {

    fetchMock.get('*', correctResponse);

    await mainjs.getWeather(targetFake);

    expect(fetchSpy.called()).to.equal(true);
    fetchMock.reset();
  });

  it('removes previous layout if present', async () => {

    fetchMock.get('*', correctResponse);

    await mainjs.getWeather(targetFake);

    fetchMock.reset();
    expect(removeSpy.called).to.equal(true);
  });

  it('calls renderContent if OK', async () => {

    fetchMock.get('*', correctResponse);
    
    const {formContext} = require('../main.js');
    const context = formContext(correctResponse.data);

    await mainjs.getWeather(targetFake);
    
    fetchMock.reset();
    expect(renderContentSpy.calledWith(context)).to.equal(true);
  });

  it('calls renderError if API response contains an error', async () => {

    fetchMock.get('*', errorResponse);
    
    await mainjs.getWeather(targetFake);

    fetchMock.reset();
    expect(renderErrorSpy.called).to.equal(true);
  });
});




describe('renderContent', () => {

  const contextFake = {
    weatherDesc: '',
    weatherIcon: '',
    temperature: '',
    sunrise: '',
    sunset: '',
    rain: '',
    humidity: '',
    windDir: '',
    windSpd: '',
    sunriseIcon: 'http://icons.iconarchive.com/icons/iconsmind/outline/64/Sunrise-icon.png',
    windIcon: 'https://image.flaticon.com/icons/png/128/184/184971.png'
  };
  
  it('compiles Handlebars template with provided context', () => {
    
    mainjs.renderContent(contextFake);

    expect(compileTemplateSpy.calledWith(contextFake)).to.equal(true);
  });

  it('creates div to render', () => {

    mainjs.renderContent(contextFake);

    expect(documentCreateElementStub.called).to.equal(true);
  });

  it('appends correct div to document.main', () => {

    const templateFake = mainjs.template(contextFake);
    const divFake = {
      innerHTML: templateFake,
      id: 'outputLayout',
      className: 'outputLayout'
    };

    mainjs.renderContent(contextFake);

    expect(documentAppendChildSpy.calledWith(divFake)).to.equal(true);
  });
});




describe('renderError', () => {

  const contextFake = {
    city: ''
  };

  it('inserts city into error message', () => {
    
    mainjs.renderError(contextFake);

    expect(compileTemplateSpy.calledWith(contextFake)).to.equal(true);
  });

  it('creates div to render', () => {

    mainjs.renderError(contextFake);

    expect(documentCreateElementStub.called).to.equal(true);
  });

  it('appends correct div to document.main', () => {

    const errorTemplateFake = mainjs.errorTemplate(contextFake);
    const divFake = {
      innerHTML: errorTemplateFake,
      id: 'outputLayout',
      className: 'outputLayout'
    };

    mainjs.renderError(contextFake);

    expect(documentAppendChildSpy.calledWith(divFake)).to.equal(true);
  });
});




describe('formContext', () => {

  const contextFake = {
    weatherDesc: '',
    weatherIcon: '',
    temperature: '',
    sunrise: '',
    sunset: '',
    rain: '',
    humidity: '',
    windDir: '',
    windSpd: '',
    sunriseIcon: 'http://icons.iconarchive.com/icons/iconsmind/outline/64/Sunrise-icon.png',
    windIcon: 'https://image.flaticon.com/icons/png/128/184/184971.png'
  };

  const dataFake = {
    current_condition: [{
      weatherDesc: [{
        value: ''
      }],
      weatherIconUrl: [{
        value: ''
      }],
      temp_C: '',
      humidity: '',
      winddir16Point: '',
      windspeedKmph: ''
    }],
    weather: [{
      astronomy: [{
        sunrise: '',
        sunset: ''
      }],
      hourly: [{
        chanceofrain: ''
      }]
    }]
  };

  it('returns correct context', () => {

    expect(JSON.stringify(mainjs.formContext(dataFake))).to.equal(JSON.stringify(contextFake));
  });
});
