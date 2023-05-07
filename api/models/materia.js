'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define(
    'materia',
    {
      nombre: DataTypes.STRING,
    },
    {},
  );

  return materia;
};