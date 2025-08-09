const { By } = require('selenium-webdriver');
const { takeScreenshot, setupDriver } = require('../config/test-setup');

const APP_URL = 'file:///C:/Users/jason/programacion/SystemaDeGestionEstudiantes/index.html';

describe('HU-006: Eliminar Estudiante', () => {
  let driver;

  beforeEach(async () => {
    driver = await setupDriver(APP_URL);
    await driver.sleep(2000);
    
    // Crear estudiante para eliminar
    await driver.executeScript(`
      const testStudent = {
        id: 777,
        nombre: "Elena",
        apellidos: "Rodríguez",
        carrera: "Diseño Gráfico",
        edad: 24,
        activo: 1
      };
      let students = JSON.parse(localStorage.getItem('estudiantes') || '[]');
      students.push(testStudent);
      localStorage.setItem('estudiantes', JSON.stringify(students));
      location.reload();
    `);
    await driver.sleep(2000);
  });

  describe('🟢 Camino Feliz - Eliminación Exitosa', () => {
    test('CP-006: Debe eliminar estudiante correctamente', async () => {
      console.log('🧪 Iniciando CP-006: Eliminar Estudiante');
      
      const initialCount = await driver.findElements(By.css('.student-card'));
      console.log(`📊 Estudiantes iniciales: ${initialCount.length}`);
      
      const deleteButtons = await driver.findElements(By.css('.delete-btn'));
      if (deleteButtons.length > 0) {
        await takeScreenshot('antes_eliminar');
        
        await deleteButtons[0].click();
        await driver.sleep(1000);
        
        // Confirmar eliminación
        await driver.switchTo().alert().accept();
        await driver.sleep(2000);
        
        const finalCount = await driver.findElements(By.css('.student-card'));
        expect(finalCount.length).toBe(initialCount.length - 1);
        
        await takeScreenshot('estudiante_eliminado');
        console.log('✅ CP-006 EXITOSO');
      }
    });
  });

  describe('🔴 Prueba Negativa - Cancelar Eliminación', () => {
    test('CN-006: Debe cancelar eliminación correctamente', async () => {
      console.log('🧪 Iniciando CN-006: Cancelar Eliminación');
      
      const initialCount = await driver.findElements(By.css('.student-card'));
      
      const deleteButtons = await driver.findElements(By.css('.delete-btn'));
      if (deleteButtons.length > 0) {
        await takeScreenshot('antes_cancelar');
        
        await deleteButtons[0].click();
        await driver.sleep(1000);
        
        // Cancelar eliminación
        await driver.switchTo().alert().dismiss();
        await driver.sleep(1000);
        
        const finalCount = await driver.findElements(By.css('.student-card'));
        expect(finalCount.length).toBe(initialCount.length);
        
        await takeScreenshot('eliminacion_cancelada');
        console.log('✅ CN-006 EXITOSO');
      }
    });
  });

  describe('🟡 Prueba de Límites - Eliminar Último', () => {
    test('CL-006: Debe manejar eliminación del último estudiante', async () => {
      console.log('🧪 Iniciando CL-006: Eliminar Último');
      
      // Eliminar todos excepto uno
      await driver.executeScript(`
        localStorage.setItem('estudiantes', JSON.stringify([{
          id: 1,
          nombre: "Último",
          apellidos: "Estudiante",
          carrera: "Test",
          edad: 20,
          activo: 1
        }]));
        location.reload();
      `);
      await driver.sleep(2000);
      
      await takeScreenshot('ultimo_estudiante');
      
      const deleteButtons = await driver.findElements(By.css('.delete-btn'));
      if (deleteButtons.length > 0) {
        await deleteButtons[0].click();
        await driver.sleep(1000);
        
        await driver.switchTo().alert().accept();
        await driver.sleep(2000);
        
        // Verificar dashboard vacío
        const total = await driver.findElement(By.id('totalStudents')).getText();
        expect(parseInt(total)).toBe(0);
        
        await takeScreenshot('dashboard_vacio_final');
        console.log('✅ CL-006 EXITOSO');
      }
    });
  });
});
