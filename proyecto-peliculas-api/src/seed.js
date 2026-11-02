require('dotenv').config();
const connectDB = require('./config/db');
const Genero = require('./models/Genero');
const Director = require('./models/Director');
const Productora = require('./models/Productora');
const Tipo = require('./models/Tipo');

(async () => {
  await connectDB();

  await Genero.deleteMany({});
  await Director.deleteMany({});
  await Productora.deleteMany({});
  await Tipo.deleteMany({});

  await Genero.insertMany([
    { nombre: 'Acción', estado: 'Activo', descripcion: 'Películas con peleas, persecuciones y adrenalina' },
    { nombre: 'Aventura', estado: 'Activo', descripcion: 'Viajes, exploración y descubrimientos' },
    { nombre: 'Ciencia ficción', estado: 'Activo', descripcion: 'Futuro, tecnología y espacio' },
    { nombre: 'Drama', estado: 'Activo', descripcion: 'Historias emotivas y profundas' },
    { nombre: 'Terror', estado: 'Activo', descripcion: 'Suspenso, miedo y horror' }
  ]);

  await Director.insertMany([
    { nombres: 'Christopher Nolan', estado: 'Activo' },
    { nombres: 'Steven Spielberg', estado: 'Activo' },
    { nombres: 'Greta Gerwig', estado: 'Activo' }
  ]);

  await Productora.insertMany([
    { nombre: 'Disney', estado: 'Activo', slogan: 'Donde los sueños se hacen realidad', descripcion: 'Productora estadounidense' },
    { nombre: 'Warner Bros', estado: 'Activo', slogan: 'Entertenimiento de clase mundial', descripcion: 'Productora y distribuidora' },
    { nombre: 'Paramount', estado: 'Activo', slogan: 'Historias que perduran', descripcion: 'Estudio histórico de Hollywood' },
    { nombre: 'MGM', estado: 'Activo', slogan: 'Ars Gratia Artis', descripcion: 'Metro-Goldwyn-Mayer' }
  ]);

  await Tipo.insertMany([
    { nombre: 'Película', descripcion: 'Producción de larga duración unitaria' },
    { nombre: 'Serie', descripcion: 'Producción por episodios/temporadas' }
  ]);

  console.log('🌱 Datos iniciales insertados');
  process.exit(0);
})();
