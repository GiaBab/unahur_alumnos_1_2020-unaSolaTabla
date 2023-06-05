'use strict';
module.exports = (sequelize, DataTypes) => {
    const inscripcion = sequelize.define('inscripcion', {
        id_materia: DataTypes.INTEGER,
        id_alumno: DataTypes.INTEGER
    }, {tableName: 'inscripciones'});
    
    
    
        //asociacion a carrera (pertenece a:)
    inscripcion.associate = function(models) {
        inscripcion.belongsTo(models.materia,  // Modelo al que pertenece
        {
            as: 'Inscripcion-Materia-Relacion',                 // nombre de mi relacion
            foreignKey: 'id_materia'       // campo con el que voy a igualar 
        }),

        inscripcion.belongsTo(models.alumno,  // Modelo al que pertenece
        {
            as: 'Inscripcion-Alumno-Relacion',                 // nombre de mi relacion
            foreignKey: 'id_alumno'       // campo con el que voy a igualar 
        })
    };
    
    return inscripcion;
};