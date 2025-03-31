// routes/libros.js
//Configura todas las rutas relacionadas con la gestion de libros
const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libro_controller');

// Rutas 
router.get('/', (req, res) => res.render('home/index',{title : "Inicio"})); // Ruta home
router.get('/libros', (req, res) => {
  if (req.query.q) {
    return libroController.buscarLibros(req, res);
  }
  return libroController.listarLibros(req, res);
});

router.get('/libros/nuevo', libroController.formularioNuevoLibro);
router.post('/libros', libroController.guardarLibro);
router.get('/libros/:id/editar', libroController.editarLibro); // Formulario editar
router.put('/libros/:id', libroController.actualizarLibro); // Procesar actualización
router.delete('/libros/:id/eliminar', libroController.eliminarLibro); // Procesar eliminación

module.exports = router;