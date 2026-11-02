const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./app');

(async () => {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  console.log('MEMORIA Mongo OK');

  const log = (t, r) => console.log(`${t} -> ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
  let fail = 0;
  const check = (t, r, esperado) => {
    log(t, r);
    if (r.status !== esperado) { console.error(`  ✗ esperado ${esperado}`); fail++; }
  };

  // 1. Genero
  let r = await request(app).post('/api/generos').send({ nombre: 'Acción', estado: 'Activo', descripcion: 'test' });
  check('POST genero', r, 201);
  const generoId = r.body.data?._id;
  r = await request(app).get('/api/generos');
  check('GET generos', r, 200);
  r = await request(app).put(`/api/generos/${generoId}`).send({ descripcion: 'editada' });
  check('PUT genero', r, 200);

  // Genero inactivo para regla de media
  r = await request(app).post('/api/generos').send({ nombre: 'InactivoX', estado: 'Inactivo' });
  const generoInactivo = r.body.data?._id;

  // 2. Director
  r = await request(app).post('/api/directores').send({ nombres: 'Christopher Nolan' });
  check('POST director', r, 201);
  const directorId = r.body.data?._id;

  // 3. Productora
  r = await request(app).post('/api/productoras').send({ nombre: 'Disney', slogan: 'slogan', descripcion: 'desc' });
  check('POST productora', r, 201);
  const productoraId = r.body.data?._id;

  // 4. Tipo
  r = await request(app).post('/api/tipos').send({ nombre: 'Película', descripcion: 'unitaria' });
  check('POST tipo', r, 201);
  const tipoId = r.body.data?._id;

  // 5. Media OK
  const mediaBody = {
    serial: 'MOV-0001', titulo: 'El origen', sinopsis: 'Sueños',
    url: 'https://ejemplo.com/el-origen', imagen: 'https://ejemplo.com/a.jpg',
    anioEstreno: 2010, genero: generoId, director: directorId, productora: productoraId, tipo: tipoId
  };
  r = await request(app).post('/api/medias').send(mediaBody);
  check('POST media', r, 201);
  const mediaId = r.body.data?._id;

  // 6. Media con genero inactivo debe fallar 400
  r = await request(app).post('/api/medias').send({ ...mediaBody, serial: 'MOV-0002', url: 'https://ejemplo.com/2', genero: generoInactivo });
  check('POST media genero inactivo (debe 400)', r, 400);

  // 7. Media serial duplicado debe fallar 400
  r = await request(app).post('/api/medias').send({ ...mediaBody, url: 'https://ejemplo.com/otra' });
  check('POST media duplicada (debe 400)', r, 400);

  // 8. GET medias con populate
  r = await request(app).get('/api/medias');
  check('GET medias', r, 200);
  console.log('  populate genero:', r.body.data?.[0]?.genero?.nombre);

  // 9. PUT + DELETE media
  r = await request(app).put(`/api/medias/${mediaId}`).send({ titulo: 'El origen remaster' });
  check('PUT media', r, 200);
  r = await request(app).delete(`/api/medias/${mediaId}`);
  check('DELETE media', r, 200);

  // 10. GET por id 404
  r = await request(app).get(`/api/medias/${mediaId}`);
  check('GET media eliminada (debe 404)', r, 404);

  await mongoose.disconnect();
  await mongod.stop();
  console.log(fail === 0 ? '✅ TODAS LAS PRUEBAS PASARON' : `❌ ${fail} PRUEBAS FALLARON`);
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
