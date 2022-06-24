'use strict';

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
  },
};

module.exports = { FUNCTION_TESTS, graph };
