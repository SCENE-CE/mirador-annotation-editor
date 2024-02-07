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
  catalog: [
    { manifestId: 'https://files.tetras-libre.fr/manifests/jf_peyret_re_walden.json' },
    { manifestId: 'https://files.tetras-libre.fr/manifests/test_markeas_manifest.json' },
    { manifestId: 'https://files.tetras-libre.fr/manifests/installation_fresnoy_manifest.json' },
    { manifestId: 'https://files.tetras-libre.fr/manifests/sceno_avignon_manifest.json' },
    { manifestId: 'https://files.tetras-libre.fr/manifests/walden_nouvel_manifest.json' },
    { manifestId: 'https://files.tetras-libre.fr/manifests/walden_nouvel2_manifest.json' },
    { manifestId: 'https://files.tetras-libre.fr/manifests/score_manifest.json' },
    { manifestId: 'https://files.tetras-libre.fr/manifests/program_manifest.json' },
  ],
  debugMode: true,
  id: 'demo',
  window: {
    defaultSideBarPanel: 'annotations',
    sideBarOpenByDefault: true,
  },
  windows: [
  ],
};

mirador.viewer(config, [...annotationPlugins]);
