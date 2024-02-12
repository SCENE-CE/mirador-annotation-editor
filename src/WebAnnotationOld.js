/** */
export default class WebAnnotation {
  /** */
  constructor({
    canvasId, id, fragsel, image, body, tags, svg, manifestId, drawingStateSerialized
  }) {
    this.id = id;
    this.canvasId = canvasId;
    this.fragsel = fragsel;
    this.body = body;
    this.tags = tags;
    this.svg = svg;
    //this.image = image;
    this.image = image;
    this.manifestId = manifestId;
    this.drawingState = drawingStateSerialized;

    console.log('WebAnnotation constructor', this);
  }

  /** */
  toJson() {
    const result =  {
      body: this.createBody(),
      id: this.id,
      motivation: 'commenting',
      target: this.target(),
      type: 'Annotation',
      drawingState: this.drawingState,
    };
    console.log('WebAnnotation toJson', result);
    return result;
  }

  /** */
  createBody() {
    let bodies = [];
    if (this.body && this.body.value !== '') {
      const textBody = {
        type: 'TextualBody',
        value: this.body.value,
      };
      bodies.push(textBody);
    }

    if (this.image) {
      // TODO dumb image { this.image.id}
      const imgBody = {
        id: 'https://tetras-libre.fr/themes/tetras/img/logo.svg',
        type: 'Image',
        format: 'image/svg+xml',
      };
      //bodies.push(imgBody);
      const testImageBody = {
            "id": "https://files.tetras-libre.fr/dev/Hakanai/media/10_HKN-Garges_A2B4243.JPG",
            "type": "Image",
            "format": "image/jpg"
          };
      bodies.push(testImageBody);
    }

    // if (this.tags) {
    //   bodies = bodies.concat(this.tags.map((tag) => ({
    //     purpose: 'tagging',
    //     type: 'TextualBody',
    //     value: tag,
    //   })));
    // }
    if (bodies.length === 1) {
      return bodies[0];
    }
    return bodies;
  }

  /** Fill target object with selectors (if any), else returns target url */
  target() {
    if (!this.svg
      && (!this.fragsel || !Object.values(this.fragsel).find((e) => e !== null))) {
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
