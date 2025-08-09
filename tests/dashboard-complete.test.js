// tests/dashboard-complete.test.js
const { By } = require('selenium-webdriver');
const { setupDriver, takeScreenshot } = require('../config/test-setup');

const APP_URL = 'file:///C:/Users/jason/programacion/SystemaDeGestionEstudiantes/index.html';

describe('HU-001: Visualización del Dashboard', () => {
  let driver;
  
  beforeAll(async () => {
    driver = await setupDriver(APP_URL);
    await driver.sleep(2000);
  });

  describe('🟢 Camino Feliz - Dashboard con datos', () => {
    
    test('CP-001: Debe mostrar correctamente las estadísticas del dashboard', async () => {
      console.log('🧪 Iniciando CP-001: Estadísticas del Dashboard');
      
      // Agregar datos de prueba
      await driver.executeScript(`
        const testData = [
          {
            id: 1,
            nombre: "Juan",
            apellido: "Pérez",
            matricula: "2024001",
            carrera: "Ingeniería de Software",
            edad: 20,
            activo: true,
            fechaRegistro: "15/1/2025"
          },
          {
            id: 2,
            nombre: "María",
            apellido: "González",
            matricula: "2024002", 
            carrera: "Redes y Telecomunicaciones",
            edad: 22,
            activo: true,
            fechaRegistro: "16/1/2025"
          }
        ];
        localStorage.setItem('estudiantes', JSON.stringify(testData));
        location.reload();
      `);
      
      await driver.sleep(3000);
      await takeScreenshot('dashboard_con_datos');

      // Verificar estadísticas
      const total = await driver.findElement(By.id('totalStudents')).getText();
      const activos = await driver.findElement(By.id('activeStudents')).getText();
      
      console.log(`📊 Total: ${total}, Activos: ${activos}`);
      
      expect(parseInt(total)).toBe(2);
      expect(parseInt(activos)).toBe(2);
      
      await takeScreenshot('estadisticas_verificadas');
      console.log('✅ CP-001 EXITOSO');
    });
  });

  describe('🔴 Prueba Negativa - Sin datos', () => {
    
    test('CN-001: Debe mostrar ceros cuando no hay estudiantes', async () => {
      console.log('🧪 Iniciando CN-001: Dashboard Sin Datos');

      // 🔴 AGREGADO: limpiar datos y refrescar antes de verificar
      await driver.executeScript('localStorage.clear();');
      await driver.executeScript('sessionStorage.clear();');
      await driver.navigate().refresh();
      await driver.sleep(2000); // Esperar a que cargue sin datos

      await takeScreenshot('dashboard_vacio');
      
      const total = await driver.findElement(By.id('totalStudents')).getText();
      const activos = await driver.findElement(By.id('activeStudents')).getText();
      
      expect(parseInt(total)).toBe(0);
      expect(parseInt(activos)).toBe(0);
      
      console.log('✅ CN-001 EXITOSO: Dashboard vacío manejado correctamente');
    });
  });

  describe('🟡 Prueba de Límites - Muchos datos', () => {
    
    test('CL-001: Debe manejar 20 estudiantes correctamente', async () => {
      console.log('🧪 Iniciando CL-001: Muchos Estudiantes');
      
      // Crear 20 estudiantes
      await driver.executeScript(`
        const testData = [];
        for (let i = 1; i <= 20; i++) {
          testData.push({
            id: i,
            nombre: "Test" + i,
            apellido: "Student" + i,
            matricula: "TST" + i.toString().padStart(3, '0'),
            carrera: "Ingeniería de Software",
            edad: 18 + (i % 10),
            activo: i % 3 !== 0,
            fechaRegistro: new Date().toLocaleDateString()
          });
        }
        localStorage.setItem('estudiantes', JSON.stringify(testData));
        location.reload();
      `);
      
      await driver.sleep(3000);
      await takeScreenshot('muchos_estudiantes');
      
      const total = await driver.findElement(By.id('totalStudents')).getText();
      expect(parseInt(total)).toBe(20);
      
      console.log(`📊 Maneja ${total} estudiantes correctamente`);
      console.log('✅ CL-001 EXITOSO');
    });
  });
}, 60000);
