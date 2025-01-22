// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__tests__/style-mock.js',
  },
  setupFiles: [
    'jest-localstorage-mock', 'jest-canvas-mock',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/setupJest.js',
  ],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/test-utils.js',
    '<rootDir>/__tests__/style-mock.js',
  ],
  // Ignore Mirador code from jest transforms
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(mirador|manifesto.js|react-dnd|dnd-core|@react-dnd|dnd-multi-backend|rdndmb-html5-to-touch|react-quill|react-konva-to-svg|jsoneditor-react))',
  ],
};
