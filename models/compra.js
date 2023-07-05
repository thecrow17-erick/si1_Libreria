import {DataTypes} from 'sequelize';
import db from '../config/db.js';
import Proveedor from './proveedor.js';
import Libro from './libros.js';
const NotaCompra = db.define('nota_compra',{
  fecha:{
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0.00
  },
  proveedorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Proveedor,
      key: 'id'
    }
  }
},{
  timestamps: false
})
NotaCompra.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });


//detalle compra
const DetalleCompra = db.define('detalle_compra',{
  libroId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Libro,
        key: 'id'
    },
    primaryKey: true
  },
  NotaCompraId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: NotaCompra,
        key: 'id'
    },
    primaryKey: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  importe: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
})

export default NotaCompra;
export {
  DetalleCompra
}