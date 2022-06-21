'use strict';

const { removeFromArray } = require('../tools.js');

class Vertex {
  constructor(graphName, type, data) {
    this.graphName = graphName;
    this.type = type;
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

  deleteLink(linkToDelete) {
    for (const link of this.links) {
      if (link.key === linkToDelete) removeFromArray(this.links, link);
    }
  }
}

module.exports = { Vertex };
