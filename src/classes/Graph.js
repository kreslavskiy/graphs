'use strict';

const { checkInput, addQuotes, deserialize } = require('../tools.js');
const { alert } = require('../tools.js');
const { Vertex } = require('../classes/Vertex.js');

class Graph {
  constructor(graphName, keyField, directory) {
    this.graphName = graphName;
    this.keyField = keyField;
    this.directory = directory;
    this.vertices = new Map();
  }

  add(input, vertexType) {
    if (!checkInput(input)) return;
    const inputNormalized = addQuotes(input);
    const data = deserialize(inputNormalized);
    const vertex = new Vertex(this.thisName, vertexType, data);
    if (Object.prototype.hasOwnProperty.call(data, this.keyField)) {
      const key = data[this.keyField];
      if (!this.vertices.has(key)) {
        this.vertices.set(key, vertex);
      }
    } else alert('red', 'Vertex must contain key field');
    return vertex;
  }

  renameKey(oldName, newName, data) {
    this.vertices.set(newName, data);
    this.vertices.delete(oldName);
    for (const vertex of this.vertices.values()) {
      for (const link of vertex.links) {
        if (link.key === oldName) {
          link.key = newName;
        }
      }
    }
  }
}

module.exports = { Graph };
