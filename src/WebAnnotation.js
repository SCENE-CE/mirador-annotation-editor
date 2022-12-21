/** */
export default class WebAnnotation {
  /** */
  constructor({
    canvasId, id, fragsel, body, tags, svg, manifestId,
  }) {
    this.id = id;
    this.canvasId = canvasId;
    this.fragsel = fragsel;
    this.body = body;
    this.tags = tags;
    this.svg = svg;
    this.manifestId = manifestId;
  }

  /** */
  toJson() {
    return {
      body: this.createBody(),
      id: this.id,
      motivation: 'commenting',
      target: this.target(),
      type: 'Annotation',
    };
  }

  /** */
  createBody() {
    let bodies = [];
    if (this.body) {
      bodies.push({
        type: 'TextualBody',
        value: this.body,
      });
    }
    if (this.tags) {
      bodies = bodies.concat(this.tags.map((tag) => ({
        purpose: 'tagging',
        type: 'TextualBody',
        value: tag,
      })));
    }
    if (bodies.length === 1) {
      return bodies[0];
    }
    return bodies;
  }

  /** */
  target() {
    if (!this.svg && !this.fragsel) {
      return this.canvasId;
    }
    const target = { source: this.source() };
    const selectors = [];
    if (this.svg) {
      selectors.push({
        type: 'SvgSelector',
        value: this.svg,
      });
    }
    if (this.fragsel) {
      selectors.push({
        type: 'FragmentSelector',
        value: Object.entries(this.fragsel)
          .filter((kv) => kv[1])
          .map((kv) => `${kv[0]}=${kv[1]}`)
          .join('&'),
      });
    }
    target.selector = selectors.length === 1 ? selectors[0] : selectors;
    return target;
  }

  /** */
  source() {
    let source = this.canvasId;
    if (this.manifest) {
      source = {
        id: this.canvasId,
        partOf: {
          id: this.manifest.id,
          type: 'Manifest',
        },
        type: 'Canvas',
      };
    }
    return source;
  }
}
