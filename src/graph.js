'use strict';

const fs = require('fs');
const {
  deserialize,
  removeFromArray,
  alert,
  checkInput,
  addQuotes,
} = require('./tools.js');

class Graph {
  constructor(graphName, keyField) {
    this.graphName = graphName;
    this.keyField = keyField;
    this.vertices = new Map();
  }
}

let graph = new Graph();

class Vertex {
  constructor(graphName, data, type) {
    this.graphName = graphName;
    this.type = type;
    this.data = data;
    this.links = new Array();
  }

  link(...args) {
    const distinct = new Set(args);
    const { links } = this;
    const keyField = graph.keyField;
    for (const item of distinct) {
      const key = item.data[keyField];
      links.push(key);
    }
    return this;
  }
}

const methods = {
  createNewGraph(graphName, keyField) {
    graph = new Graph(graphName, keyField);
  },

  add(input, vertexType) {
    if (!checkInput(input)) return;
    const inputNormalized = addQuotes(input);
    const data = deserialize(inputNormalized);
    const vertex = new Vertex(graph.graphName, data, vertexType);
    if (Object.prototype.hasOwnProperty.call(data, graph.keyField)) {
      alert('green', 'Vertex added to the graph successfully');
      const key = data[graph.keyField];
      if (!graph.vertices.has(key)) graph.vertices.set(key, vertex);
    } else alert('red', 'Vertex must contain key field');
    return vertex;
  },

  link(source, destination, directed = false) {
    const sources = source.trim().replaceAll(',', '').split(' ');
    const destinations = destination.trim().replaceAll(',', '').split(' ');
    const vertices = graph.vertices;
    for (const vertex of sources) {
      const from = vertices.get(vertex);
      for (const link of destinations) {
        const target = vertices.get(link);
        if (from && target && !from.links.includes(link)) {
          from.link(target);
          if (directed && !target.links.includes(vertex)) target.link(from);
        }
      }
    }
  },

  select(query) {
    const result = new Array();
    if (query) {
      if (!checkInput(query)) return;
      const normalized = addQuotes(query);
      const input = deserialize(normalized);
      for (const vertex of graph.vertices.values()) {
        const { data } = vertex;
        if (data) {
          for (const field in input) {
            if (data[field] === input[field]) result.push(vertex);
          }
        }
      }
    }
    return result;
  },

  linked(links) {
    const result = new Set();
    links = links.replaceAll(' ', '').split(',');
    for (const vertex of graph.vertices.values()) {
      for (const link of links) {
        if (vertex.links.includes(link)) result.add(vertex);
      }
    }
    return Array.from(result);
  },

  showGraph() {
    if (!graph.vertices.size) alert('red', 'There is no vertices in graph');
    else console.dir(graph.vertices);
  },

  async save(fileName) {
    const file = `${fileName}.json`;
    const vertices = Object.fromEntries(graph.vertices);
    let data = JSON.stringify(vertices);
    if (fs.existsSync(file)) {
      const oldData = JSON.parse(fs.readFileSync(file, 'utf-8'));
      data = JSON.stringify(Object.assign(oldData, vertices));
      fs.truncate(file, (err) => {
        if (err) throw err;
      });
    }
    await fs.promises.appendFile(file, data);
  },

  getGraphFromFile(fileName, keyField) {
    const file = `${fileName}.json`;
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const data = Object.entries(JSON.parse(content));
      const vertices = new Map(data);
      const [vertex] = vertices.values();
      graph = new Graph(vertex.graphName, keyField);
      graph.vertices = vertices;
    } else alert('red', 'This file does not exist');
  },

  deleteVertex(element) {
    const vertices = graph.vertices;
    const deleted = vertices.delete(element);
    if (deleted) {
      for (const vertex of vertices.values()) {
        removeFromArray(vertex.links, element);
      }
    }
  },

  deleteGraph(name) {
    if (name === graph.graphName) graph.vertices.clear();
  },

  deleteLinks(deleteFrom, deleteWhat) {
    const linksToDelete = deleteWhat.trim().replaceAll(',', '').split(' ');
    const vertex = graph.vertices.get(deleteFrom);
    for (const link of linksToDelete) {
      removeFromArray(vertex.links, link);
    }
  },

  modifyVertex(link, newData) {
    if (!checkInput(newData)) return;
    const modificator = deserialize(addQuotes(newData));
    const vertex = graph.vertices.get(link);
    const keyField = graph.keyField;

    if (graph.vertices.has(modificator[keyField]))
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
  },

  renameKey(oldName, newName, data) {
    graph.vertices.set(newName, data);
    graph.vertices.delete(oldName);
    for (const vertex of graph.vertices.values()) {
      if (vertex.links.includes(oldName)) {
        const index = vertex.links.indexOf(oldName);
        vertex.links[index] = newName;
      }
    }
  },
};

module.exports = { methods };
