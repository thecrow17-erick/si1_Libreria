import {DataTypes} from 'sequelize';
import db from '../config/db.js';
import Usuario from './usuario.js';
import TipoPago from './tipoPago.js';
import Libro from './libros.js';

const NotaVenta = db.define('nota_venta',{
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull:false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  vendedorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  tipoPagoId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoPago,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
},{
  timestamps: false
})


NotaVenta.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });


//detalle venta
const DetalleVenta = db.define('detalle_ventas',{
  libroId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Libro,
        key: 'id'
    },
    primaryKey: true
  },
  notaVentaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: NotaVenta,
        key: 'id'
    },
    primaryKey: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descuento: {
    type: DataTypes.DECIMAL(4,2),
    defaultValueL: 0.00,
    validate: {
      max: 1.00,
      min: 0.00
    }
  },
  importe: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  }
})

DetalleVenta.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });
export default NotaVenta;
export {
  DetalleVenta
}