'use strict';

class Graph {
  constructor(graphName, keyField, directory) {
    this.graphName = graphName;
    this.keyField = keyField;
    this.directory = directory;
    this.vertices = new Map();
  }
}

module.exports = { Graph };
