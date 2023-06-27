'use strict';
module.exports = (sequelize, Datatypes) => {
    const user = sequelize.define('user', {
        email: Datatypes.STRING,
        id_alumno: Datatypes.INTEGER,
        password: Datatypes.STRING,
        token: Datatypes.STRING
    },{});

    user.associate = function(models) {
        user.belongsTo(models.alumno,
        {
            as: 'user-alumno',
            foreignKey: 'id_alumno'
        })
    };
    
    return user;
}