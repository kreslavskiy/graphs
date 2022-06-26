'use strict';

const { Graph } = require('../src/classes/Graph.js');

const graph = new Graph('people', 'name');

const FUNCTION_TESTS = {
  addTest() {
    graph.add('name: Dima, age: 19', 'person');
    graph.add('name: Kirill, age: 18', 'person');
  },

  linkTest() {
    graph.link('Dima', 'Kirill', 'friends');
    const firstVertexLink = graph.vertices.get('Dima').links[0];
    const secondVertexLink = graph.vertices.get('Kirill').links[0];
    return [firstVertexLink, secondVertexLink];
  },

  selectTest() {
    const selected = graph.select('age: 18');
    const selectedData = selected[0].data;
    return selectedData;
  },

  modifyVertexTest() {
    graph.modifyVertex('Dima', 'age: 13, job: none');
  },

  getLinkedTest() {
    const linked = graph.getLinked('Dima');
    const linkedData = linked[0].data;
    return linkedData;
  },

  deleteLinksTest() {
    graph.deleteLinks('Dima', 'Kirill');
    return graph.vertices.get('Dima').links.length;
  },

  deleteVertexTest() {
    graph.deleteVertex('Dima');
  },

  deleteGraphTest() {
    graph.deleteGraph('people');
  },
};

module.exports = { FUNCTION_TESTS, graph };
