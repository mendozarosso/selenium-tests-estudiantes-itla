
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 60000,
  setupFilesAfterEnv: ['<rootDir>/config/test-setup.js'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports',
        filename: 'test-results.html',
        openReport: false,
        pageTitle: 'Pruebas Selenium - Sistema Estudiantes ITLA',
        logoImgPath: undefined,
        hideIcon: false,
        expand: false,
        testCommand: 'npm run test',
        enableMergeData: false,
        dataMergeLevel: 1
      }
    ]
  ],
  collectCoverage: false,
  verbose: true
};