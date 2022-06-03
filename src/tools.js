'use strict';

const vm = require('vm');

const deserialize = (src) =>
  vm.createScript('({' + src + '})').runInThisContext();

const removeFromArray = (array, value) => {
  if (array.includes(value)) {
    const index = array.indexOf(value);
    array.splice(index, 1);
  }
};

const errorAlert = (message) => console.log('\x1b[31m', message, '\x1b[0m');

const isNumber = (value) =>
  Number(value).toString() !== value ? `'${value}'` : value;

const checkInput = (line) => {
  const commas = (line.match(/,/g) || []).length;
  const colons = (line.match(/:/g) || []).length;
  if (colons - commas !== 1) {
    errorAlert('Bad input');
    return false;
  } else if (line.match(/['"]/g)) {
    errorAlert('Please enter without quotes');
    return false;
  }
  return true;
};

const addQuotes = (line) => {
  const result = [];
  const entries = line.replaceAll(' ', '').split(',');
  for (const entry of entries) {
    const data = entry.split(':');
    data[1] = isNumber(data[1]);
    result.push(data.join(':'));
  }
  return result.join(',');
};

module.exports = {
  deserialize,
  removeFromArray,
  errorAlert,
  checkInput,
  addQuotes,
};
