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
const documentGetByIdStub = sinon.stub(global.document, 'getElementById').returns({
  innerHTML() {return ''},
  addEventListener() {return ''},
  appendChild: documentAppendChildSpy
});


describe('getWeather', () => {

  const { getWeather } = require('../main');

  const eventFake = {
    preventDefault: () => '',
    target: [{
      value: ''
    }]
  };

  /*global.fetch = () => {
    return Promise.resolve({error: 'err'});
  };*/

  const { fetch } = require('../main');

  const fetchSpy = sinon.spy(fetch);

  //const fetchStub = sinon.stub(global, 'fetch').returns(fetchSpy);
  
  it('sends API request', () => {

    /*getWeather(eventFake);

    expect(fetchSpy.called).to.equal(true);*/
  });

  it('gets API response', () => {

  });

  it('drops empty responses', () => {

  });

  it('removes previous layout if present', () => {

  });

  it('calls renderError if API response cotains an error', () => {

  });

  it('calls renderContent if OK', () => {

  });
});




describe('renderContent', () => {
  
  const {renderContent} = require("../main.js");

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
    
    renderContent(contextFake);

    expect(compileTemplateSpy.calledWith(contextFake)).to.equal(true);
  });

  it('creates div to render', () => {

    renderContent(contextFake);

    expect(documentCreateElementStub.called).to.equal(true);
  });

  it('appends correct div to document.main', () => {
    const { template } = require('../main');
    const templateFake = template(contextFake);
    const divFake = {
      innerHTML: templateFake,
      id: 'outputLayout',
      className: 'outputLayout'
    };

    renderContent(contextFake);

    expect(documentAppendChildSpy.calledWith(divFake)).to.equal(true);
  });
});




describe('renderError', () => {

  const contextFake = {
    city: ''
  };

  it('inserts city into error message', () => {
    
    renderError(contextFake);

    expect(compileTemplateSpy.calledWith(contextFake)).to.equal(true);
  });

  it('creates div to render', () => {

    renderError(contextFake);

    expect(documentCreateElementStub.called).to.equal(true);
  });

  it('appends correct div to document.main', () => {
    const { errorTemplate } = require('../main');
    const errorTemplateFake = errorTemplate(contextFake);
    const divFake = {
      innerHTML: errorTemplateFake,
      id: 'outputLayout',
      className: 'outputLayout'
    };

    renderError(contextFake);

    expect(documentAppendChildSpy.calledWith(divFake)).to.equal(true);
  });
});




describe('formContext', () => {
  const { formContext } = require('../main');

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

    expect(JSON.stringify(formContext(dataFake))).to.equal(JSON.stringify(contextFake));
  });
});