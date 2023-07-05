const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const { createAlumnoTest, putAlumnoTest } = require('../controllersTest/alumno_controllers_test');

describe('Pruebas de alumno', () => {
  it('debería retornar un código de estado 200', async () => {
    const response = await request(app).get('/alum?page=1&limit=10');
    assert.strictEqual(response.status, 200);
  });

  it('debería retornar una lista de alumnos', async () => {
    const response = await request(app).get('/alum?page=1&limit=10');
    assert.strictEqual(response.status, 200);
    assert.strictEqual(Array.isArray(response.body), true);
  });

  it('debería crear un nuevo alumno correctamente', () => {
    const newAlumnoTest = {
      nombre: 'Pablo',
      apellido: 'Romero',
    };

    const req = {
      body: newAlumnoTest,
    };

    const res = {
      statusCode: 0,
      body: null,
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      send: function (data) {
        this.body = data;
        return this;
      },
    };

    createAlumnoTest(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.body.nombre, newAlumnoTest.nombre);
  });

  describe('Pruebas de putAlumnoTest', () => {
    
    it('debería retornar un código de estado 200 en caso de éxito', () => {
      const req = {
        body: {
          nombre: 'Marcelo',
          apellido: 'Martillo',
        },
        params: {
          id: 1,
        },
      };
  
      const res = {
        sendStatus: (statusCode) => {
          assert.strictEqual(statusCode, 200);
        },
      };
  
      putAlumnoTest(req, res);
    });
  
    it('debería retornar un código de estado 404 si el alumno no existe', () => {
      const req = {
        body: {
          nombre: 'Avena',
          apellido: 'Harina',
        },
        params: {
          id: 2,
        },
      };
  
      const res = {
        sendStatus: (statusCode) => {
          assert.strictEqual(statusCode, 404);
        },
      };
  
      putAlumnoTest(req, res);
    });
  
    it('debería retornar un código de estado 500 en caso de error', () => {
      const req = {
        body: {
            nombre: 'Avena',
            apellido: 'Harina',
          },
          params: {
            id: 2,
          },
      };
  
      const res = {
        sendStatus: (statusCode) => {
          assert.strictEqual(statusCode, 500);
        },
      };
  
      putAlumnoTest(req, res);
    });
  });
});
