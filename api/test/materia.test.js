const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const { createMateria, putMateria } = require('../controllersTest/materia_controllers_test');

describe('Pruebas de Materia', () => {
  it('debería retornar un código de estado 200', async () => {
    const response = await request(app).get('/mat?page=1&limit=10');
    assert.strictEqual(response.status, 200);
  });

  it('debería retornar una lista de materias', async () => {
    const response = await request(app).get('/mat?page=1&limit=10');
    assert.strictEqual(response.status, 200);
    assert.strictEqual(Array.isArray(response.body), true);
  });

  it('debería crear una nueva materia correctamente', () => {
    const newMateria = {
      nombre: 'Lógica',
      id_materia: 453,
    };

    const req = {
      body: newMateria,
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

    createMateria(req, res);

    assert.strictEqual(res.statusCode, 201);
    assert.deepStrictEqual(res.body.nombre, newMateria.nombre);
  });

  describe('Pruebas de putMateria', () => {
    
    it('debería retornar un código de estado 200 en caso de éxito', () => {
        const req = {
            body: {
              nombre: 'Lógica',
              id_materia: 5433,
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
  
      putMateria(req, res);
    });
  
    it('debería retornar un código de estado 404 si la materia no existe', () => {
        const req = {
            body: {
              nombre: 'Lógica',
              id_materia: 5433,
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
  
      putMateria(req, res);
    });
  
    it('debería retornar un código de estado 500 en caso de error', () => {
      const req = {
        body: {
          nombre: 'Lógica',
          id_materia: 5433,
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
  
      putMateria(req, res);
    });
  });
});
