'use strict';

const vm = require('vm');
const fs = require('fs');
const { type } = require('os');

const deserialize = (src) =>
  vm.createScript('({' + src + '})').runInThisContext();

const removeFromArray = (array, value) => {
  if (array.includes(value)) {
    const index = array.indexOf(value);
    array.splice(index, 1);
  }
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
    input = input.replaceAll(' ', '');
    let comma = 0, colon = 0;
    for(const char of input){
      if(char === ':') colon++;
      else if(char === ',') comma++;
    }
    if(colon - comma !== 1) 
    return errorAlert(
      'please enter something like this:  "property1: value1, property2: value2 "'
      );

      if(!comma){ 
       let entry = input.split(':') || [];
       let property = entry[0], value = entry[1];
       if(Number(value).toString() !== value) value = `'${value}'`;
       input = property + ':' + value;
      }
    const data = deserialize(input);
    const vertex = new Vertex(graph.graphName, data);
    if (data.hasOwnProperty(graph.keyField)) {
      console.dir(data);
      const key = data[graph.keyField];
      if (!graph.vertices.has(key)) graph.vertices.set(key, vertex);
    } else errorAlert('Vertex must contain key field');
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
    const file = `${fileName}.json`;
    const vertices = Object.fromEntries(graph.vertices);
    let data = JSON.stringify(vertices);
    if (fs.existsSync(file)) {
      const oldData = JSON.parse(fs.readFileSync(file, 'utf-8'));
      data = JSON.stringify(Object.assign(oldData, vertices));
      fs.truncate(file, err => {
        if(err) throw err;
     });
    }
    await fs.promises.appendFile(file, data);
  },

  getGraphFromFile(fileName, graphName, keyField) {
    const file = fs.readFileSync(`${fileName}.json`, 'utf-8');
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

  deleteLinks(deleteFrom, deleteWhat) {
    const linksToDelete = deleteWhat.trim().replaceAll(',', '').split(' ');
    const vertex = graph.vertices.get(deleteFrom);
    for (const link of linksToDelete) {
      removeFromArray(vertex.links, link);
    }
  },

  modifyVertex(link, newData) {
    const vertex = graph.vertices.get(link);
    const modificator = deserialize(newData);
    const keyField = graph.keyField;

    if (graph.vertices.has(modificator[keyField]))
      return errorAlert('Vertex with this key field is already exists');

    for (const [key, value] of Object.entries(modificator)) {
      if (vertex.data.hasOwnProperty(key)) {
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
