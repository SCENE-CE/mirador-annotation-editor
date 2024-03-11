import mirador from 'mirador/dist/es/src/index';
import annotationPlugins from '../../src';
import LocalStorageAdapter from '../../src/LocalStorageAdapter';
import AnnototAdapter from '../../src/AnnototAdapter';
import { manifestsCatalog } from './manifestsCatalog';

const endpointUrl = 'http://127.0.0.1:3000/annotations';
const config = {
  annotation: {
    adapter: (canvasId) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
    // adapter: (canvasId) => new AnnototAdapter(canvasId, endpointUrl),
    exportLocalStorageAnnotations: false, // display annotation JSON export button
  },
  catalog:
    manifestsCatalog,
  debugMode: true,
  id: 'demo',
  window: {
    defaultSideBarPanel: 'annotations',
    sideBarOpenByDefault: true,
  },
  windows: [
  ],
  themes: {
    light: {
      palette:{
        primary:{
          main:'#5A8264',
        },
      },
      typography: {
        formSectionTitle: {
          fontSize: "1rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        },
        subFormSectionTitle: {
          fontSize: "0.8rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        },
      },
    },
    dark:{
      typography: {
        formSectionTitle: {
          fontSize: "1rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        },
        subFormSectionTitle: {
          fontSize: "1.383rem",
          fontWeight: 300,
          letterSpacing: "0em",
          lineHeight: "1.33em",
          textTransform: "uppercase",
        },
      },
    }
  },
};

mirador.viewer(config, [...annotationPlugins]);
