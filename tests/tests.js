'use strict';

const assert = require('assert').strict;
const { alert } = require('../src/tools.js');
const {
  createNewGraph,
  add,
  link,
  select,
  getLinked,
  deleteVertex,
  deleteGraph,
  deleteLinks,
  modifyVertex,
  isSaved,
} = require('../src/graphMethods.js');

const graph = createNewGraph('people', 'name');

const FUNCTION_TESTS = {
  addTest() {
    add('name: Dima, age: 19', 'person');
    add('name: Kirill, age: 18', 'person');
  },

  linkTest() {
    link('Dima', 'Kirill', 'friends');
    const firstVertexLink = graph.vertices.get('Dima').links[0];
    const secondVertexLink = graph.vertices.get('Kirill').links[0];
    return [firstVertexLink, secondVertexLink];
  },

  selectTest() {
    const selected = select('age: 18');
    const selectedData = selected[0].data;
    return selectedData;
  },

  modifyVertexTest() {
    modifyVertex('Dima', 'age: 13, job: none');
  },

  getLinkedTest() {
    const linked = getLinked('Dima');
    const linkedData = linked[0].data;
    return linkedData;
  },

  deleteLinksTest() {
    deleteLinks('Dima', 'Kirill');
    return graph.vertices.get('Dima').links.length;
  },

  deleteVertexTest() {
    deleteVertex('Dima');
  },

  deleteGraphTest() {
    deleteGraph('people');
  },

  isSavedTest() {
    isSaved();
  }
};

const DATA_TESTS = [
  [
    FUNCTION_TESTS.addTest(),
    graph.vertices.get('Dima').data[graph.keyField],
    'Dima',
    'Function add() does not work properly',
  ],

  [
    FUNCTION_TESTS.linkTest(),
    FUNCTION_TESTS.linkTest().linkName,
    FUNCTION_TESTS.linkTest().linkName,
    'Function link() does not work properly',
  ],

  [
    FUNCTION_TESTS.selectTest(),
    FUNCTION_TESTS.selectTest().name,
    'Kirill',
    'Function select() does not work properly'
  ],

  [
    FUNCTION_TESTS.modifyVertexTest(),
    graph.vertices.get('Dima').data.age,
    13,
    'Function modifyVertex() does not work properly'
  ],

  [
    FUNCTION_TESTS.getLinkedTest(),
    FUNCTION_TESTS.getLinkedTest().name,
    'Kirill',
    'Function getLinked() does not work properly'
  ],

  [
    FUNCTION_TESTS.deleteLinksTest(),
    FUNCTION_TESTS.deleteLinksTest(),
    0,
    'Function deleteLinks() does not work properly'
  ],

  [
    FUNCTION_TESTS.deleteVertexTest(),
    graph.vertices.get('Dima'),
    undefined,
    'Function deleteVertex() does not work properly'
  ],

  [
    FUNCTION_TESTS.deleteGraphTest(),
    graph.vertices.size,
    0,
    'Function deleteGraph() does not work properly'
  ],

  [
    FUNCTION_TESTS.isSavedTest(),
    graph.directory,
    null,
    'Function isSaved() does not work properly'
  ]
];

for (const test of DATA_TESTS) {
  try {
    const [functionTest, entered, expected, message] = test;
    functionTest;
    assert.strictEqual(
      entered,
      expected,
      message
    );
    alert('green', 'Success!');
  } catch (err) {
    alert('red', err.message);
  }
}

