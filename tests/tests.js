'use strict';

const assert = require('assert').strict;
const {
  createNewGraph,
  add,
  link,
  select,
  getLinked,
  showGraph,
  saveToFile,
  getGraphFromFile,
  deleteVertex,
  deleteGraph,
  deleteLinks,
  modifyVertex,
  isSaved,
} = require('../src/graphMethods.js');

const graph = createNewGraph('people', 'name');
const firstVertex = add('name: Dima, age: 19', 'person');
const secondVertex = add('name: Kirill, age: 18', 'person');
assert.strictEqual(
  firstVertex.data[graph.keyField],
  'Dima',
  'Function add() does not work properly'
);


link('Dima', 'Kirill', 'friends');
const firstVertexLink = firstVertex.links[0];
const secondVertexLink = secondVertex.links[0];

assert.strictEqual(
  firstVertexLink.linkName,
  secondVertexLink.linkName,
  'Function link() does not work properly'
);
