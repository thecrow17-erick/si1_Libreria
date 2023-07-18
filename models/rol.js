import {DataTypes} from 'sequelize';
import db from '../config/db.js';


const Rol = db.define('roles',{
    nombre : {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    estado:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
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