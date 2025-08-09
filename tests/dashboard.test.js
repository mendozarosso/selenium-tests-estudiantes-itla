const { By } = require('selenium-webdriver');
const { setupDriver, takeScreenshot } = require('../config/test-setup');

const APP_URL = 'file:///C:/Users/jason/programacion/SystemaDeGestionEstudiantes/index.html';

describe('HU-001: Visualización del Dashboard', () => {
  let driver;

  beforeAll(async () => {
    driver = await setupDriver(APP_URL);
    await driver.sleep(2000); // Esperar que cargue
  });

  describe('Camino Feliz - Dashboard con datos', () => {
    test('Debe mostrar las estadísticas del dashboard correctamente', async () => {
      // Tomar captura inicial
      await takeScreenshot('dashboard_inicial');

      // Verificar que el título de la página esté presente
      const pageTitle = await driver.getTitle();
      expect(pageTitle).toContain('Sistema de Gestión de Estudiantes');

      // Verificar que las estadísticas están presentes
      const totalStudentsElement = await driver.findElement(By.id('totalStudents'));
      const activeStudentsElement = await driver.findElement(By.id('activeStudents'));
      const avgAgeElement = await driver.findElement(By.id('avgAge'));
      const totalCareersElement = await driver.findElement(By.id('totalCareers'));

      // Verificar que los elementos existen y son visibles
      expect(await totalStudentsElement.isDisplayed()).toBe(true);
      expect(await activeStudentsElement.isDisplayed()).toBe(true);
      expect(await avgAgeElement.isDisplayed()).toBe(true);
      expect(await totalCareersElement.isDisplayed()).toBe(true);

      // Obtener los valores
      const totalStudents = await totalStudentsElement.getText();
      const activeStudents = await activeStudentsElement.getText();
      const avgAge = await avgAgeElement.getText();
      const totalCareers = await totalCareersElement.getText();

      console.log(`📊 Estadísticas encontradas:`);
      console.log(`   Total estudiantes: ${totalStudents}`);
      console.log(`   Estudiantes activos: ${activeStudents}`);
      console.log(`   Edad promedio: ${avgAge}`);
      console.log(`   Total carreras: ${totalCareers}`);

      // Verificar que los valores son números válidos
      expect(parseInt(totalStudents)).toBeGreaterThanOrEqual(0);
      expect(parseInt(activeStudents)).toBeGreaterThanOrEqual(0);
      expect(parseInt(avgAge)).toBeGreaterThanOrEqual(0);
      expect(parseInt(totalCareers)).toBeGreaterThanOrEqual(0);

      // Tomar captura final
      await takeScreenshot('dashboard_estadisticas_verificadas');
    });

    test('Debe mostrar la lista de estudiantes en el dashboard', async () => {
      // Verificar que la sección de estudiantes existe
      const studentsSection = await driver.findElement(By.id('studentsList'));
      expect(await studentsSection.isDisplayed()).toBe(true);

      // Tomar captura de la lista
      await takeScreenshot('dashboard_lista_estudiantes');
    });
  });

  describe('Prueba Negativa - Dashboard sin datos', () => {
    test('Debe manejar correctamente cuando no hay estudiantes', async () => {
      // Limpiar localStorage para simular sin datos
      await driver.executeScript('localStorage.clear();');
      await driver.navigate().refresh();
      await driver.sleep(2000);

      // Verificar que las estadísticas muestran 0
      const totalStudentsElement = await driver.findElement(By.id('totalStudents'));
      const activeStudentsElement = await driver.findElement(By.id('activeStudents'));
      const avgAgeElement = await driver.findElement(By.id('avgAge'));
      const totalCareersElement = await driver.findElement(By.id('totalCareers'));

      const totalStudents = await totalStudentsElement.getText();
      const activeStudents = await activeStudentsElement.getText();
      const avgAge = await avgAgeElement.getText();
      const totalCareers = await totalCareersElement.getText();

      expect(totalStudents).toBe('0');
      expect(activeStudents).toBe('0');
      expect(avgAge).toBe('0');
      expect(totalCareers).toBe('0');

      console.log('✅ Dashboard maneja correctamente estado sin datos');
      await takeScreenshot('dashboard_sin_datos');
    });
  });

  describe('Prueba de Límites - Dashboard con muchos datos', () => {
    test('Debe manejar correctamente gran cantidad de estudiantes', async () => {
      // Crear datos de prueba con muchos estudiantes
      const testData = [];
      for (let i = 1; i <= 50; i++) {
        testData.push({
          id: i,
          nombre: `Estudiante${i}`,
          apellido: `Apellido${i}`,
          matricula: `MAT${i.toString().padStart(4, '0')}`,
          carrera: i % 4 === 0 ? 'Ingeniería de Software' : 
                  i % 3 === 0 ? 'Redes y Telecomunicaciones' :
                  i % 2 === 0 ? 'Multimedia' : 'Telemática',
          edad: 18 + (i % 15),
          activo: i % 10 !== 0, // 90% activos
          fechaRegistro: new Date().toLocaleDateString()
        });
      }

      // Inyectar datos en localStorage
      await driver.executeScript(`
        localStorage.setItem('estudiantes', '${JSON.stringify(testData)}');
      `);

      await driver.navigate().refresh();
      await driver.sleep(3000); // Esperar más tiempo para procesar

      // Verificar estadísticas con muchos datos
      const totalStudentsElement = await driver.findElement(By.id('totalStudents'));
      const activeStudentsElement = await driver.findElement(By.id('activeStudents'));
      const avgAgeElement = await driver.findElement(By.id('avgAge'));
      const totalCareersElement = await driver.findElement(By.id('totalCareers'));

      const totalStudents = parseInt(await totalStudentsElement.getText());
      const activeStudents = parseInt(await activeStudentsElement.getText());
      const avgAge = parseInt(await avgAgeElement.getText());
      const totalCareers = parseInt(await totalCareersElement.getText());

      expect(totalStudents).toBe(50);
      expect(activeStudents).toBe(45); // 90% de 50
      expect(avgAge).toBeGreaterThan(15);
      expect(avgAge).toBeLessThan(40);
      expect(totalCareers).toBe(4);

      console.log(`📊 Dashboard con muchos datos:`);
      console.log(`   Total: ${totalStudents}, Activos: ${activeStudents}`);
      console.log(`   Edad promedio: ${avgAge}, Carreras: ${totalCareers}`);

      await takeScreenshot('dashboard_muchos_datos');
    });
  });
});
