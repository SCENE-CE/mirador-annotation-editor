import mirador from 'mirador/dist/es/src/index';
import annotationPlugins from '../../src';
import LocalStorageAdapter from '../../src/LocalStorageAdapter';
import AnnototAdapter from '../../src/AnnototAdapter';

const endpointUrl = 'http://127.0.0.1:3000/annotations';
const config = {
  annotation: {
    adapter: (canvasId) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
    // adapter: (canvasId) => new AnnototAdapter(canvasId, endpointUrl),
    exportLocalStorageAnnotations: false, // display annotation JSON export button
  },
  id: 'demo',
  window: {
    defaultSideBarPanel: 'annotations',
    sideBarOpenByDefault: true,
  },
  catalog: [
    { manifestId: 'https://dzkimgs.l.u-tokyo.ac.jp/videos/iiif_in_japan_2017/manifest.json' },
    { manifestId: 'https://iiif.io/api/cookbook/recipe/0219-using-caption-file/manifest.json' },
    { manifestId: 'https://preview.iiif.io/cookbook/master/recipe/0003-mvm-video/manifest.json' },
    { manifestId: 'https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/manifest.json' },
    { manifestId: 'https://iiif.io/api/cookbook/recipe/0064-opera-one-canvas/manifest.json' },
    { manifestId: 'https://iiif.io/api/cookbook/recipe/0074-multiple-language-captions/manifest.json' },
    { manifestId: 'https://iiif.harvardartmuseums.org/manifests/object/299843' },
    { manifestId: 'https://iiif.io/api/cookbook/recipe/0002-mvm-audio/manifest.json' },
  ]
};

mirador.viewer(config, [...annotationPlugins]);
