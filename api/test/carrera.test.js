const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const { createCarreraTest, putCarreraTest } = require('../controllersTest/carrera_controllers_test');

describe('Pruebas de carrera', () => {
  it('debería retornar un código de estado 200', async () => {
    const response = await request(app).get('/car?page=1&limit=10');
    assert.strictEqual(response.status, 200);
  });

  it('debería retornar una lista de carreras', async () => {
    const response = await request(app).get('/car?page=1&limit=10');
    assert.strictEqual(response.status, 200);
    assert.strictEqual(Array.isArray(response.body), true);
  });

  it('debería crear una nueva carrera correctamente', () => {
    const nuevaCarreraTest = {
      nombre: 'Estrategias de Persistencia',
    };

    const req = {
      body: nuevaCarreraTest,
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

    createCarreraTest(req, res);

    assert.strictEqual(res.statusCode, 201);
    assert.deepStrictEqual(res.body.nombre, nuevaCarreraTest.nombre);
  });

  describe('Pruebas de putCarreraTest', () => {
    
    it('debería retornar un código de estado 200 en caso de éxito', () => {
      const req = {
        body: {
          nombre: 'Inglés',
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
  
      putCarreraTest(req, res);
    });
  
    it('debería retornar un código de estado 404 si la carrera no existe', () => {
      const req = {
        body: {
          nombre: 'Introducción a la Programación',
        },
        params: {
          id: 1,
        },
      };
  
      const res = {
        sendStatus: (statusCode) => {
          assert.strictEqual(statusCode, 404);
        },
      };
  
      putCarreraTest(req, res);
    });
  
    it('debería retornar un código de estado 500 en caso de error', () => {
      const req = {
        body: {
          nombre: 'Desarrollo de Aplicaciones web',
        },
        params: {
          id: 1,
        },
      };
  
      const res = {
        sendStatus: (statusCode) => {
          assert.strictEqual(statusCode, 500);
        },
      };
  
      putCarreraTest(req, res);
    });
  });
});
