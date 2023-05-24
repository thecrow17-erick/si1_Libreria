import Rol from './rol.js';
import Usuario,{iniciarSesion, cerrarSesion} from './usuario.js';



//relacion de uno a muchos. rol -> usuario
Rol.hasMany(Usuario, {
    foreignKey: {
        name: 'rolId',
        allowNull: false
    }
});
Usuario.belongsTo(Rol, {
    foreignKey: {
        name: 'rolId',
        allowNull: false
    }
});



export {
    Rol,
    Usuario,
    iniciarSesion,
    cerrarSesion
}