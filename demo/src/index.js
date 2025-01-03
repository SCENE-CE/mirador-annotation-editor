import mirador from 'mirador/dist/es/src/index';
import annotationPlugins from '../../src';
import LocalStorageAdapter from '../../src/annotationAdapter/LocalStorageAdapter';
import { manifestsCatalog } from './manifestsCatalog';

const endpointUrl = 'http://127.0.0.1:3000/annotations';
const config = {
  annotation: {
    adapter: (canvasId) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
    // adapter: (canvasId) => new AnnototAdapter(canvasId, endpointUrl),
    exportLocalStorageAnnotations: false, // display annotation JSON export button
  },
  language:'fr',
  catalog:
  manifestsCatalog,
  debug: true,
  id: 'demo',
  themes: {
    light: {
      palette: {
        primary: {
          main: '#5A8264',
        },
      },
      typography: {
        formSectionTitle: {
          fontSize: '1.215rem',
        },
        subFormSectionTitle: {
          fontSize: '0.937rem',
          fontWeight: 300,

        },
      },
    },
    dark: {
      typography: {
        formSectionTitle: {
          fontSize: '1rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        },
        subFormSectionTitle: {
          fontSize: '1.383rem',
          fontWeight: 300,
          letterSpacing: '0em',
          lineHeight: '1.33em',
          textTransform: 'uppercase',
        },
      },
    },
  },
  // windows: [
  //   { manifestId: 'https://files.tetras-libre.fr/dev/Heterogeneous-media-on-several-canvases.json' },
  // ],
  window: {
    defaultSideBarPanel: 'annotations',
    sideBarOpenByDefault: true,
  },
  windows: [],
};

mirador.viewer(config, [...annotationPlugins]);
