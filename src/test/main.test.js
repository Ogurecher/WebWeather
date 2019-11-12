const chai = require("chai");
const sinon = require("sinon");
const handlebars = require("handlebars");
const assert = require("assert");
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
      innerHTML: () => ''
    };
  }
};

global.Handlebars = {
  compile: (arg) => {
    return (context) => ''
  }
};

const responseXMLMock = {
  getElementsByTagName: (arg) => {
    return [{
      textContent: ''
    }];
  }
};

class XMLHttpRequestStub {
  XMLHttpRequestStub() {
    this.responseXML = responseXMLMock;
  };
  open(arg1, arg2){ return '';};
  send(){ return '';};
};

global.XMLHttpRequest = XMLHttpRequestStub;

const eventMock = {
  preventDefault: () => '',
  target: [{
    value: ''
  }]
};



const spy = sinon.spy(console, 'log');

describe('getWeather', () => {
  it('at least starts', () => {
    const {getWeather} = require("../main.js");

    getWeather(eventMock);

    assert(spy.calledWith('getWeather'));
  });

  it('sends API request', () => {

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

  it('at least starts', () => {
    renderContent(responseXMLMock);

    assert(spy.calledWith('renderContent'));
  });
  
  it('populates context', () => {
    const { template } = require('../main');
    const spyTemplate = sinon.spy(template);

    const contextMock = {
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

    const responseXMLMock = {
      getElementsByTagName: (name) => eval(`responseXMLMock.${name}`),
      weatherDesc: [{textContent: ''}],
      weatherIconUrl: [{textContent: ''}],
      temp_C: [{textContent: ''}],
      sunrise: [{textContent: ''}],
      sunset: [{textContent: ''}],
      chanceofrain: [{textContent: ''}],
      humidity: [{textContent: ''}],
      winddir16Point: [{textContent: ''}],
      windspeedKmph: [{textContent: ''}]
    };

    renderContent(responseXMLMock);

    assert(spyTemplate.called);
    //assert(spy.calledWith(contextMock));
  });

  it('creates div to render', () => {

  });

  it('appends div to document.main', () => {

  });
});

describe('renderError', () => {
  it('at least starts', () => {
    const {renderError} = require("../main.js");

    const contextMock = {};

    renderError(contextMock);

    assert(spy.calledWith('renderError'));
  });

  it('creates div to render', () => {

  });

  it('appends div to document.main', () => {

  });
});