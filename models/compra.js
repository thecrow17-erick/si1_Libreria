import {DataTypes} from 'sequelize';
import db from '../config/db.js';
import Proveedor from './proveedor.js';
import Libro from './libros.js';
import Usuario from './usuario.js';
import Inventario from './inventario.js';
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
  },
  compradorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
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
    defaultValue: 0
  },
  precio: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
},{
  timestamps: false,
  hooks:{
    beforeBulkCreate:[
      function(instancia){
        instancia.map((detalle_venta) =>{
          const total = detalle_venta.precio * detalle_venta.cantidad;
          detalle_venta.importe = total;
        })
      }
    ],
    afterBulkCreate: [
      async function(instancia){
        await Promise.all(instancia.map(async(detalle_compra)=>{
          const totalNuevo = detalle_compra.importe;
          await NotaCompra.increment('total',{
            by: totalNuevo,
            where:{
              id: detalle_compra.NotaCompraId
            }
          })
        }));
      },
      async function(instancia){
        await Promise.all(instancia.map(async(detalle_compra)=>{
          await Inventario.increment('cantidad', {by: detalle_compra.cantidad,where:{
            libroId: detalle_compra.libroId
          }})    
        }))
      }
    ]
  }
})

export default NotaCompra;
export {
  DetalleCompra
}