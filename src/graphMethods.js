'use strict';

const fs = require('fs');
const {
  deserialize,
  alert,
  checkInput,
  addQuotes,
} = require('./tools.js');

const modifyVertex = (link, newData) => {
  if (!checkInput(newData)) return;
  const modificator = deserialize(addQuotes(newData));
  const vertex = graph.vertices.get(link);
  const keyField = graph.keyField;

  if (graph.vertices.has(modificator[keyField]))
    return alert('red', 'Vertex with this key field is already exists');

  for (const [key, value] of Object.entries(modificator)) {
    if (Object.prototype.hasOwnProperty.call(vertex.data, key)) {
      if (vertex.data[key] !== modificator[key])
        vertex.data[key] = modificator[key];
    } else vertex.data[key] = value;
  }
  if (link !== vertex.data[keyField]) {
    graph.renameKey(link, vertex.data[keyField], vertex);
  }
};

const isSaved = () => {
  if (!graph.directory) return false;
  const vertices = Object.fromEntries(graph.vertices);
  const verticesData = JSON.stringify(vertices);
  const fileData = fs.readFileSync(graph.directory, 'utf-8');
  if (fileData !== verticesData) return false;
  return true;
};

module.exports = {
  modifyVertex,
  isSaved,
};
