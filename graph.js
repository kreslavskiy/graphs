'use strict';

const vm = require('vm');

class Vertex {
  constructor (graph, data) {
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

const graph  = {
  
  keyField: undefined,
  vertices: new Map(),

  keyFieldSetter (field) {
    graph.keyField = field;
    return graph.keyField;
  },

  add (input) {
    const inputExec = '{' + input + '}';
    const script = vm.createScript('(' + inputExec + ')');
    const data = script.runInThisContext();
    console.dir(data);
    const vertex = new Vertex(this, data);
    const key = data[graph.keyField];
    if (graph.vertices.get(key) === undefined) {
      graph.vertices.set(key, vertex);
    }
    return vertex;
  },

  link (source) {
    const vertices = graph.vertices;
    const from = vertices.get(source);
    return {
      to(destination) {
        if (from) {
            const target = vertices.get(destination.toString());
            if (target) from.link(target);
        }
      }
    };
  },

  select(query) {
    const inputExec = '{' + query + '}';
    const script = vm.createScript('(' + inputExec + ')');
    const input = script.runInThisContext();
    const result = new Array();
    for (const vertex of graph.vertices.values()) {
      let condition = true;
      const { data } = vertex;
      if (data) {
        for (const field in input) {
          condition = condition && data[field] ===input[field];
        }
        if (condition) result.push(vertex);
      }
    }
    result.forEach((vertex) => {
      delete vertex.graph;
    });
    return result;
  },

  showData() {
    const result = new Map (graph.vertices);
    result.forEach((vertex) => {
      delete vertex.graph;
    });
    return result;
  }
};

module.exports = graph;