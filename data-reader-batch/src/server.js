const { performance } = require('perf_hooks')
const RevenueSyncService = require('./services/revenue-sync.service')
const syncService = new RevenueSyncService()

;(async () => {
  const startTime = performance.now()
  // Actualmente como se consume la api que recibe readPageSize y la pagina
  // el metodo syncService.sync recibe 3 parametros readPageSize (cantidad de registros del bloque a leer)
  // startPage: pagina en la que empieza y endPage: pagina en la finaliza
  // perro si ahora es un batch y va a leer una tabla y traer un bloque de registros con un determinado estado
  // entonces tal vez solo deberia pasarse el readPageSize incluso que este sea un valor de configuracion de esta manera e
  // ste batch (esta app) no necesite ningun parametro
  // por ahora para no romper lo que se hizo se pasaran hardcodeado estos parametros
  await syncService.sync(100, 0, 1)
  const duration = performance.now() - startTime
  console.log(`Proceso culmindao, duración: ${duration}`)
})()
