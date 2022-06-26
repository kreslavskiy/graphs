'use strict';

const fs = require('fs');
const { Vertex } = require('../classes/Vertex.js');
const {
  checkInput,
  addQuotes,
  deserialize,
  normalizeInput,
  alert,
} = require('../tools.js');

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
    const vertex = new Vertex(this.graphName, vertexType, this.keyField, data);
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

  select(query) {
    const result = new Array();
    if (query) {
      if (!checkInput(query)) return;
      const normalized = addQuotes(query);
      const input = deserialize(normalized);
      for (const vertex of this.vertices.values()) {
        const { data } = vertex;
        if (data) {
          for (const field in input) {
            if (data[field] === input[field]) result.push(vertex);
          }
        }
      }
    }
    return result;
  }

  getLinked(links) {
    const result = new Set();
    links = links.replaceAll(' ', '').split(',');
    for (const vertex of this.vertices.values()) {
      const vertexLinks = vertex.linksKeys;
      for (const link of links) {
        if (vertexLinks.includes(link)) result.add(vertex);
      }
    }
    return Array.from(result);
  }

  async saveToFile(fileName) {
    const file = `${fileName}.json`;
    this.directory = file;
    const vertices = Object.fromEntries(this.vertices);
    let data = JSON.stringify(vertices);
    if (fs.existsSync(file)) {
      const oldData = JSON.parse(fs.readFileSync(file, 'utf-8'));
      data = JSON.stringify(Object.assign(oldData, vertices));
      fs.truncate(file, (err) => {
        if (err) throw err;
      });
    }
    await fs.promises.appendFile(file, data);
  }

  vertexify(data) {
    const vertices = new Array();
    for (const [key, value] of data) {
      const { graphName, type, keyField, data, links } = value;
      const vertex = new Vertex(graphName, type, keyField, data);
      vertex.links = links;
      vertices.push([key, vertex]);
    }
    return new Map(vertices);
  }

  getVerticesFromFile(fileName) {
    const file = `${fileName}.json`;
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = Object.entries(JSON.parse(content));
      const data = this.vertexify(parsed);
      return data;
    } else return alert('red', 'This file does not exist');
  }

  setGraph(fileName) {
    const vertices = this.getVerticesFromFile(fileName);
    const [vertex] = vertices.values();
    this.graphName = vertex.graphName;
    this.keyField = vertex.keyField;
    this.vertices = vertices;
    return this.vertices;
  }

  mergeTwoGraphs(fileName) {
    const verticesFromFile = this.getVerticesFromFile(fileName);
    const [ vertex ] = this.vertices.values();
    const [ vertexFromFile ] = verticesFromFile.values();
    if (vertex.keyField === vertexFromFile.keyField) {
      this.vertices = new Map([...this.vertices, ...verticesFromFile]);
    } else {
      alert('red', 'Unable to merge. THese graphs have different key fields');
    }
  }

  deleteGraph(name) {
    if (name === this.graphName) this.vertices.clear();
  }

  deleteVertex(name) {
    const vertices = this.vertices;
    const vertexToDelete = vertices.get(name);
    const deletedKey = vertexToDelete.data[this.keyField];
    const deleted = vertices.delete(name);
    if (deleted) {
      for (const vertex of vertices.values()) {
        vertex.deleteLink(deletedKey);
      }
    }
  }

  deleteLinks(deleteFrom, deleteWhat) {
    const linksToDelete = normalizeInput(deleteWhat);
    const vertex = this.vertices.get(deleteFrom);
    for (const link of linksToDelete) {
      vertex.deleteLink(link);
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

  modifyVertex(link, newData) {
    if (!checkInput(newData)) return;
    const modificator = deserialize(addQuotes(newData));
    const vertex = this.vertices.get(link);
    const keyField = this.keyField;

    if (this.vertices.has(modificator[keyField]))
      return alert('red', 'Vertex with this key field is already exists');

    for (const [key, value] of Object.entries(modificator)) {
      if (Object.prototype.hasOwnProperty.call(vertex.data, key)) {
        if (vertex.data[key] !== modificator[key])
          vertex.data[key] = modificator[key];
      } else vertex.data[key] = value;
    }
    if (link !== vertex.data[keyField]) {
      this.renameKey(link, vertex.data[keyField], vertex);
    }
  }
}

module.exports = { Graph };
