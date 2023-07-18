import {DataTypes} from 'sequelize';
import db from '../config/db.js';

const Categoria = db.define('categorias',{
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    estado:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    timestamps: false
});

Categoria.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });

export default Categoria;