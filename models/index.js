import Rol from './rol.js';
import Usuario,{iniciarSesion, cerrarSesion} from './usuario.js';
import Autor from './autor.js';
import Categoria from './categoria.js';
import Editorial from './editorial.js';
import Libro,{ LibroAutor}from './libros.js';
//relacion de 1 a muchos, Rol -> usuario
Rol.hasMany(Usuario, {
    foreignKey: {
        name: 'rolId',
        allowNull: false
    }
})
Usuario.belongsTo(Rol, {
    foreignKey: {
        name: 'rolId',
        allowNull: false
    }
});
//relacion de 1 a muchos, Editorial -> Libro
Editorial.hasMany(Libro, {
    foreignKey: {
        name: 'editorialId',
        allowNull: false
    }
})
Libro.belongsTo(Editorial, {
    foreignKey: {
        name: 'editorialId',
        allowNull: false
    }
});

//relacion de 1 a muchos, categoria -> Libro
Categoria.hasMany(Libro, {
    foreignKey: {
        name: 'categoriaId',
        allowNull: false
    }
})
Libro.belongsTo(Categoria, {
    foreignKey: {
        name: 'categoriaId',
        allowNull: false
    }
});
//relacion de muchos a muchos -> autor y categoria
Libro.belongsToMany(Autor, { through: LibroAutor ,foreignKey:{
    name: 'libroId',
    allowNull: false
}});
Autor.belongsToMany(Libro, { through: LibroAutor , foreignKey:{
    name: 'autorId',
    allowNull: false
}});

export {
    Rol,
    Usuario,
    iniciarSesion,
    cerrarSesion,
    Autor,
    Categoria,
    Editorial,
    Libro,
    LibroAutor
}