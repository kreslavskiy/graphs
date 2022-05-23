'use strict';

const vm = require('vm');
const fs = require('fs');

const deserialize = (src) =>
  vm.createScript('({' + src + '})').runInThisContext();

const removeFromArray = (array, value) => {
  const index = array.indexOf(value);
  array.splice(index, 1);
};

const errorAlert = (message) => console.log('\x1b[31m', message, '\x1b[0m');

class Vertex {
  constructor(graphName, data) {
    this.graphName = graphName;
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

class Graph {
  constructor(graphName, keyField) {
    this.graphName = graphName;
    this.keyField = keyField;
    this.vertices = new Map();
  }
}

let graph = new Graph();

const methods = {
  createNewGraph(graphName, keyField) {
    graph = new Graph(graphName, keyField);
  },

  add(input) {
    const data = deserialize(input);
    const vertex = new Vertex(graph.graphName, data);
    if (data.hasOwnProperty(graph.keyField)) {
      console.dir(data);
      const key = data[graph.keyField];
      if (!graph.vertices.has(key)) graph.vertices.set(key, vertex);
    } else errorAlert('Vertex must contain key field');
    return vertex;
  },

  link(source) {
    const vertices = graph.vertices;
    const from = vertices.get(source);
    return {
      to(destination) {
        if (from) {
          const target = vertices.get(destination.toString());
          if (target) from.link(target);
        }
      },
    };
  },

  select(query) {
    const input = deserialize(query);
    const result = new Array();
    for (const vertex of graph.vertices.values()) {
      const { data } = vertex;
      if (data) {
        for (const field in input) {
          if (data[field] === input[field]) result.push(vertex);
        }
      }
    }
    return result;
  },

  linked(links) {
    const result = new Array();
    links = links.trim().replaceAll(',', '').split(' ');
    for (const vertex of graph.vertices.values()) {
      for (const link of links) {
        if (vertex.links.includes(link)) result.push(vertex);
      }
    }
    return result;
  },

  showGraph() {
    if (!graph.vertices.size) errorAlert('There is no vertices in graph');
    else console.dir(graph.vertices);
  },

  async save(fileName) {
    const vertices = [...graph.vertices];
    let data = JSON.stringify(vertices);
    if (fs.existsSync(`${fileName}.txt`)) {
      const file = fs
        .readFileSync(`${fileName}.txt`, 'utf-8')
        .replace(']]', '');
      data = data.replace(file, '');
    }
    await fs.promises.appendFile(`${fileName}.txt`, data);
  },

  getGraphFromFile(fileName, graphName, keyField) {
    const file = fs.readFileSync(`${fileName}.txt`, 'utf-8');
    const fileParsed = new Map(JSON.parse(file));
    graph = new Graph(graphName, keyField);
    graph.vertices = fileParsed;
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

  modifyVertex(link, newData) {
    const vertex = graph.vertices.get(link);
    const extention = deserialize(newData);
    const keyField = graph.keyField;

    if (graph.vertices.has(extention[keyField]))
      return errorAlert('Vertex with this key field is already exists');

    for (const [key, value] of Object.entries(extention)) {
      if (vertex.data.hasOwnProperty(key)) {
        if (vertex.data[key] !== extention[key])
          vertex.data[key] = extention[key];
      } else vertex.data[key] = value;
    }

    if (link !== vertex.data[keyField]) {
      graph.vertices.set(vertex.data[keyField], vertex);
      graph.vertices.delete(link);
      this.renameLinks(link, vertex.data[keyField])
    }
  },

  renameLinks(oldName, newName) {
    for (const vertex of graph.vertices.values()) {
      if (vertex.links.includes(oldName)) {
        const index = vertex.links.indexOf(oldName);
        vertex.links[index] = newName;
      }
    }
  }
};

module.exports = { methods };
