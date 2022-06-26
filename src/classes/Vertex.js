'use strict';

const { removeFromArray } = require('../tools.js');

class Vertex {
  constructor(graphName, type,  keyField, data) {
    this.graphName = graphName;
    this.type = type;
    this.keyField = keyField;
    this.data = data;
    this.links = new Array();
  }

  get linksKeys() {
    const keys = new Array();
    for (const link of this.links) {
      keys.push(link.key);
    }
    return keys;
  }

  createLink(destination, linkName, keyField) {
    const key = destination.data[keyField];
    const links = this.linksKeys;
    if (!links.includes(key)) this.links.push({ key, linkName });
  }

  deleteLink(linkToDelete) {
    for (const link of this.links) {
      if (link.key === linkToDelete) removeFromArray(this.links, link);
    }
  }
}

module.exports = { Vertex };
