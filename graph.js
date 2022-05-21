'use strict';

const vm = require('vm');
const fs = require('fs');

const deserialize = (src) => vm.createScript('({' + src + '})').runInThisContext();

class Vertex {
  constructor(graphName, data) {
    this.graphName = graphName;
    this.data = data;
    this.links = new Map();
  }

  link(...args) {
    const distinct = new Set(args);
    const { links } = this;
    const keyField = graph.keyField;
    for (const item of distinct) {
      const key = item.data[keyField];
      links.set(key, item);
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
      let condition = true;
      const { data } = vertex;
      if (data) {
        for (const field in input) {
          condition &&= data[field] === input[field];
        }
        if (condition) result.push(vertex);
      }
    }
    return result;
  },

  linked(links, selectedByData) {
    const result = [...selectedByData];
    links = links.trim().replaceAll(',', '').split(' ');
    for (const vertex of result) {
      let condition = true;
      for (const link of links) {
        condition &&= vertex.links.has(link);
        if (!condition) result.splice(result.indexOf(vertex), 1);
      }
    }
    return result;
  },

  showGraph() {
    const result = new Map(graph.vertices);
    return result;
  },

  async save(fileName) {
    const vertices = graph.vertices;
    for (const vertex of vertices.values()) {
      vertex.links = Array.from(vertex.links.entries());
    }
    let data = JSON.stringify(Array.from(vertices));
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
};

module.exports = { Graph, methods };
