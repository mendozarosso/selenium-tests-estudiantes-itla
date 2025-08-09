const { By } = require('selenium-webdriver');
const { takeScreenshot, setupDriver } = require('../config/test-setup');

const APP_URL = 'file:///C:/Users/jason/programacion/SystemaDeGestionEstudiantes/index.html';

describe('HU-004: Buscar Estudiante', () => {
  let driver;

  beforeEach(async () => {
    driver = await setupDriver(APP_URL);
    await driver.sleep(2000);
    
    // Crear estudiante de prueba
    await driver.executeScript(`
      const testStudent = {
        id: 999,
        nombre: "María",
        apellidos: "López Test",
        carrera: "Ingeniería de Sistemas",
        edad: 25,
        activo: 1
      };
      let students = JSON.parse(localStorage.getItem('estudiantes') || '[]');
      students.push(testStudent);
      localStorage.setItem('estudiantes', JSON.stringify(students));
      location.reload();
    `);
    await driver.sleep(2000);
  });

  describe('🟢 Camino Feliz - Búsqueda Exitosa', () => {
    test('CP-004: Debe encontrar estudiante existente', async () => {
      console.log('🧪 Iniciando CP-004: Búsqueda Exitosa');
      
      const searchBox = await driver.findElement(By.id('searchInput'));
      await searchBox.clear();
      await searchBox.sendKeys('María López');
      
      await takeScreenshot('busqueda_estudiante_existente');
      
      await driver.sleep(2000);
      
      // Verificar resultado
      const resultados = await driver.findElements(By.css('.student-card:not([style*="display: none"])'));
      expect(resultados.length).toBeGreaterThan(0);
      
      await takeScreenshot('estudiante_encontrado');
      console.log('✅ CP-004 EXITOSO');
    });
  });

  describe('🔴 Prueba Negativa - Estudiante No Existe', () => {
    test('CN-004: Debe manejar búsqueda sin resultados', async () => {
      console.log('🧪 Iniciando CN-004: Sin Resultados');
      
      const searchBox = await driver.findElement(By.id('searchInput'));
      await searchBox.clear();
      await searchBox.sendKeys('Estudiante Inexistente XYZ');
      
      await takeScreenshot('busqueda_sin_resultados');
      
      await driver.sleep(2000);
      
      // Verificar que no hay resultados visibles
      const resultados = await driver.findElements(By.css('.student-card:not([style*="display: none"])'));
      expect(resultados.length).toBe(0);
      
      await takeScreenshot('sin_resultados_confirmado');
      console.log('✅ CN-004 EXITOSO');
    });
  });

  describe('🟡 Prueba de Límites - Búsqueda Parcial', () => {
    test('CL-004: Debe buscar con texto parcial', async () => {
      console.log('🧪 Iniciando CL-004: Búsqueda Parcial');
      
      const searchBox = await driver.findElement(By.id('searchInput'));
      await searchBox.clear();
      await searchBox.sendKeys('Mar'); // Texto parcial
      
      await takeScreenshot('busqueda_texto_parcial');
      
      await driver.sleep(2000);
      
      // Verificar que encuentra resultados parciales
      const resultados = await driver.findElements(By.css('.student-card:not([style*="display: none"])'));
      expect(resultados.length).toBeGreaterThan(0);
      
      await takeScreenshot('resultados_parciales');
      console.log('✅ CL-004 EXITOSO');
    });
  });
});
