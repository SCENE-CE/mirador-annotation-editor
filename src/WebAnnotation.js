/** */
export default class WebAnnotation {
  /** */
  constructor({
    canvasId, id, fragsel, image, body, tags, svg, manifestId, title, konvasInformations
  }) {
    this.title = title,
    this.id = id;
    this.canvasId = canvasId;
    // temps et spacialisation de l'annotation
    this.fragsel = fragsel;
    //infos sur l'annotation image ? Durée ? Spacialisation ? Titre ? Texte ?
    this.body = body;
    this.tags = tags;
    //shapes de présentation Konvas au format svg
    this.svg = svg;
    this.image = image;
    this.manifestId = manifestId;
    this.konvasInformations = konvasInformations
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
    if (this.body && this.body.value !== '') {
      const textBody = {
        type: 'TextualBody',
        value: this.body.value,
      };
      bodies.push(textBody);
    }
    console.log('BODY kanvasInfor',this.konvasInformations)
  if(this.konvasInformations){
    const konvasInformationsBody = {
      type: 'KonvasInformations',
      konvasInformations : this.konvasInformations,
    }
    bodies.push(konvasInformationsBody)
  }
    if (this.image) {

      const imgBody = {
        id: this.image.id,
        type: 'Image',
      };
      bodies.push(imgBody);
    }
    if(this.title){
      const title={
        type: 'AnnotationTitle',
        value: this.title,
      }
      bodies.push(title)
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

    console.log(bodies)
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
    console.log('target',target)
    return target;
  }

  /** */
  source() {
    let source = this.canvasId;
    console.log('source:', source)
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
