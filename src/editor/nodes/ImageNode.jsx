import { DecoratorNode } from 'lexical';
import React from 'react'; // <<-- 1. ADICIONE ESTA LINHA

// O componente React que vai renderizar este nó
function ImageComponent({ src, altText, nodeKey }) {
  return (
     <div className="editor-image-wrapper">
      <img 
        src={src} 
        alt={altText} 
        data-lexical-key={nodeKey}
        className="editor-image" 
      />
    </div>
  );
}

// O resto do código permanece o mesmo
export class ImageNode extends DecoratorNode {
  // ... (todo o resto do código da classe ImageNode fica aqui)
  __src;
  __altText;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src, altText, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  exportJSON() {
    return {
      src: this.getSrc(),
      altText: this.getAltText(),
      type: 'image',
      version: 1,
    };
  }

  static importJSON(serializedNode) {
    return $createImageNode({
      src: serializedNode.src,
      altText: serializedNode.altText,
    });
  }
  
  createDOM(config) {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM() {
    return false;
  }

  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }

  decorate() {
    return <ImageComponent src={this.__src} altText={this.__altText} nodeKey={this.__key} />;
  }
}

export function $createImageNode({ src, altText, key }) {
  return new ImageNode(src, altText, key);
}