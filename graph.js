'use strict';

const vm = require('vm');
const fs = require('fs');

const deserialize = (str) => {
  const inputExec = '{' + str + '}';
  const script = vm.createScript('(' + inputExec + ')');
  const input = script.runInThisContext();
  return input;
};

class Vertex {
  constructor(graph, data) {
    this.graph = graph;
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

const graph = {
  keyField: undefined,
  vertices: new Map(),

  keyFieldSetter(field) {
    graph.keyField = field;
    return graph.keyField;
  },

  add(input) {
    const data = deserialize(input);
    console.dir(data);
    const vertex = new Vertex(this, data);
    const key = data[graph.keyField];
    if (graph.vertices.get(key) === undefined) {
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

  select(query, names) {
    const input = deserialize(query);
    names = names.trim();
    const result = new Array();
    if (names.includes(',')) names = names.replaceAll(' ', '').split(',');
    for (const vertex of graph.vertices.values()) {
      let condition = true;
      const { data } = vertex;
      if (data) {
        for (const field in input) {
          condition = condition && data[field] === input[field];
        }
        if (condition) result.push(vertex);
      }
    }
    for (const vertex of result) {
      let condition = true;
      for (const name of names) {
        condition = condition && vertex.links.has(name);
      }
      if (!condition) result.splice(result.indexOf(vertex), 1);
    }
    result.forEach((vertex) => {
      delete vertex.graph;
    });
    return result;
  },

  showData() {
    const result = new Map(this.vertices);
    result.forEach((vertex) => {
      delete vertex.graph;
    });
    return result;
  },

  async createFile (fileName) {
    const map = this.showData();
    const data = JSON.stringify(Array.from(map.entries()));
    const file = fs.appendFile (`${fileName}.txt`, data, (err) => {
      if (err) throw err;
    })
    return file;
  },
};

module.exports = graph;
