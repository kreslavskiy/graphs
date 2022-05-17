'use strict';

const vm = require('vm');
const fs = require('fs');

const deserialize = (src) => vm.createScript('({' + src + '})').runInThisContext();

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
    return result.flat();
  },

  showGraph() {
    const result = new Map(this.vertices);
    result.forEach((vertex) => {
      delete vertex.graph;
    });
    return result;
  },

  async save(fileName) {
    const vertices = [...this.vertices.entries()];
    const data = JSON.stringify(vertices);
    if (fs.existsSync(`${fileName}.txt`)) {
      fs.truncate(`${fileName}.txt`, (err) => {
        if (err) throw err;
      });
    }
    await fs.promises.appendFile(`${fileName}.txt`, data);
  },
};

module.exports = graph;
