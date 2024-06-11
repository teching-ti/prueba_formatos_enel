/*colocar fecha en base al reloj del sistema, dentro de la casilla 'fecha'*/
let cargarFecha = () => {
  let fecha = document.getElementById("fecha");
  dia = new Date().toLocaleDateString();
  fecha.value = dia;
};
cargarFecha();
/*colocar fecha end*/

//obtener los datos del archivo
//uso de una petición fetch
fetch("../scripts/datos.json")
  .then((response) => response.json())
  .then((data) => {
    //la data obtenida será nombrada como users
    users = data;
    /*Autocompletado y llenado para los técnicos*/
    //llena las opciones de 'participantes tecnicos' del primer select que aparecerá por defecto

    llenarSelect(document.getElementById("solicitado"))
    completarFirmaSolicitante(document.getElementById("solicitado") ,document.getElementById("firma-solicitado"))

    // llenarSelectEncargado(document.querySelector(".tarea-encargado"))
  })
  .catch((error) => console.error("Error al cargar los datos:", error));


  // Función para llenar el select con opciones de nombres de los técnicos
function llenarSelect(elementoSelect) {
    //una vez con la data 'users' obtenida se podrá acceder a cada uno de los elementos dentro de ella
    users.tecnico.forEach((tecnico) => {
      const option = document.createElement("option");
      option.value = tecnico.name;
      option.textContent = tecnico.name;
      elementoSelect.appendChild(option);
    });
  }

  //autocompletar el select ya creado
  function autocompletarCampos(elementoSelect, datosParticipante) {
    elementoSelect.addEventListener("change", function () {
      const nombreSeleccionado = elementoSelect.value;
      const usuarioSeleccionado = users.tecnico.find(
        (tecnico) => tecnico.name === nombreSeleccionado
      );
      datosParticipante.querySelector(".dni").value =
      usuarioSeleccionado.dni;
      datosParticipante.querySelector(".cargo").value =
      usuarioSeleccionado.cargo;
      datosParticipante.querySelector(".firma").value =
      usuarioSeleccionado.firma;
    });
  }

  //autocompletarFirmaSolicitante
  function completarFirmaSolicitante(elementoSelect, solicitante){
    elementoSelect.addEventListener("change", function(){
      const nombreSeleccionado = elementoSelect.value;
      const usuarioSeleccionado = users.tecnico.find(
        (tecnico) => tecnico.name === nombreSeleccionado
      );
      solicitante.value = usuarioSeleccionado.firma
    })
  }

  /*Nuevas Tareas START*/
  /*Agregar Tareas*/
  let btnAgregarTarea = document.querySelector(".agregar-tarea")

  //Solo se podrán agregar 3 equipos/materiales adicionales
  btnAgregarTarea.addEventListener("click", function(){
    let numTareasCreadas = document.querySelectorAll(".contenedor-tareas").length
    if(numTareasCreadas<12){
      agregarTarea()
    }else{
      alert("Se ha alcanzado el máximo número permitido")
    }
  })

  /*Creando los elementos en agregar tarea*/
  function agregarTarea(){
    const contenedorTareas = document.querySelector(".tareas")
    const nuevaTarea = document.createElement('div');
    nuevaTarea.classList.add('contenedor-tareas');

    const inputDescripcion = document.createElement('input');
    inputDescripcion.type = 'text';
    inputDescripcion.classList.add('tarea-descripcion');
    inputDescripcion.placeholder = 'Tarea Descripción.';

    //select de encargado
    const selectEncargado = document.createElement('select');
    selectEncargado.classList.add('tarea-encargado');

    const optionEncargado = document.createElement('option');
    optionEncargado.textContent = '-Encargado-';
    optionEncargado.value = ""
    const optionEncargado1 = document.createElement('option');
    optionEncargado1.textContent = 'Jefe Cuadrilla de Balance';
    const optionEncargado2 = document.createElement('option');
    optionEncargado2.textContent = 'Operario de Balance';
    const optionEncargado3 = document.createElement('option');
    optionEncargado3.textContent = 'Chofer Ayudante de Balance';
    const optionEncargado4 = document.createElement('option');
    optionEncargado4.textContent = 'Inspeccionador de Balance';

    selectEncargado.append(optionEncargado, optionEncargado1, optionEncargado2, optionEncargado3, optionEncargado4);

    //select de tiempo estimado
    const selectTiempoEstimado = document.createElement('select')
    selectTiempoEstimado.classList.add('tiempo-estimado')

    const opTiempoEstimado = document.createElement('option')
    opTiempoEstimado.textContent = '-T. Estimado.-'
    opTiempoEstimado.setAttribute("selected", true)
    const opTiempoEstimado1 = document.createElement('option')
    opTiempoEstimado1.textContent = "5 minutos"
    const opTiempoEstimado2 = document.createElement('option')
    opTiempoEstimado2.textContent = "10 minutos"
    const opTiempoEstimado3 = document.createElement('option')
    opTiempoEstimado3.textContent = "20 minutos"
    const opTiempoEstimado4 = document.createElement('option')
    opTiempoEstimado4.textContent = "30 minutos"
    const opTiempoEstimado5 = document.createElement('option')
    opTiempoEstimado5.textContent = "1 hora"
    const opTiempoEstimado6 = document.createElement('option')
    opTiempoEstimado6.textContent = "1:30 horas"
    const opTiempoEstimado7 = document.createElement('option')
    opTiempoEstimado7.textContent = "2 horas"
    const opTiempoEstimado8 = document.createElement('option')
    opTiempoEstimado8.textContent = "2:30 horas"
    const opTiempoEstimado9 = document.createElement('option')
    opTiempoEstimado9.textContent = "3 horas"
    const opTiempoEstimado10 = document.createElement('option')
    opTiempoEstimado10.textContent = "3:30 horas"
    const opTiempoEstimado11 = document.createElement('option')
    opTiempoEstimado11.textContent = "4 horas"

    selectTiempoEstimado.append(opTiempoEstimado, opTiempoEstimado1, opTiempoEstimado2, opTiempoEstimado3, opTiempoEstimado4, opTiempoEstimado5, opTiempoEstimado6, opTiempoEstimado7, opTiempoEstimado8, opTiempoEstimado9, opTiempoEstimado10, opTiempoEstimado11)

    //select de tiempo real
    const selectTiempoReal = document.createElement('select')
    selectTiempoReal.classList.add('tiempo-real')

    const opTiempoReal = document.createElement('option')
    opTiempoReal.textContent = '-T. Real.-'
    opTiempoReal.setAttribute("selected", true)
    const opTiempoReal1 = document.createElement('option')
    opTiempoReal1.textContent = "5 minutos"
    const opTiempoReal2 = document.createElement('option')
    opTiempoReal2.textContent = "10 minutos"
    const opTiempoReal3 = document.createElement('option')
    opTiempoReal3.textContent = "20 minutos"
    const opTiempoReal4= document.createElement('option')
    opTiempoReal4.textContent = "30 minutos"
    const opTiempoReal5 = document.createElement('option')
    opTiempoReal5.textContent = "1 hora"
    const opTiempoReal6 = document.createElement('option')
    opTiempoReal6.textContent = "1:30 horas"
    const opTiempoReal7 = document.createElement('option')
    opTiempoReal7.textContent = "2 horas"
    const opTiempoReal8 = document.createElement('option')
    opTiempoReal8.textContent = "2:30 horas"
    const opTiempoReal9 = document.createElement('option')
    opTiempoReal9.textContent = "3 horas"
    const opTiempoReal10 = document.createElement('option')
    opTiempoReal10.textContent = "3:30 horas"
    const opTiempoReal11 = document.createElement('option')
    opTiempoReal11.textContent = "4 horas"

    selectTiempoReal.append(opTiempoReal, opTiempoReal1, opTiempoReal2, opTiempoReal3, opTiempoReal4, opTiempoReal5, opTiempoReal6, opTiempoReal7, opTiempoReal8, opTiempoReal9, opTiempoReal10, opTiempoReal11)

    //observaciones
    const observacionesTareas = document.createElement("input")
    observacionesTareas.placeholder = "Observaciones."
    observacionesTareas.classList.add("obs-tarea")

    const btnEliminarTarea = document.createElement('div');
    btnEliminarTarea.textContent = 'Eliminar Tarea';
    btnEliminarTarea.classList.add("btn-eliminar-tarea")
    btnEliminarTarea.addEventListener('click', function() {
      // Eliminar la tarea al hacer clic en el botón de eliminar
      contenedorTareas.removeChild(nuevaTarea);
    });

    // Añadir elementos al contenedor de la tarea
    nuevaTarea.appendChild(inputDescripcion);
    nuevaTarea.appendChild(selectEncargado);
    nuevaTarea.appendChild(selectTiempoEstimado);
    nuevaTarea.appendChild(selectTiempoReal);
    nuevaTarea.appendChild(observacionesTareas);
    nuevaTarea.appendChild(btnEliminarTarea);
    // ... Añadir los demás elementos al contenedor ...

    // Añadir la nueva tarea al contenedor de tareas principal
    contenedorTareas.appendChild(nuevaTarea);
  }
  /*Nuevas Tareas END*/


  /*Nuevos EQUIPOS/MATERIALES START*/
  /*Agregar Equipo/Material*/
  let btnAgregarEquipo = document.querySelector(".agregar-equipo")
  //Solo se podrán agregar 3 equipos/materiales adicionales

  btnAgregarEquipo.addEventListener("click", function(){
    let numEquiposCreados = document.querySelectorAll(".contenedor-equipos").length
    if(numEquiposCreados<3){
      agregarEquipo()
    }else{
      alert("Se ha alcanzado el máximo número permitido")
    }
  })

  function agregarEquipo(){
    const contenedorEquipos = document.querySelector(".equipos")
    const nuevoEquipo = document.createElement('div');
    nuevoEquipo.classList.add('contenedor-equipos');

    const labelDescripcion = document.createElement('label');
    labelDescripcion.textContent = 'Descripción ';
    const inputDescripcion = document.createElement('input');
    inputDescripcion.type = 'text';
    inputDescripcion.classList.add('descripcion-equipo');
    labelDescripcion.appendChild(inputDescripcion);

    const labelUnidad = document.createElement('label');
    labelUnidad.textContent = 'Unidad ';
    const inputUnidad = document.createElement('input');
    inputUnidad.type = 'text';
    inputUnidad.classList.add('unidad');
    labelUnidad.appendChild(inputUnidad);

    const labelCantidad = document.createElement('label');
    labelCantidad.textContent = 'Cantidad ';
    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.classList.add('cantidad-e');
    labelCantidad.appendChild(inputCantidad);

    const labelObservaciones = document.createElement('label');
    labelObservaciones.textContent = 'Observaciones ';
    const textareaObservaciones = document.createElement('textarea');
    textareaObservaciones.cols = '30';
    textareaObservaciones.rows = '10';
    textareaObservaciones.classList.add('observaciones-e');
    labelObservaciones.appendChild(textareaObservaciones);

    
    // Crear botón de eliminar
    const btnEliminarEquipo = document.createElement('div');
    btnEliminarEquipo.textContent = 'Eliminar Equipo';
    btnEliminarEquipo.classList.add('btn-eliminar-equipo')
    btnEliminarEquipo.addEventListener('click', function() {
      // Eliminar el equipo al hacer clic en el botón de eliminar
      contenedorEquipos.removeChild(nuevoEquipo);
    });

    // Añadir elementos al contenedor del equipo
    nuevoEquipo.appendChild(labelDescripcion);
    nuevoEquipo.appendChild(labelUnidad);
    nuevoEquipo.appendChild(labelCantidad);
    nuevoEquipo.appendChild(labelObservaciones);
    nuevoEquipo.appendChild(btnEliminarEquipo);

    // Añadir el nuevo equipo al contenedor de equipos principal
    contenedorEquipos.appendChild(nuevoEquipo);
  }

/*Nuevas Herramientas START*/
/*Agregar Herramienta*/
let btnAgregarHerramienta = document.querySelector(".agregar-herramienta")
//Solo se podrán agregar 4 herramientas adicionales

btnAgregarHerramienta.addEventListener("click", function(){
  let numHerramientasCreadas = document.querySelectorAll(".contenedor-herramientas").length
  if(numHerramientasCreadas<4){
    agregarHerramienta()
  }else{
    alert("Se ha alcanzado el máximo número permitido")
  }
})

function agregarHerramienta(){
  const contenedorHerramientas = document.querySelector(".herramientas")

  const nuevaHerramienta = document.createElement('div');
  nuevaHerramienta.classList.add('contenedor-herramientas');

  const labelDescripcion = document.createElement('label');
  labelDescripcion.textContent = 'Descripción ';
  const inputDescripcion = document.createElement('input');
  inputDescripcion.type = 'text';
  inputDescripcion.classList.add('descripcion-herramienta');
  labelDescripcion.appendChild(inputDescripcion);

  const labelCantidadPlanificada = document.createElement('label');
  labelCantidadPlanificada.textContent = 'Cantidad Planificada ';
  const inputCantidadPlanificada = document.createElement('input');
  inputCantidadPlanificada.type = 'number';
  inputCantidadPlanificada.classList.add('cantidad-p');
  labelCantidadPlanificada.appendChild(inputCantidadPlanificada);

  const labelCantidadUtilizada = document.createElement('label');
  labelCantidadUtilizada.textContent = 'Cantidad Utilizada ';
  const inputCantidadUtilizada = document.createElement('input');
  inputCantidadUtilizada.type = 'number';
  inputCantidadUtilizada.classList.add('cantidad-u');
  labelCantidadUtilizada.appendChild(inputCantidadUtilizada);

  const labelObservaciones = document.createElement('label');
  labelObservaciones.textContent = 'Observaciones ';
  const textareaObservaciones = document.createElement('textarea');
  textareaObservaciones.cols = '30';
  textareaObservaciones.rows = '10';
  textareaObservaciones.classList.add('observaciones');
  labelObservaciones.appendChild(textareaObservaciones);

  // Crear botón de eliminar
  const btnEliminarHerramienta = document.createElement('button');
  btnEliminarHerramienta.classList.add("btn-eliminar-herramienta")
  btnEliminarHerramienta.textContent = 'Eliminar Herramienta';
  btnEliminarHerramienta.addEventListener('click', function() {
    // Eliminar la herramienta al hacer clic en el botón de eliminar
    contenedorHerramientas.removeChild(nuevaHerramienta);
  });

  // Añadir elementos al contenedor de la herramienta
  nuevaHerramienta.appendChild(labelDescripcion);
  nuevaHerramienta.appendChild(labelCantidadPlanificada);
  nuevaHerramienta.appendChild(labelCantidadUtilizada);
  nuevaHerramienta.appendChild(labelObservaciones);
  nuevaHerramienta.appendChild(btnEliminarHerramienta);

  // Añadir la nueva herramienta al contenedor de herramientas principal
  contenedorHerramientas.appendChild(nuevaHerramienta);
}

/*Nuevas Herramientas END*/


/*Agregar Persona*/
let btnAgregarPersonal = document.querySelector(".agregar-personal");

/*el btnAgregarPersonal ejecutará la función respectiva y al mismo tiempo también posee un contador
, este servirá para evitar que los radio button creados tengan el mismo nombre que los anteriores*/
btnAgregarPersonal.addEventListener("click", function () {

  let numUser = document.querySelectorAll(".contenedor-personal").length
  //solo permitirá la creación de  usuarios
  if (numUser < 6) {
    alert("Se ha añadido un nuevo participante")
    agregarContenedorPersona();

  } else {
    alert("Ha alcanzado el número máximo de participantes");
  }
});

//funcion para agregar personal al listado
function agregarContenedorPersona() {

  contenedorParticipante = document.querySelector(".section-todo-personal")
  //div para contener a los inputs
  let datosParticipante = document.createElement("div");
  datosParticipante.classList.add("contenedor-personal");

  //creacion del boton para remover personas
  let botonRemoverPersona = document.createElement("div");
  botonRemoverPersona.classList.add("btn-remover-participante");
  let iconTrash = document.createElement("i");
  iconTrash.classList.add("fa-solid");
  iconTrash.classList.add("fa-user-minus");
  botonRemoverPersona.appendChild(iconTrash);
  botonRemoverPersona.addEventListener("click", function(){
    contenedorParticipante.removeChild(datosParticipante)
  })

  // Crear un select para los nombres
  let nombreParticipante = document.createElement("select");
  let option0 = document.createElement("option");
  option0.value = "Seleccionar";
  option0.textContent = "--Seleccionar Nombre--";
  nombreParticipante.appendChild(option0);
  nombreParticipante.classList.add("nombre-participante");

  //se completan las opciones con los nombres de los usuarios obtenidos para que luego pueda realizar su respectivo autocompletado
  llenarSelect(nombreParticipante);

  //creación de input
  let participanteDNI = document.createElement("input");
  participanteDNI.classList.add("dni");
  participanteDNI.readOnly = true
  participanteDNI.placeholder = "DNI.";

  //creación de input
  let participanteCargo = document.createElement("input");
  participanteCargo.classList.add("cargo");
  participanteCargo.readOnly = true
  participanteCargo.placeholder = "Cargo.";
  //creación de input
  let participanteFirma = document.createElement("input");
  participanteFirma.classList.add("firma");
  participanteFirma.placeholder = "Firma.";
  participanteFirma.readOnly = true;
  //creacion de los contenedores para las horas y span

  //contenedor de ingreso
  let contEntrada = document.createElement("div");
  contEntrada.classList.add("contenedor-ingreso");
  //span de ingreso
  let spanEntrada = document.createElement("span");
  spanEntrada.textContent = "Hora de Ingreso";

  //contenedor de salida
  let contSalida = document.createElement("div");
  contSalida.classList.add("contenedor-salida");
  //span de salida
  let spanSalida = document.createElement("span");
  spanSalida.textContent = "Hora de Salida";

  /*creando las horas*/
  //creación de la hora de entrada
  let horaEntrada = document.createElement("input");
  horaEntrada.type = "time";
  horaEntrada.classList.add("h-ingreso");

  //creación de la hora de salida
  let horaSalida = document.createElement("input");
  horaSalida.type = "time";
  horaSalida.classList.add("h-salida");
  /*creando las horas*/

  //función creada con anterioridad para el autocompletado en base al nombre seleccionado
  //param 'nombreParticipante' es el dato que se obtiene desde el select
  //param 'datosParticipante' se usará para los elementos html a modificar
  autocompletarCampos(nombreParticipante, datosParticipante);

  //añadiendo las horas a sus respectivos contenedores
  contEntrada.append(spanEntrada, horaEntrada);
  contSalida.append(spanSalida, horaSalida);

  //añadiendo los input creados al div
  datosParticipante.append(
    nombreParticipante,
    participanteDNI,
    participanteCargo,
    participanteFirma,
    contEntrada,
    contSalida,
    botonRemoverPersona
  );
  //añadir el div con los input dentro del contenedor
  contenedorParticipante.appendChild(datosParticipante);
}


/*---- PARTE 2 DEL CÓDIGO ----*/
/* cargar documento */
//Constante que permitirá usar el objeto jspdf
const jsPDF = window.jspdf.jsPDF;

/*Función para cargar la imagen pdf que se usará como plantilla para rellenar con datos del formulario*/
async function loadImage(url) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const res = event.target.result;
        resolve(res);
      };
      const file = this.response;
      reader.readAsDataURL(file);
    };
    xhr.send();
  });
}

let btnGenerar = document.getElementById("btnGenerar")

btnGenerar.addEventListener("click", async function generarPDF(e) {
  e.preventDefault();
  //doc, objeto}
   //dimensiones del documento pdf
   var doc = new jsPDF();
   //imagen del documento vacía
   const image = await loadImage("../recursos/formatoOrden2.jpg");
   //colocar la imagen
   //colocar imagen desde una posicion en especifico, con las dimensiones especificas
   doc.addImage(image, "JPG", 0, 0, 210, 297);
    doc.setFontSize(5) //es el tamaño por defecto
    //Importante para resolver lo de tareas y personal
   
   //Datos Generales
   function evaluarDatosGenerales(){
    let fecha = document.getElementById("fecha").value
    let proyecto = document.getElementById("proyecto").value
    let nproyecto = document.getElementById("nproyecto").value
    let ot = document.getElementById("ot").value
    let actividad = document.getElementById("actividad").value
    let contacto = document.getElementById("contacto").value
    let telefono = document.getElementById("telefono").value
    let direccion = document.getElementById("direccion").value
    let referencia = document.getElementById("referencia").value
    let ceco = document.getElementById("ceco").value

    if(proyecto !="" && nproyecto !=="" && ot!="" && actividad !="" && contacto !="" && telefono !="" && direccion !="" && ceco !=""){
      doc.setFontSize(5)
      doc.text(fecha, 38, 25)
      doc.text(proyecto, 84 ,25)
      doc.text(nproyecto, 150, 25)
      doc.text(ot, 182, 25)
      //-
      doc.text(actividad, 38, 37)
      doc.text(contacto, 38, 28.5)
      doc.text(telefono, 38, 32.5)
      doc.setFontSize(4.5)
      doc.text(direccion, 130, 28.5)
      doc.text(referencia, 130, 32.5)
      doc.setFontSize(4.8)
      doc.text(ceco, 182, 32.5)
      return true
    }else{
      alert("Complete todos los campos  de Datos Generales")
      return false
      
    }
   }

   //Nombres y Firmas para solicitud y autorizacion
   function evaluarSolicitudAutorizacion(){
    let solicitanteNombre = document.getElementById("solicitado").value
    let solicitanteFirma = document.getElementById("firma-solicitado").value
    let autorizaNombre = document.getElementById("autorizado").value
    let autorizaFirma = document.getElementById("firma-autorizado").value

    if(solicitanteNombre !=""){
      doc.text(solicitanteNombre, 34, 48,{align: "center"})
      doc.addImage(solicitanteFirma, 70, 45, 24, 6)
  
      doc.text(autorizaNombre, 134, 48,{align: "center"})
      doc.addImage(autorizaFirma, 170, 45, 24, 6)
      return true
    }else{
      alert("Seleccione al solicitante")
      return false
    }
   }

    /*Observaciones Tareas Iniciales*/
    /*let obsTareasIniciales = document.querySelectorAll(".obs-tarea-inicial")
    let obiY = 61
    obsTareasIniciales.forEach(oti=>{
      doc.setFontSize(3.8)
      doc.text(oti.value, 166, obiY, {
        maxWidth: 32,
        lineHeightFactor: 0.9
      })
      obiY+=3.8
    })*/
    doc.setFontSize(4.5)
    
    /*Tareas a ejecutar añadidas y calculos de tiempo*/
    function evaluarTareasAdicionalesTiempos(){
      let validar = true
      let descripcionTarea = document.querySelectorAll(".tarea-descripcion")
      let encargadoTarea = document.querySelectorAll(".tarea-encargado")
      let tEstimadoAniadido = document.querySelectorAll(".tiempo-estimado")
      let tRealAniadido = document.querySelectorAll(".tiempo-real")
      let observacionesTareas = document.querySelectorAll(".obs-tarea")

      dtY = 61
      //validando la descripción de la tarea
      if(descripcionTarea.length>0){
        descripcionTarea.forEach(dt=>{

          if(dt.value==""){
            alert("Complete el campo de descripción de la tarea que va a realizar")
            validar = false
            return
          }
          doc.text(dt.value, 9.2,dtY)
          dtY+=3.9
        })
      }else{
        alert("Debe añadir las tareas que va a realizar")
        validar = false
        return 
      }
      //validando qu se haya ingresado contenido en el campo de encargado d cada tarea
       etY = 61
      encargadoTarea.forEach(et=>{
        if(et.value=="" || et.value=="-Encargado-"){
          alert("Completar los campos de encargado en cada una de las tareas a ejecutar")
          validar = false
          return
        }
        doc.text(et.value, 104, etY, {
          align: "center"
        })
        etY+=3.9
      })
      

      /*TIEMPO TOTAL*/
      // todos los datos de tiempo son convertidos a minutos para luego ser evaluados
      // función general para convertir el tiempo a minutos

      function convertirAMinutos(t) {
        // Verificar si el tiempo incluye "hora" o "horas"
        if (t.includes("hora") || t.includes("horas")) {
          const partes = t.split(":");
          return parseInt(partes[0]) * 60 + parseInt(partes[1] || 0);
        } else if (t.includes("minuto") || t.includes("minutos")) {
          return parseInt(t);
        }
        return 0;
      }
      
      /*TIEMPO ESTIMADO*/
      //para el tiempo esetimado se creará una lista con los datos que ya vienen predefindos en el documento pdf
      let tiempoEstimado = []

      //se añaden los nuevos datos de tiempo a los ya existentes
      teY = 62.5
      tEstimadoAniadido.forEach(t=>{
        if(t.value!="-T. Estimado.-"){
          //añadiendo los valores de la página al arreglo creado
          tiempoEstimado.push(t.value)
          //colocando los tiempos estimados en el documento
          doc.text(t.value, 136, teY, {
            align: "center"
          })
          teY+=3.9
        }else{
          alert("Debe ingresar el tiempo estimado de cada tarea")
          validar = false
          return
        }
      })

      // se calcula en minutos el tiempo total estimado
      const tiempoEstimadoTotalEnMinutos = tiempoEstimado.reduce((total, tiempoEstimado) => total + convertirAMinutos(tiempoEstimado), 0);

      // convertir el tiempo estimado total de nuevo a horas y minutos
      const horasEstimadas = Math.floor(tiempoEstimadoTotalEnMinutos / 60);
      const minutosEstimados = tiempoEstimadoTotalEnMinutos % 60;
      //se hacen las comparaciones de minutps estimados para el mensaje
      if(minutosEstimados==0){
        doc.text(`${horasEstimadas} horas`, 136, 108, {align: "center"})
      }else{
        //esta nueva condición examina si los minutos tienen solo un dígito como por ejemplo (5)
        //si es así, entonces le agregará un 0 por delante
        if(minutosEstimados.toString().length==1){
          doc.text(`${horasEstimadas}:0${minutosEstimados} horas`, 136, 108, {align: "center"})
        }else{
          doc.text(`${horasEstimadas}:${minutosEstimados} horas`, 136, 108, {align: "center"})
        }
      }

      /*TIEMPO REAL*/
      let tiempoReal = []
      let trY = 62.5
      tRealAniadido.forEach(t=>{
        if(t.value!="-T. Real.-"){
          tiempoReal.push(t.value)
          doc.text(t.value, 156, trY, {
            align: "center"
          })
          trY+=3.9
        }else{
          alert("Debe ingresar el tiempo real de cada tarea")
          validar = false
          return
        }
      })
      
      // se calcula en minutos el tiempo total estimado
      const tiempoRealTotalEnMinutos = tiempoReal.reduce((total, tiempoReal) => total + convertirAMinutos(tiempoReal), 0);

      // convertir el tiempo estimado total de nuevo a horas y minutos
      const horasReales = Math.floor(tiempoRealTotalEnMinutos / 60);
      const minutosReales = tiempoRealTotalEnMinutos % 60;
      //se hacen las comparaciones de minutos reales para el mensaje
      if(minutosReales==0){
        doc.text(`${horasReales} horas`, 156, 108, {align: "center"})
      }else{
        //esta nueva condición examina si los minutos tienen solo un dígito como por ejemplo (5)
        //si es así, entonces le agregará un 0 por delante
        if(minutosReales.toString().length==1){
          doc.text(`${horasReales}:0${minutosReales} horas`, 156, 108, {align: "center"})
        }else{
          doc.text(`${horasReales}:${minutosReales} horas`, 156, 108, {align: "center"})
        }

      }

      let obtY = 60.2
      observacionesTareas.forEach(ot=>{
        doc.setFontSize(3.8)
        doc.text(ot.value, 166, obtY, {
          maxWidth: 32,
          lineHeightFactor: 0.9
        })
        obtY+=3.89
      })
      //doc.setFontSize(4.5)

      if(validar){
        return true
      }else{
        return false
      }
    }

    /*EQUIPOS Y MATERIALES*/
    let codigosEquiposMateriales = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"]
    let codEmY = 121
   codigosEquiposMateriales.forEach(c=>{
    doc.text(c, 21.5, codEmY, {align: "center"})
    codEmY+= 3.85
   })

   //inputs, correspondientes a los equipos iniciales
   let obsEquiposIniciales = document.querySelectorAll(".obs-equip-inicial")
   let eiy = 119.5
   obsEquiposIniciales.forEach(oei=>{

     doc.text(oei.value, 146.5, eiy, {
      maxWidth: 54,
      lineHeightFactor: 0.9
     })
     eiy+=3.85
   })

   /*Equipos y materiales agregados*/
   function evaluarEquiposAdicionales(){
    let descripcionEquipo = document.querySelectorAll(".descripcion-equipo")
    let unidadEquipo = document.querySelectorAll(".unidad")
    let cantidadEquipo = document.querySelectorAll(".cantidad-e")
    let observacionesEquipo = document.querySelectorAll(".observaciones-e")

    let equipoY = 179
    descripcionEquipo.forEach(des=>{
      doc.text(des.value, 69, equipoY,{
        align: "center"
      })
      equipoY+=3.9
    })

    equipoY = 179
    unidadEquipo.forEach(uni=>{
      doc.text(uni.value, 116, equipoY, {
        align: "center"
      })
      equipoY+=3.9
    })

    equipoY = 179
    cantidadEquipo.forEach(cantE=>{
      doc.text(cantE.value, 136, equipoY, {
        align:"center"
      })
      equipoY+=3.9
    })

    equipoY = 178
    observacionesEquipo.forEach(obsE=>{
      doc.text(obsE.value, 146.5, equipoY, {
        maxWidth: 54,
        lineHeightFactor: 0.9
       })
      equipoY+=3.85
    })
    return true
   }

    //herramientas iniciales
    //añadir codigos a herramientas
    let codigosHerramientas = new Array("1","2","3","4","5","6","7")
    let codY = 200
    codigosHerramientas.forEach(c=>{
      doc.text(c, 21.5, codY, {align:"center"})
      codY+=3.85
    })

    //inputs, correspondientes a las herramientas iniciales
    let obsHerramientasIniciales = document.querySelectorAll(".obs-herr-inicial")
    let hiy = 198
    obsHerramientasIniciales.forEach(ohi=>{

      doc.text(ohi.value, 146.5, hiy, {
        maxWidth: 54,
        lineHeightFactor: 0.9
       })
      hiy+=3.85
    })

   function evaluarHerrammientasAdicionales(){
    let descripcionHerramienta = document.querySelectorAll(".descripcion-herramienta")
    let cantidadPlanificada = document.querySelectorAll(".cantidad-p")
    let cantidadUtilizada = document.querySelectorAll(".cantidad-u")
    let observaciones = document.querySelectorAll(".observaciones")

    let herramientasY = 211.2
    descripcionHerramienta.forEach(descripcion=>{
      doc.text(descripcion.value, 69, herramientasY,{
        align: "center"
      })
      herramientasY+=3.85
    })

    herramientasY =  211.2
    cantidadPlanificada.forEach(cant1=>{
      doc.text(cant1.value, 116, herramientasY, {
        align: "center"
      })
      herramientasY+=3.85
    })

    herramientasY =  211.2
    cantidadUtilizada.forEach(cant2=>{
      doc.text(cant2.value, 136, herramientasY)
      herramientasY+=3.85
    })

    herramientasY =  210.4
    observaciones.forEach(obs=>{
      doc.text(obs.value, 146.5, herramientasY, {
        maxWidth: 54,
        lineHeightFactor: 0.9
       })
      herramientasY+=3.85
    })
    return true
   }

   /*INTEGRANTES DE TRABAJO*/
   function evaluarTrabajadores(){
    let nombresParticipantes = document.querySelectorAll(".nombre-participante")
    let dniParticipantes = document.querySelectorAll(".dni")
    let cargoParticipantes = document.querySelectorAll(".cargo")
    let hsInicio = document.querySelectorAll(".h-ingreso")
    let hsFin = document.querySelectorAll(".h-salida")
    let firmasParticipantes = document.querySelectorAll(".firma")

    let nombreParticipanteY = 236
    let validarNombres = true
    doc.setFontSize(5)
    if(nombresParticipantes.length>0){
      nombresParticipantes.forEach(nombreP=>{
        if(nombreP!="" && nombreP!="Seleccionar"){
          doc.text(nombreP.value, 69, nombreParticipanteY,{
            align: "center"
          })
          nombreParticipanteY+=5.2
        }else{
          validarNombres = false
          return 
        }
      })
      
    }else{
      alert("Debe agregar participantes y completar todos sus datos")
      validarNombres = false
      return
    }
    

    let dniParticipanteY = 236
    dniParticipantes.forEach(dniP=>{
      doc.text(dniP.value, 21.5, dniParticipanteY,{
        align: "center"
      })
      dniParticipanteY+=5.2
    })
    
    doc.setFontSize(4.5)
    let cargoParticipanteY = 236
    cargoParticipantes.forEach(cargoP=>{
      doc.text(cargoP.value, 115.7, cargoParticipanteY, {
        align: "center"
      })
      cargoParticipanteY+=5.2
    })

    doc.setFontSize(5)
    let hInicioY = 236
    hsInicio.forEach(hi=>{
      if(hi!=""){
        doc.text(hi.value, 136, hInicioY, {
          align:"center"
        })
      }else{
        alert("Debe colocar la hora de ingreso del personal")
        validarNombres = false
        return
      }
      hInicioY+=5.2
    })

    let hFinY = 236
    hsFin.forEach(hf=>{
      if(hf.value!=""){
        doc.text(hf.value, 156, hFinY, {
          align:"center"
        })
      }else{
        alert("Debe colocar la hora de salida del personal")
        validarNombres=false
        return
      }
      
      hFinY+=5.2
    })

    let firmasY = 233
    firmasParticipantes.forEach(fp=>{
      if(fp.value!=""){
        doc.addImage(fp.value, "PNG", 175, firmasY, 18, 4.5)
        firmasY+=5.2
      }else{
        validarNombres = false
        return
      }
      
    })

    if(validarNombres){
      return true
    }else{
      return false
    }
   }

   function evaluarObservacioProyecto(){
    let comentarioProyecto = document.getElementById("comentario").value
    doc.setFontSize(5)
    doc.text(comentarioProyecto, 9.5, 271,{
      align:"justify",  
      maxWidth: 188,
      lineHeightFactor: 1.2,
    })
    return true
   }

   if(evaluarDatosGenerales() && 
   evaluarSolicitudAutorizacion() && 
   evaluarTareasAdicionalesTiempos() && 
   evaluarEquiposAdicionales() && 
   evaluarHerrammientasAdicionales() &&
   evaluarObservacioProyecto() &&
   evaluarTrabajadores()){
    
    /*var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));*/
    dia = dia.replace(/\//g, "_")
    const nombreDocumento =`orden_de_trabajo_${dia}.pdf`
    doc.save(nombreDocumento)

    //endodear el resultado del pdf
    /*var file_data = btoa(doc.output())
    var form_data = new FormData()

    form_data.append("file", file_data)
        form_data.append("nombre", "ORDEN_DE_TRABAJO")
        //alert(form_data)
        $.ajax({
            url: "../envios/enviar_alerta.php",
            dataType: "text",
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type:"post",
            success: function(php_script_response){
                alert("Archivo generado correctamente")
            }
        })*/
   }else{
    alert("Complete todos los campos")
   }
  
})