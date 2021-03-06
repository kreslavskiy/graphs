'use strict';

const assert = require('assert').strict;
const { alert } = require('../src/tools.js');
const { FUNCTION_TESTS, graph } = require('./testsCollection.js');

const DATA_TESTS = [
  [
    FUNCTION_TESTS.addTest(),
    graph.vertices.get('Dima').data.age,
    19,
    'Function add() does not work properly',
  ],

  [
    FUNCTION_TESTS.linkTest(),
    graph.vertices.get('Dima').links[0].linkName,
    'friends',
    'Function link() does not work properly',
  ],

  [
    FUNCTION_TESTS.selectTest(),
    FUNCTION_TESTS.selectTest().name,
    'Kirill',
    'Function select() does not work properly',
  ],

  [
    FUNCTION_TESTS.modifyVertexTest(),
    graph.vertices.get('Dima').data.age,
    13,
    'Function modifyVertex() does not work properly',
  ],

  [
    FUNCTION_TESTS.getLinkedTest(),
    FUNCTION_TESTS.getLinkedTest().name,
    'Kirill',
    'Function getLinked() does not work properly',
  ],

  [
    FUNCTION_TESTS.deleteLinksTest(),
    FUNCTION_TESTS.deleteLinksTest(),
    0,
    'Function deleteLinks() does not work properly',
  ],

  [
    FUNCTION_TESTS.deleteVertexTest(),
    graph.vertices.get('Dima'),
    undefined,
    'Function deleteVertex() does not work properly',
  ],

  [
    FUNCTION_TESTS.deleteGraphTest(),
    graph.vertices.size,
    0,
    'Function deleteGraph() does not work properly',
  ],
];

//All tests are expected to run successfully

for (const test of DATA_TESTS) {
  try {
    const [functionTest, entered, expected, message] = test;
    functionTest;
    assert.strictEqual(entered, expected, message);
    alert('green', 'Success!');
  } catch (err) {
    alert('red', err.message);
  }
}
