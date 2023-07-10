import {DataTypes} from 'sequelize';
import db from '../config/db.js';


const Rol = db.define('roles',{
    nombre : {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
},{
    timestamps: false
}); 


Rol.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });

export default Rol;