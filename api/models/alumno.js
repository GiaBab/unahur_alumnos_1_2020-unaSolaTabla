'use strict';
module.exports = (sequelize, DataTypes) => {
    const alumno = sequelize.define('alumno', {
    nombre: DataTypes.STRING,
    }, {tableName: 'alumnos'});
    
    alumno.associate = function(models) {    
  	//asociacion a carrera (pertenece a:)
    alumno.belongsTo(models.inscripcion// modelo al que pertenece
    ,{
      as : 'Inscripcion-Alumno-Relacion',  // nombre de mi relacion
      foreignKey: 'id_inscripcion'     // campo con el que voy a igualar
    })
  	/////////////////////
    };
    return alumno;
};
