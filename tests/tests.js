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
  setGraph,
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

const selected = select('age: 18');
const selectedData = selected[0].data;
assert.strictEqual(
  selectedData.name,
  'Kirill',
  'Function link() does not work properly',
);

const linked = getLinked('Dima');
const linkedData = linked[0].data;
assert.strictEqual(
  linkedData.name,
  'Kirill',
  'Function link() does not work properly',
);

saveToFile('people');
deleteGraph('people');
assert.strictEqual(
  graph.vertices.size,
  0,
  'Function deleteGraph() does not work properly'
);


setGraph('people', 'name');
add('name: Misha, age: 18', 'person');

showGraph();
