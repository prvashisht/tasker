let jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const constants = require('./constants'); // for now, constants.js contains just as hash global_keys_hash to mimic tasker's global variables

let global_keys_hash = constants.global_keys_hash;
jQuery = require('jquery')(window);

exports.jQuery = jQuery;


const local_keys_hash = {};

exports.global = (key) => {
  return global_keys_hash[key];
}

exports.setLocal = (key, value) => {
  local_keys_hash[key] = value;
  console.log('setting local', key, 'as', value);
  return { ...local_keys_hash };
}

exports.flash = (text) => {
  console.log('flashing.. ', text);
}

exports.exit = () => {
  console.log('exiting js');

  console.log('local keys are')
  console.log(JSON.stringify(local_keys_hash));
}

exports.dummy_notification = `Todoist: do work number ${Math.floor(Math.random() * 100000)}
tod
`;
