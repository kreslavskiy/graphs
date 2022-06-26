'use strict';

const {
  checkInput,
  addQuotes,
  deserialize,
  normalizeInput,
} = require('../tools.js');
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

  link(source, destination, name, directed = false) {
    const sources = normalizeInput(source);
    const destinations = normalizeInput(destination);
    const vertices = this.vertices;
    const key = this.keyField;
    for (const vertex of sources) {
      const from = vertices.get(vertex);
      for (const link of destinations) {
        const target = vertices.get(link);
        if (from && target && !from.links.includes(link)) {
          from.createLink(target, name, key);
          if (!directed && !target.links.includes(vertex))
            target.createLink(from, name, key);
        } else alert('red', 'One of these vertex does not exist');
      }
    }
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
