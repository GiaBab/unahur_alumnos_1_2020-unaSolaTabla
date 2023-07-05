const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const { createUsersTest, putUserTest } = require('../controllersTest/user_controllers_test');

describe('Pruebas de usuario', () => {
  it('debería retornar un código de estado 200', async () => {
    const response = await request(app).get('/user?page=1&limit=10');
    assert.strictEqual(response.status, 200);
  });

  it('debería retornar una lista de usuarios', async () => {
    const response = await request(app).get('/user?page=1&limit=10');
    assert.strictEqual(response.status, 200);
    assert.strictEqual(Array.isArray(response.body), true);
  });

  it('debería crear un nuevo usuario correctamente', () => {
    const newUserTest = {
      email: 'paola',
      password: 'contraseña',
      id_alumno: 8098,
    };

    const req = {
      body: newUserTest,
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

    createUsersTest(req, res);

    assert.strictEqual(res.statusCode, 201);
    assert.deepStrictEqual(res.body.email, newUserTest.email);
  });

  describe('Pruebas de putUser', () => {
    
    it('debería retornar un código de estado 200 en caso de éxito', () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          id_alumno: 12345,
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
  
      putUserTest(req, res);
    });
  
    it('debería retornar un código de estado 404 si el usuario no existe', () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          id_alumno: 12345,
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
  
      putUserTest(req, res);
    });
  
    it('debería retornar un código de estado 500 en caso de error', () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          id_alumno: 12345,
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
  
      putUserTest(req, res);
    });
  });
});
