'use strict';

const vm = require('vm');

const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
};

const alert = (color, message) => {
  console.log(COLORS[color], message, '\x1b[0m');
};

const deserialize = (src) =>
  vm.createScript('({' + src + '})').runInThisContext();

const removeFromArray = (array, value) => {
  if (array.includes(value)) {
    const index = array.indexOf(value);
    array.splice(index, 1);
  }
};

const specifyType = (value) => {
  const reg = new RegExp('^[0-9]+$');
  if (reg.test(value)) return Number(value);
  return '\'' + value + '\'';
};

const checkInput = (line) => {
  const commas = (line.match(/,/g) || []).length;
  const colons = (line.match(/:/g) || []).length;
  if (colons - commas !== 1) {
    alert('red', 'Bad input');
    return false;
  } else if (line.match(/['"]/g)) {
    alert('red', 'Please enter without quotes');
    return false;
  }
  return true;
};

const addQuotes = (line) => {
  const result = [];
  const entries = line.replaceAll(' ', '').split(',');
  for (const entry of entries) {
    const data = entry.split(':');
    data[1] = specifyType(data[1]);
    result.push(data.join(':'));
  }
  return result.join(',');
};

module.exports = {
  deserialize,
  removeFromArray,
  alert,
  checkInput,
  addQuotes,
};
