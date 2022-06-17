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
  constructor(graphName, keyField, directory) {
    this.graphName = graphName;
    this.keyField = keyField;
    this.directory = directory;
    this.vertices = new Map();
  }
}

let graph = new Graph();

class Vertex {
  constructor(graphName, type, data) {
    this.graphName = graphName;
    this.type = type;
    this.data = data;
    this.links = new Array();
  }

  link(type, ...args) {
    const distinct = new Set(args);
    const { links } = this;
    const keyField = graph.keyField;
    for (const item of distinct) {
      const key = item.data[keyField];
      links.push({ key, type });
    }
    return this;
  }
}

const createNewGraph = (graphName, keyField) => {
  graph = new Graph(graphName, keyField, null);
  return graph;
};

const add = (input, vertexType) => {
  if (!checkInput(input)) return;
  const inputNormalized = addQuotes(input);
  const data = deserialize(inputNormalized);
  const vertex = new Vertex(graph.graphName,  vertexType, data);
  if (Object.prototype.hasOwnProperty.call(data, graph.keyField)) {
    const key = data[graph.keyField];
    if (!graph.vertices.has(key)) {
      graph.vertices.set(key, vertex);
      alert('green', 'Vertex added to the graph successfully');
    }
  } else alert('red', 'Vertex must contain key field');
  return vertex;
};

const link = (source, destination, name, directed = false) => {
  const sources = source.trim().replaceAll(',', '').split(' ');
  const destinations = destination.trim().replaceAll(',', '').split(' ');
  const vertices = graph.vertices;
  for (const vertex of sources) {
    const from = vertices.get(vertex);
    for (const link of destinations) {
      const target = vertices.get(link);
      if (from && target && !from.links.includes(link)) {
        from.link(name, target);
        if (directed && !target.links.includes(vertex)) target.link(name, from);
      } else alert('red', 'One of these vertex does not exist');
    }
  }
};

const select = (query) => {
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
};

const getAllLinks = (vertex) => {
  const links = [];
  for (const link of vertex.links) {
    links.push(link.key);
  }
  return links;
};

const getLinked = (links) => {
  const result = new Set();
  links = links.replaceAll(' ', '').split(',');
  for (const vertex of graph.vertices.values()) {
    const vertexLinks = getAllLinks(vertex);
    for (const link of links) {
      if (vertexLinks.includes(link)) result.add(vertex);
    }
  }
  return Array.from(result);
};

const showGraph = () => {
  console.log('Graph name:', graph.graphName);
  if (!graph.vertices.size)
    return alert('red', 'There is no vertices in graph');
  const vertices = graph.vertices;
  for (const vertex of vertices.values()) {
    const key = vertex.data[graph.keyField];
    const loh = new Object(vertex);
    // eslint-disable-next-line no-unused-vars
    const { graphName, ...output } = loh;
    console.log(key, '=>', output);
  }
};

const saveToFile = async (fileName) => {
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
};

const getVerticesFromFile = (fileName) => {
  const file = `${fileName}.json`;
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const parsed = Object.entries(JSON.parse(content));
    const data = new Map(parsed);
    console.log(data);
    return data;
  } else return alert('red', 'This file does not exist');
};

const setGraph = (fileName, keyField) => {
  const vertices = getVerticesFromFile(fileName);
  //const [vertex] = vertices.values();
  graph = new Graph('vertex.graphName', keyField);
  graph.vertices = vertices;
};

const mergeTwoGraphs = (fileName) => {
  const vertices = getVerticesFromFile(fileName);
  graph.vertices = new Map([...graph.vertices, ...vertices]);
};

const deleteVertex = (element) => {
  const vertices = graph.vertices;
  const deleted = vertices.delete(element);
  if (deleted) {
    for (const vertex of vertices.values()) {
      removeFromArray(vertex.links, element);
    }
  }
};

const deleteGraph = (name) => {
  if (name === graph.graphName) graph.vertices.clear();
};

const deleteLinks = (deleteFrom, deleteWhat) => {
  const linksToDelete = deleteWhat.trim().replaceAll(',', '').split(' ');
  const vertex = graph.vertices.get(deleteFrom);
  for (const link of linksToDelete) {
    removeFromArray(vertex.links, link);
  }
};

const modifyVertex = (link, newData) => {
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
};

const renameKey = (oldName, newName, data) => {
  graph.vertices.set(newName, data);
  graph.vertices.delete(oldName);
  for (const vertex of graph.vertices.values()) {
    if (vertex.links.includes(oldName)) {
      const index = vertex.links.indexOf(oldName);
      vertex.links[index] = newName;
    }
  }
};

const isSaved = () => {
  if (!graph.directory) return false;
  const vertices = Object.fromEntries(graph.vertices);
  const verticesData = JSON.stringify(vertices);
  const fileData = fs.readFileSync(graph.directory, 'utf-8');
  if (fileData !== verticesData) return false;
  return true;
};

module.exports = {
  createNewGraph,
  add,
  link,
  select,
  getAllLinks,
  getLinked,
  showGraph,
  saveToFile,
  setGraph,
  mergeTwoGraphs,
  deleteVertex,
  deleteGraph,
  deleteLinks,
  modifyVertex,
  renameKey,
  isSaved,
};
