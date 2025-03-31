//El home controller es el modulo principal que maneja las operaciones relacionadas con libros en la aplicacion Express
//Actua como un intermediario entre las rutas y el servicio 
const { text } = require('express');
const libroService = require('../services/libro_Service');

const homeController = {
  //METODO [GET]
  listarLibros: async (req, res) => {
    //query : maneja parametros de consulta
    const { msg, data } = await libroService.getDataHome(req.query);
    if (msg) return res.status(500).send(msg); //Manejo errores 
    //Se renderiza con los datos 
    res.render('lista/listaLibros', {
      title: "Lista de libros",
      libros: data.libros,
      pagina: data.pagina,
      totalPaginas: data.totalPaginas,
      q: data.q,
      success_msg: req.flash('success'), 
      error_msg: req.flash('error')     
    });
  },
 
  //METODO [GET]
  formularioNuevoLibro: (req, res) => {
    res.render('forms/formularioLibro', {
      title: "Nuevo Libro",
      libro: null 
    }); // Sin datos para crear
  },
  
  //METODO [POST]
  guardarLibro: async (req, res) => {
    const { titulo, autor, anio_publicacion, genero } = req.body;
  
    // Validacion de los campos de titulo y autor
    if (!titulo || !autor) {
      req.flash('error', 'El título y el autor son campos obligatorios');
      return res.redirect('/libros/nuevo');
    }
    //Si lo cumple,se comunica con el servicio
    try {
      const nuevoLibro = {
        titulo,
        autor,
        anio_publicacion: anio_publicacion || null,
        genero: genero || 'Sin género especificado'
      };
  
      //Llama al servicio
      const { msg, data } = await libroService.crearLibro(nuevoLibro);
  
      if (msg) {
        req.flash('error', msg);
        return res.redirect('/libros/nuevo');
      }
  

      //req.flash('success', 'Libro creado correctamente');
      if (msg) {
        req.flash('error', msg);
        return res.redirect('/libros/nuevo');
      }
  
      // Si se guardó correctamente
      req.flash('success', 'Libro creado correctamente');
      return res.redirect('/libros'); // Usa redirect, no render
  
    } catch (error) {
      //Manejar los errores
      console.error('Error al crear libro:', error);
      req.flash('error', 'Ocurrió un error al guardar el libro');
      res.redirect('/libros/nuevo');
    }
  },
  
  //METODO [GET]
  editarLibro: async (req, res) => {
    try {
      //obtiene el id del libro
      const { id } = req.params;
      //Se obtiene el libro del servicio
      const { data: libro } = await libroService.getLibroById(id);
      //Si no esta el libro,redirecciona
      if (!libro) {
        req.flash('error', 'Libro no encontrado');
        return res.redirect('/libros');
      }
      //Se renderiza el formulario para editarlo
      res.render('forms/formularioLibro', {
        title : "Editar Libro",
        libro, // Pasamos el libro encontrado
        modoEdicion: true //bandera para modo edicion
      });
    } catch (error) {
      //Manejar los errores
      req.flash('error', 'Error al cargar el libro');
      res.redirect('/libros');
    }
  },

  //METODO [PUT]
  actualizarLibro: async (req, res) => {
    try {
      //Se obtiene el id y los demas datos
      const { id } = req.params;
      const { titulo, autor, anio_publicacion, genero } = req.body;

      // Llamamos al servicio para actualizar el libro
      const { msg, data } = await libroService.updateLibro(id, {
        titulo,
        autor,
        anio_publicacion,
        genero
      });
      //Si hay mensaje de error
      if (msg) {
        req.flash('error', 'Error al actualizar el libro');
        return res.redirect(`/libros/${id}/editar`);
      }
      //Si no muestra un mensaje de exito
      req.flash('success', 'Libro actualizado correctamente');
      res.redirect('/libros');
    } catch (error) {
      //Maneja los posibles errores
      req.flash('error', 'Error al actualizar el libro');
      res.redirect(`/libros/${id}/editar`);
    }
  },

  //METODO [DELETE]
  eliminarLibro: async (req, res) => {
    //Se obtiene el id
    const { id } = req.params;
    //Se llama al servicio para eliminar
    const { success, msg } = await libroService.deleteLibro(id);
    //Si ocurre un error
    if (!success) {
      req.flash('error', msg);
      return res.redirect('/libros');//redirecciona
    }
   //Mensaje de exito
    req.flash('success', 'Libro eliminado correctamente');
    res.redirect('/libros');
  },

  //Buscar libros
  buscarLibros: async (req, res) => {
    try {
      //Se obtienen los parametros de busqueda
      const { q, pagina = 1 } = req.query;
      const itemsPorPagina = 10; // 
      //Se llama al servicio
      const { success, data, message } = await libroService.obtenerLibros(q, 
        { 
          pagina: parseInt(pagina),
          itemsPorPagina 
        }
      );
      //Si ocurre un error
      if (!success) {
        req.flash('error', message);
        return res.redirect('/libros');
      }
      //Renderiza la pagina 
      res.render('lista/listaLibros', {
        title: "Lista de libros",
        libros: data.libros,
        q: q || '',//Lo que se busca actualmente
        pagina: data.pagina,//la pagina
        totalPaginas: data.totalPaginas
      });
    } catch (error) {
      //Manejo de errores
      console.error("Error buscando libros:", error);
      req.flash('error', 'Error al buscar libros');
      res.redirect('/libros');
    }
  },
};

module.exports = homeController;