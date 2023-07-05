const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const { createInscripcionTest, putInscripcionTest } = require('../controllersTest/inscripciones_controllers_test');

describe('Pruebas para las Inscripciones', () => {
  it('debería retornar un código de estado 200', async () => {
    const response = await request(app).get('/ins?page=1&limit=10');
    assert.strictEqual(response.status, 200);
  });

  it('debería retornar una lista de incripciones', async () => {
    const response = await request(app).get('/ins?page=1&limit=10');
    assert.strictEqual(response.status, 200);
    assert.strictEqual(Array.isArray(response.body), true);
  });

  it('debería crear una nueva inscripción correctamente', () => {
    const newInscripcionTest = {
      id_alumno: 4,
      id_materia: 6435,
    };

    const req = {
      body: newInscripcionTest,
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

    createInscripcionTest(req, res);

    assert.strictEqual(res.statusCode, 201);
    assert.deepStrictEqual(res.body.id_alumno, newInscripcionTest.id_alumno);
    assert.deepStrictEqual(res.body.id_materia, newInscripcionTest.id_materia);
  });

  describe('Pruebas de putInscripcionTest', () => {
    
    it('debería retornar un código de estado 200 en caso de éxito', () => {
      const req = {
        body: {
            id_alumno: 4,
            id_materia: 6435,
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
  
      putInscripcionTest(req, res);
    });
  
    it('debería retornar un código de estado 404 si la inscripcion no existe', () => {
      const req = {
        body: {
            id_alumno: 4,
            id_materia: 6435,
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
  
      putInscripcionTest(req, res);
    });
  
    it('debería retornar un código de estado 500 en caso de error', () => {
      const req = {
        body: {
            id_alumno: 4,
            id_materia: 6435,
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
  
      putInscripcionTest(req, res);
    });
  });
});
