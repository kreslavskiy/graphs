'use strict';

const vm = require('vm');
const fs = require('fs');

const deserialize = (src) => vm.createScript('({' + src + '})').runInThisContext();

const removeFromArray = (array, value) => {
  const index = array.indexOf(value);
  array.splice(index, 1);
};

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
    console.dir(data);
    const vertex = new Vertex(graph.graphName, data);
    const key = data[graph.keyField];
    if (!graph.vertices.has(key)) {
      graph.vertices.set(key, vertex);
    }
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
    return new Map(graph.vertices);
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
};

module.exports = { Graph, methods };
