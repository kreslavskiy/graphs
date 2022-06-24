'use strict';

const assert = require('assert').strict;
const { alert } = require('../src/tools.js');
const { FUNCTION_TESTS, graph } = require('./testsCollection.js');

const DATA_TESTS = [
  [
    FUNCTION_TESTS.addTest(),
    typeof graph.vertices.get('Dima').data.age,
    'string',
    'Function add() does not work properly',
  ],

  [
    FUNCTION_TESTS.linkTest(),
    typeof graph.vertices.get('Dima').links[0].linkName,
    undefined,
    'Function link() does not work properly',
  ],

  [
    FUNCTION_TESTS.selectTest(),
    typeof FUNCTION_TESTS.selectTest(),
    undefined,
    'Function select() does not work properly',
  ],

  [
    FUNCTION_TESTS.modifyVertexTest(),
    graph.vertices.get('Dima').data.age,
    '13',
    'Function modifyVertex() does not work properly',
  ],

  [
    FUNCTION_TESTS.getLinkedTest(),
    FUNCTION_TESTS.getLinkedTest().name,
    undefined,
    'Function getLinked() does not work properly',
  ],

  [
    FUNCTION_TESTS.deleteLinksTest(),
    FUNCTION_TESTS.deleteLinksTest(),
    1,
    'Function deleteLinks() does not work properly',
  ],

  [
    FUNCTION_TESTS.deleteVertexTest(),
    graph.vertices.get('Dima'),
    'Dima',
    'Function deleteVertex() does not work properly',
  ],

  [
    FUNCTION_TESTS.deleteGraphTest(),
    graph.vertices.size,
    1,
    'Function deleteGraph() does not work properly',
  ],

  [
    FUNCTION_TESTS.isSavedTest(),
    typeof graph.directory,
    'string',
    'Function isSaved() does not work properly',
  ],
];

//All tests are expected to fail

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
