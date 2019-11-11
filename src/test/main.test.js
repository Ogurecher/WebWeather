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

const contextMock = {};

let spy = sinon.spy(console, 'log');

describe('getWeather', () => {
  it('at least starts', () => {

    const {getWeather} = require("../main.js");

    getWeather(eventMock);

    assert(spy.calledWith('getWeather'));
  })
});

describe('renderContent', () => {
  it('at least starts', () => {
    

    const {renderContent} = require("../main.js");

    renderContent(responseXMLMock);

    assert(spy.calledWith('renderContent'));
  })
});

describe('renderError', () => {
  it('at least starts', () => {

    const {renderError} = require("../main.js");

    renderError(contextMock);

    assert(spy.calledWith('renderError'));
  })
});