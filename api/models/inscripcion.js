module.exports = (sequelize, DataTypes) => {
    const inscripcion = sequelize.define('inscripcion', {
        id_materia: DataTypes.INTEGER,
        id_alumno: DataTypes.INTEGER
    }, {tableName: 'inscripciones'});
    
    
    
        //asociacion a carrera (pertenece a:)
    inscripcion.associate = function(models) {
        inscripcion.hasMany(models.materia,  // Modelo al que pertenece
        {
        as: 'materia',                 // nombre de mi relacion
        foreignKey: 'id_inscripcion'       // campo con el que voy a igualar 
        })
    };

    inscripcion.associate = function(models) {
        inscripcion.hasMany(models.alumno,  // Modelo al que pertenece
        {
        as: 'alumno',                 // nombre de mi relacion
        foreignKey: 'id_inscripcion'       // campo con el que voy a igualar 
        })
    };
    ///////////////////// 
    return inscripcion;
};