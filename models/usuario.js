import {DataTypes} from 'sequelize';
import db from '../config/db.js';
import bcrypt from 'bcryptjs';
const Usuario = db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo :{
        type: DataTypes.STRING,
        allowNull: false
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: { 
        type: DataTypes.CHAR(10),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    hooks: {
        beforeCreate : async function(usuario) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        } 
});
Usuario.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

Usuario.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });


export default Usuario;