//1. Manipulación de estructura

/*colocar fecha en base al reloj del sistema, dentro de la casilla 'fecha'*/

  let inputFecha = document.getElementById("fecha");
  let dia = new Date().toLocaleDateString();
  inputFecha.value = dia;

  let codCuadrillaSubjetct = "";
/*colocar fecha end*/

/*--- AÑADIR ACTIVIDADES START ---*/
//se obtiene el boton aniadir actividad
let btnAniadirActividad = document.getElementById("btn-aniadir-actividad");
let contenedorActividades = document.getElementById("contenedor-actividades");

/*Función para añadir actividades*/
function aniadirActividad() {
  //div para contener a los inputs
  let datosActividad = document.createElement("div");
  datosActividad.classList.add("actividades-datos");
  //creación de input
  let nombreActividad = document.createElement("input");
  nombreActividad.classList.add("actividad-nombre");
  nombreActividad.placeholder = "Actividad.";
  //creación de input
  let peligroAspecto = document.createElement("input");
  peligroAspecto.classList.add("peligro-aspecto-nombre");
  peligroAspecto.placeholder = "Peligro/Aspecto.";
  //creación de input
  let riesgoImpacto = document.createElement("input");
  riesgoImpacto.classList.add("riesgo-impacto-nombre");
  riesgoImpacto.placeholder = "Riesgo Asociado/ Impacto Ambiental.";
  //creación de input
  let accionesRecomendadas = document.createElement("input");
  accionesRecomendadas.classList.add("acciones-nombre");
  accionesRecomendadas.placeholder = "Acciones Recomendadas.";

  //boton de remover
  let btnRemoverActividad = document.createElement("div")
  btnRemoverActividad.classList.add("btn-remover-actividad")
  let iconFile = document.createElement("i")
  iconFile.classList.add("fa-solid")
  iconFile.classList.add("fa-file-circle-xmark")
  btnRemoverActividad.appendChild(iconFile)

  //añadiendo los input creados al div
  datosActividad.append(
    nombreActividad,
    peligroAspecto,
    riesgoImpacto,
    accionesRecomendadas,
    btnRemoverActividad
  );
  //añadir el div con los input dentro al DOM
  contenedorActividades.appendChild(datosActividad);
}

//acción para añadir los cuadros para una actividad adicional
btnAniadirActividad.addEventListener("click", function (e) {
  let numActividades = document.querySelectorAll(".actividades-datos").length

  if(numActividades<15){
    e.preventDefault();
    aniadirActividad();
  }else{
    e.preventDefault();
    alert("Se ha alcanzado el máximo número permitido")
  }
  
});
/*--- AÑADIR ACTIVIDADES END ---*/

//el manejo de los click están delegados al un contenedor de una actividad en específico
contenedorActividades.addEventListener("click", function (ev) {
  //condición, si el evento causado es por alguien que contiene esa clase
  if (ev.target.classList.contains("btn-remover-actividad") || ev.target.classList.contains("fa-file-circle-xmark")) {
    const containerActividad = ev.target.closest(".actividades-datos");
    //se ejecuta la función eliminarActividad llevando como argumento el contenedor guardado
    eliminarActividad(containerActividad);
  }
});

function eliminarActividad(contenedor) {
  //contenedorActividades es una variable declarada con un elemento del dom, muchas líneas atrás
  contenedorActividades.removeChild(contenedor);
}

/*--- AÑADIR PARTICIPANTE O PERSONAL START ---*/
let btnAniadirParticipante = document.getElementById("btn-aniadir");
let contenedorParticipante = document.getElementById("contenedor-inputs");

//let users = [];
//obtener los datos del archivo
//uso de una petición fetch
fetch(`../scripts/datos.json?t=${new Date().getTime()}`)
  .then((response) => response.json())
  .then((data) => {
    //la data obtenida será nombrada como users
    users = data;

    /*Autocompletado y llenado para los técnicos*/
    //llena las opciones de 'participantes tecnicos' del primer select que aparecerá por defecto
    //funcion
    llenarSelect(document.querySelector(".participante-nombre"))
    //auocompleta los campos relacionados al primer select del personal, que aparece por defecto
    autocompletarCampos(document.querySelector(".participante-nombre"), document.querySelector(".participante-datos"))
    
    //llena el select del responsable del proyecto
    llenarSelect(document.getElementById("responsable-trabajo"))
    autocompletarCamposResponsable(document.getElementById("responsable-trabajo"), document.getElementById("responsable-firma"))
    funcionalidadesPersonal();
  })
  .catch((error) => console.error("Error al cargar los datos:", error));

// Función para llenar el select con opciones de nombres de los técnicos, supervisores y prevencionistas
function llenarSelect(elementoSelect) {
  //una vez con la data 'users' obtenida se podrá acceder a cada uno de los elementos dentro de ella
  users.tecnico.forEach((tecnico) => {
    const option = document.createElement("option");
    option.value = tecnico.name;
    option.textContent = tecnico.name;
    elementoSelect.appendChild(option);
  });
  users.supervisor.forEach((supervisor) => {
    const option = document.createElement("option");
    option.value = supervisor.name;
    option.textContent = supervisor.name;
    elementoSelect.appendChild(option);
  });
  users.prevencionista.forEach((prevencionista) => {
    const option = document.createElement("option");
    option.value = prevencionista.name;
    option.textContent = prevencionista.name;
    elementoSelect.appendChild(option);
  });
}

/*Autocompletado de los técnicos*/
//función para autocompletar los campos al seleccionar un nombre 
//parámetros, (select, elemento que será actualizado usando su .value)
function autocompletarCampos(elementoSelect, datosParticipante) {
  elementoSelect.addEventListener("change", function () {
    const nombreSeleccionado = elementoSelect.value;

    const usuarioSeleccionado = users.tecnico.find(
      (tecnico) => tecnico.name === nombreSeleccionado
    );
    // Buscar en la categoría "supervisor"
    const supervisorSeleccionado = users.supervisor.find(
        (supervisor) => supervisor.name === nombreSeleccionado
    );
    // Buscar en la categoría "prevencionista"
    const prevencionistaSeleccionado = users.prevencionista.find(
        (prevencionista) => prevencionista.name === nombreSeleccionado
    );

    // Verificar en qué categoría se encontró y completar la firma
    if (usuarioSeleccionado) {
      datosParticipante.querySelector(".participante-dni").value = usuarioSeleccionado.dni;
      datosParticipante.querySelector(".participante-firma").value = usuarioSeleccionado.firma;
    } else if (supervisorSeleccionado) {
      datosParticipante.querySelector(".participante-dni").value = supervisorSeleccionado.dni;
      datosParticipante.querySelector(".participante-firma").value = supervisorSeleccionado.firma;
    } else if (prevencionistaSeleccionado) {
      datosParticipante.querySelector(".participante-dni").value = prevencionistaSeleccionado.dni;
      datosParticipante.querySelector(".participante-firma").value = prevencionistaSeleccionado.firma;
    } else {
      alert("Este espacio no puede permanecer vacío, seleccione al personal requerido")
    }
  });
}

/*Autocompletado del expositor*/
function autocompletarCamposResponsable(elementoSelect, datosSupervisor) {
  elementoSelect.addEventListener("change", function () {
      const nombreSeleccionado = elementoSelect.value;
      const usuarioSeleccionado = users.tecnico.find(
          (tecnico) => tecnico.name === nombreSeleccionado
      );
      const supervisorSeleccionado = users.supervisor.find(
          (supervisor) => supervisor.name === nombreSeleccionado
      );
      const prevencionistaSeleccionado = users.prevencionista.find(
          (prevencionista) => prevencionista.name === nombreSeleccionado
      );

      // Verificar en qué categoría se encontró y completar la firma
    if (usuarioSeleccionado) {
      datosSupervisor.value = usuarioSeleccionado.firma;
    } else if (supervisorSeleccionado) {
      datosSupervisor.value = supervisorSeleccionado.firma;
    } else if (prevencionistaSeleccionado) {
      datosSupervisor.value = prevencionistaSeleccionado.firma;
    } else {
      alert("Este espacio no puede permanecer vacío, seleccione al personal requerido")
    }
      //autocompletar los campos correspondientes
      
  });
}

/*Funcionalidades para el Personal*/
function funcionalidadesPersonal() {
  function eliminarParticipante(contenedor) {
    //contenedorParticipante es una variable declarada con un elemento del dom, muchas líneas atrás
    contenedorParticipante.removeChild(contenedor);
  }

  function aniadirParticipante() {
    //div para contener a los inputs
    let datosParticipante = document.createElement("div");
    datosParticipante.classList.add("participante-datos");

    //creacion del boton para remover personas
    let botonRemoverPersona = document.createElement("div");
    botonRemoverPersona.classList.add("btn-remover-participante");
    let iconTrash = document.createElement("i");
    iconTrash.classList.add("fa-solid");
    iconTrash.classList.add("fa-trash");
    botonRemoverPersona.appendChild(iconTrash);

    // Crear un select para los nombres
    let nombreParticipante = document.createElement("select");
    let option0 = document.createElement("option");
    option0.value = "Seleccionar";
    option0.textContent = "--Seleccionar Nombre--";
    nombreParticipante.appendChild(option0);
    nombreParticipante.classList.add("participante-nombre");

    //se completan las opciones con los nombres de los usuarios obtenidos para que luego pueda realizar su respectivo autocompletado
    llenarSelect(nombreParticipante);

    //creación de input
    let participanteDNI = document.createElement("input");
    participanteDNI.classList.add("participante-dni");
    participanteDNI.readOnly = true
    participanteDNI.placeholder = "DNI.";
    //creación de input
    let participanteFirma = document.createElement("input");
    participanteFirma.classList.add("participante-firma");
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
      participanteFirma,
      botonRemoverPersona,
      contEntrada,
      contSalida
    );
    //añadir el div con los input dentro del contenedor
    contenedorParticipante.appendChild(datosParticipante);
  }

  //acción para añadir los cuadros para un participante adicional
  btnAniadirParticipante.addEventListener("click", function (ev) {

    let numParticipantes = document.querySelectorAll(".participante-datos").length

    if(numParticipantes<6){
      ev.preventDefault();
      aniadirParticipante();
    }else{
      ev.preventDefault();
      alert("Se ha alcanzado el máximo número de participantes")
    }
    
  });

  //el manejo de los click están delegados al un contenedor de participante en específico
  contenedorParticipante.addEventListener("click", function (ev) {
    //condición, si el evento causado es por alguien que contiene esa clase
    if (ev.target.classList.contains("btn-remover-participante") || ev.target.classList.contains("fa-trash")) {
      //se guarda dentro de participanteContainer el div en cuestión 'participante-datos que haya tenido dicho evento'
      //debido al método closest
      const participanteContainer = ev.target.closest(".participante-datos");
      //se ejecuta la función eliminarParticipante llevando como argumento el contenedor guardado
      eliminarParticipante(participanteContainer);
    }
  });
}
/*--- AÑADIR PARTICIPANTE O PERSONAL END ---*/

document.getElementById("cod-cuadrillas").addEventListener("input", function(e) {
    let input = e.target;
    
    // Elimina todos los caracteres que no sean letras o números
    let rawValue = input.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // Agrupa cada dos caracteres y los une con guiones
    let formatted = rawValue.match(/.{1,2}/g)?.join('-') || '';

    // Evita que se agregue guion al final si es innecesario
    if (formatted.endsWith('-')) {
        formatted = formatted.slice(0, -1);
    }

    input.value = formatted;
});

//Constante que permitirá usar el objeto jspdf
const jsPDF = window.jspdf.jsPDF;

//creación de los tamaños para el texto en el documento
//fontSizeTexo es importante definirla porque es el tamaño de fuente que aarecereá en el pdf
const fontSizeTexto = 10;

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

//Se obtiene el boton generar, para generar el pdf
//2. Generar PDF
let btnGenerar = document.getElementById("btn-generar");

btnGenerar.addEventListener("click", async function generarPDF(e) {
  e.preventDefault();
  //doc, objeto
  var doc = new jsPDF();
  //imagen del documento vacía
  const image = await loadImage("../recursos/formatoAtsNuevo.jpg");
  //colocar la imagen
  doc.addImage(image, "JPG", 0, 0, 210, 297);

  //funcion para obtener y colocar datos de la parte superior
  let evaluarDatosPrincipales = () => {
    let trabajo = document.getElementById("trabajo").value;
    let lugar = document.getElementById("lugar").value;
    let fecha = document.getElementById("fecha").value;
    let responsable1 = document.getElementById("responsable-nombre").value;
    let responsableTrabajo = document.getElementById("responsable-trabajo").value
    let responableTrabajoFirma = document.getElementById("responsable-firma").value

    if (trabajo != "" && lugar != "" && responsable1 != "") {
      doc.setFontSize(8);
      doc.text(trabajo, 59, 32.5);
      doc.text(lugar, 59, 36.8);
      doc.text(fecha, 59, 41);
      
      doc.text(responsable1, 168, 41, {align: "center"}); // here
      //para que aparezca el nombre y la firma

      /*importante evaluar que posiblemente para la sección de encargado sea necesario integrar sus datos al json
       para así también autocompletar su firma
      */
      //texto posicionado para el final de la hoja y firma respectiva
      doc.text(responsableTrabajo, 60, 280.2)
      //se puede cargar directaente la dirección de la imagen desde el json
      doc.addImage(responableTrabajoFirma, "PNG", 170, 277.3, 24, 4.2)

      //Se procede a insertar el nombre y la firma del supervisor
      /*let nombreSupervisor = "Roberto Carlos Luis Bailon"
      let firmaSupervisor = "../recursos/firmas/RobertoLuisBailon.png"
      doc.text("Nombre del Supervisor: ",12, 290)
      doc.text(nombreSupervisor, 52, 289.5)
      doc.text("Firma del Supervisor: ", 136, 290)
      doc.addImage(firmaSupervisor, "PNG", 167, 286.5, 24, 4.2)*/

      return true;
    } else {
      alert("Complete todos los campos de la parte superior del formulario");
      return false;
    }
  };

  let evaluarCodigoCuadrillas = () =>{
    let valCuadrillas = true;
    let codCuadrillasInput = document.getElementById("cod-cuadrillas");
    let valorOriginal = codCuadrillasInput.value;
    
    if(valorOriginal==""){
      valCuadrillas=false;
      alert("Favor de ingresar correctamente el código de las cuadrillas");
      return;
    }

    let valorSinEspacios = valorOriginal.replace(/\s+/g, '');
    let valFormateadoCuadrillas = valorSinEspacios.toUpperCase();

    let regexValido = /^[A-Z0-9\-]+$/;
    if (!regexValido.test(valFormateadoCuadrillas)) {
      alert("El código solo debe contener letras, números y guiones (ej: C1-C2-C3)");
      valCuadrillas=false;
      return;
    }

    if(valCuadrillas){
      codCuadrillaSubjetct = valFormateadoCuadrillas;
      return true;
    }else{
      return false;
    }
  }

  let evaluarEmpresa = () => {
    /*Seleccionar empresa start*/
    let empresa = document.getElementById("empresa");
    /*Seleccionar empresa end*/

    /*EMPRESA SELECCIONADA */
    switch (empresa.value) {
      //La validación se da en el primer caso
      //si el valor del input es seleccionar se returna un valor falso
      //esto redirige el flujo al final del código
      case "- Seleccionar -":
        alert("Complete la sección de Empresa");
        return false;
      case "TECHING":
        doc.text("x", 36, 28);
        doc.setFontSize(8); // here
        doc.text("JA10143035", 40, 28); // here
        break;
      case "CONTRATISTA1":
        doc.text("x", 85.3, 28);
        doc.text(empresa.value, 95, 28.5);
        break;
      case "CONTRATISTA2":
        doc.text("x", 85.3, 28);
        doc.text(empresa.value, 95, 28.5);
        break;
    }
    return true;
  };

  /*let datosEstaticos=[
    ["Preparación e Identificación", "Preparación e Identificación", "Preparación e Identificación", "Preparación e Identificación",
    "Preparación e Identificación", "Preparación e Identificación", "Ejecución", "Ejecución", "Ejecución", "Ejecución", "Ejecución",
    "Ejecución", "Ejecución", "Culminación y Retiro", "Culminación y Retiro"],
    ["Covid 19 Contagio", "Suelo en mal estado/ irregular/ desnivelado/ con pendiente", "Radiación solar", "Trabajo a la intemperie", "Tránsito vehicular", "Manipulación de herramientas", "Redes de BT/MT", "Hostilidad, Clientes agresivos, zona peligrosa", "Presencia de animales", "Superficie resbaladiza, irregular o desnivelado, Obstáculos en el piso", "Trabajos en altura","Otro Trabajos en altura con BH", "Otro Condición subestándar en campo", "Covid 19", "Suelo en mal estado/irregular"],
    ["Enfermedad", "Caída al mismo nivel", "Daños a la piel", "Fatiga o estrés", "Colisión/ Atropello/ Volcadura", "Corte", "Contacto eléctrico directo o indirecto", "Agresión por terceros", "Agresión de animales", "Caída al mismo nivel", "Caida a distinto nivel", "Caída de personas a distinto nivel - caida de objetos", "Accidentes e incidentes", "Contagio, enfermedad", "Caída al mismo nivel"],
    ["Lavado constante de manos,uso de mascarilla,mantener distanciamiento 1.5m, cumpli plan COVID.", "Inspeccion de area de trabajo/ Realizar orden y Limpieza en el área de trabajo/ Señalizar zonas de peligro en el área de trabajo.", "Uso de bloqueador solar.", "Pausas activas.", "Inspección de pre uso de equipos móviles.", "Verificar estado de herramientas, uso de de epp básicos ( guantes), estar atento.", "Personal capacitado, en caso de liberación del cirucito aplicar las 5 reglas de oro, para con circuitos energizados verificar estado de instalaciones, revelar tensión, uso de EPPS ignífugos (capucha, uniforme antiflama, careta anti arco), uso de EPPS dieléctricos (guantes dieléctricos, calzado dieléctrico, etc.)", "Solicitar resguardo policial, no enfrentarse. Si el colaborador es agredido física o verbalmente, debe pro-tegerse y ponerse a buen recaudo.", "Estar atento, no enfrentar, retirarse de la zona de trabajo.", " Inspecciones SSOMA, Orden y Limpieza.", "Verificar el estado del poste o estructura, check list de la escalera y del sistema anticaídas, uso de 3 puntos de apoyo, uso del arnes, estrobo y freno de ascenso.", "Uso de arnés de cuerpo completo/ Llenado de PETAR/ Señalizar zona de trabajo. Verificación previa del BH.", "Aplicar política Stop the Work.", "Lavado constante de manos, uso de mascarilla, mantener distanciamiento 1.5m, cumplir plan COVID.", "Mantenimiento de Instalaciones, realizar el reporte de Condiciones Inseguras"]
  ]*/

  /*
  //codigo creado para insertar información por defecto
  let actDefinidasX = 11.5
  let actDefinidasY = 55.2
  let actDefinidasYafJ = 102
  let j = 0
  doc.setFontSize(7)
  for(let i = 0; i<4; i++){
    j=0
    datosEstaticos[i].forEach(d=>{
      
      
      if(i==0){
        if(j<7){
          doc.text(d, actDefinidasX, actDefinidasY)
          actDefinidasY+=6.2
        }else{
          doc.text(d, actDefinidasX, actDefinidasYafJ)
          actDefinidasYafJ+=6.2
        }
        j+=1

      }else if(i==1){
        actDefinidasX = 48.8
        if(j<7){
          doc.text(d, actDefinidasX, actDefinidasY, {
          maxWidth: 40,
          lineHeightFactor: 0.9
        })
        }else{
          doc.text(d, actDefinidasX, actDefinidasYafJ,{
            maxWidth: 40,
            lineHeightFactor: 0.9
          })
          actDefinidasYafJ+=6.2
        }
        actDefinidasY+=6.2
        j+=1

      }else if(i==2){
        actDefinidasX = 100
        if(j<7){
        doc.text(d, actDefinidasX, actDefinidasY,{
          maxWidth: 32,
          lineHeightFactor: 0.8
        })
        }else{
          doc.text(d, actDefinidasX, actDefinidasYafJ,{
            maxWidth: 32,
          lineHeightFactor: 0.8
          })
          actDefinidasYafJ+=6.3
        }
        actDefinidasY+=6.2
        j+=1
      }else if(i==3){
        doc.setFontSize(5.7)
        actDefinidasX = 138
        if(j<7){
        doc.text(d, actDefinidasX, actDefinidasY,{
          maxWidth: 58,
          lineHeightFactor: 0.9
        })
      }else{
        doc.text(d, actDefinidasX, actDefinidasYafJ,{
          maxWidth: 58,
          lineHeightFactor: 0.9
        })
        actDefinidasYafJ+=6.1
      }
        actDefinidasY+=6.1
        j+=1
      }
    })
    actDefinidasYafJ = 102
    actDefinidasY = 55.2
  }*/

  //funcion que se usa para colocar las actividades
  let reconocerActividades = () => {
    let resEvalActividades = true
  
    /*datos introducidos desde la página INICIO*/
    XnombreActividad = 11.5;
    YnombreActividad = 54.6;
    XpeligroActividad = 48.4;
    YpeligroActividad = 54.6;
    XriesgoActividad = 100.5;
    YriesgoActividad = 54.6;
    XrecomendacionActividad = 139;
    YrecomendacionActividad = 54.6;
    //nombre de las actividades introducidas desde la página
    nombresActs = document.querySelectorAll(".actividad-nombre");

    nombresActs.forEach((nombreA) => {
      if (nombreA.value != "") {
        doc.setFontSize(6);
        doc.text(nombreA.value, XnombreActividad, YnombreActividad,{
          maxWidth: 33,
          lineHeightFactor: 0.9
        });
        YnombreActividad += 9.18;
      } else {
        //si hay campos vacios
        // deshabilitado puesto que quizá ya no sea necesario
        alert("Complete el campo 'actividades' ");
        resEvalActividades = false
        return

      }
    });

    //peligros y aspecto
    peligros = document.querySelectorAll(".peligro-aspecto-nombre");

    peligros.forEach((peligro) => {
      if (peligro.value != "") {
        doc.setFontSize(6);
        doc.text(peligro.value, XpeligroActividad, YpeligroActividad,  {
          maxWidth: 50,
          lineHeightFactor: 0.9
        });
        YpeligroActividad += 9.2;

      } else {
        // si hay campos vacios
        // deshabilitado puesto que quizá ya no sea necesario
        alert("Complete el campo 'peligro actividad' ");
        resEvalActividades = false
        return
      }
    });

    //riesgos e impactos
    riesgos = document.querySelectorAll(".riesgo-impacto-nombre");

    riesgos.forEach((riesgo) => {
      if (riesgo.value != "") {
        doc.setFontSize(5.7);
        doc.text(riesgo.value, XriesgoActividad, YriesgoActividad, {
          maxWidth: 36,
          lineHeightFactor: 0.9
        });
        YriesgoActividad += 9.2;

      } else {
        // si hay campos vacios
        // deshabilitado puesto que quizá ya no sea necesario
        alert("Complete el campo 'riesgo impacto'");
        resEvalActividades = false
        return
      }
    });

    //  iones recomendadas
    recomendaciones = document.querySelectorAll(".acciones-nombre");

    recomendaciones.forEach((recomendacion) => {
      if (recomendacion.value != "") {
        doc.setFontSize(5.7);
        doc.text(
          recomendacion.value,
          XrecomendacionActividad,
          YrecomendacionActividad, {
            maxWidth: 59,
            lineHeightFactor: 0.9
          }
        );
        YrecomendacionActividad += 9.2;

      } else {
        // si hay campos vacios
        // deshabilitado puesto que quizá ya no sea necesario
        alert("Complete el campo 'recomendaciones' ");
        resEvalActividades = false
        return
      }
    });
    /*datos introducidos desde la página FIN*/


    //si todos los campos tienen datos, sus variables tendrán un número asignado, diferente a a0
    if (resEvalActividades) {
      //si los valores son diferentes a 0, esta función retornará un true
      return true;
    } else {
      //si al menos uno de los valores es 0, esta función retornará un false
      return false;
    }
  };

  //función para evaluar las casillas marcadas
  let evaluarCheckbox = () => {
    //se obtiene cada uno de los checkbox y se guardan dentro de una lista para luego ser evaluado
    let listaCheckbox = [
        document.getElementById("proc1"),
        document.getElementById("proc2"),
        document.getElementById("proc3"),
        document.getElementById("proc4"),
        document.getElementById("proc5"),
        document.getElementById("proc6"),
        document.getElementById("proc7"),
        document.getElementById("proc8")
    ]

    //este contador se usa para calcular cuando se deberá realizar el salto de llenado de una columna a otra en el documento pdf
    let contador = 1;
    //posición y de cada una de las columnas
    let colum1Y = 200;
    let colum2Y = 200;
    //se toma cada elemento de la lista para ser evaluado y en base a si se encuentra marcado o no, se posiciona el marcado
    //dentro del documento pdf
    doc.setFontSize(9)
    listaCheckbox.forEach((el) => {
      if (contador <= 4) {
        if (el.checked) {
          doc.text("x", 94.2, colum1Y);
          colum1Y += 3.5;
        } else {
          doc.text("x", 102.8, colum1Y);
          colum1Y += 3.5;
        }
      } else if (contador >= 4) {
        if (el.checked) {
          doc.text("x", 178, colum2Y);
          colum2Y += 3.5;
        } else {
          doc.text("x", 192, colum2Y);
          colum2Y += 3.5;
        }
      }
      contador += 1;
    });
    return true;
  };

  //funcion para evaluar los datos de clinica
  let evaluarClinica = () => {
    doc.setFontSize(8.2);
    let clincaNombre = document.getElementById("clinica-nombre").value;
    let clinicaDireccion = document.getElementById("clinica-direccion").value;
    doc.text(clincaNombre, 46.5, 224.6);
    doc.text(clinicaDireccion, 31, 228.2);
    return true;
  };

  //funcion para evaluar datos de trabajadores
  let evaluarPersonas = () => {
    //validación corregida, antes si tenías tres contenedores
    //con solo el primero y tercero completos se podía generar
    //el documento, 'solucionado'
    let resEvalPersonas = true

    //Colocar nombres
    let nombreY = 238.8;
    let nombresPersonas = document.querySelectorAll(".participante-nombre");
    nombresPersonas.forEach((persona) => {
      if (persona.value != "" && persona.value != "Seleccionar") {
        doc.setFontSize(9);
        doc.text(persona.value, 27.5, nombreY);
        nombreY += 5.2;
      } else {
        alert("Complete el nombre del participante");
        resEvalPersonas = false
        return
      }
    });

    //ColocarDNI
    let dniY = 238.8;
    let dniPersonas = document.querySelectorAll(".participante-dni");
    dniPersonas.forEach((dniPersona) => {
      if (dniPersona.value != "") {
        doc.text(dniPersona.value, 114, dniY);
        dniY += 5.2;
      } else {
        alert("Campo DNI vacío");
        resEvalPersonas = false
        return
      }
    });

    //ColocarFirma
    let firmaY = 235.6;
    let firmasPersonas = document.querySelectorAll(".participante-firma");
    firmasPersonas.forEach((firmaPersona) => {
      if (firmaPersona.value != "") {
        //console.log(firmaPersona.value)
        doc.addImage(firmaPersona.value, "PNG", 152, firmaY, 18.5, 4.5);
        firmaY += 5.3;
      } else {
        alert("Campo firma se encuentra vacío");
        resEvalPersonas = false
        return
      }
    });
    //ColocarHoraIngreso
    let horaIngresoY = 239.3;
    let horaIngresos = document.querySelectorAll(".h-ingreso");
    horaIngresos.forEach((horaIngreso) => {
      if(horaIngreso.value!=""){
        doc.text(horaIngreso.value, 174.8, horaIngresoY);
      }else{
        alert("Debe colocar la hora de ingreso del personal")
        resEvalPersonas = false
        return
      }
      horaIngresoY += 5.2;
    });

    //ColocarHoraSalida
    let horaSalidaY = 239.3;
    let horasSalida = document.querySelectorAll(".h-salida");
    horasSalida.forEach((horaSalida) => {
      if(horaSalida.value!=""){
        doc.text(horaSalida.value, 188.5, horaSalidaY);
      }else{
        alert("Debe colocar la hora de salida del personal")
        resEvalPersonas=false
        return
      }
      horaSalidaY += 5.2;
    });

     // Si todos los campos son válidos, continuar con el resto de la función
    if (resEvalPersonas) {
      return true
    } else {
      return false
    }
  };

  let evaluarObservaciones = () => {
    let observaciones = document.getElementById("input-observaciones").value;
    if (observaciones != "") {
      doc.setFontSize(7);
      doc.text(observaciones, 12, 273, {
        maxWidth: 185,
        lineHeightFactor: 0.9,
      });
      return true;
    } else {
      return false;
    }
  };

  //introduciendo datos
  doc.setFontSize(10);
  //validar que todas las funciones den true, sino, parecerá el alert y solo eso
  if (
    evaluarEmpresa() &&
    evaluarCodigoCuadrillas() &&
    evaluarDatosPrincipales() &&
    reconocerActividades() &&
    evaluarCheckbox() &&
    evaluarClinica() &&
    evaluarPersonas() &&
    evaluarObservaciones()
  ) {
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

    // aqui se deberá colocar el código del documento
    let subject = `ATSD_${codCuadrillaSubjetct}`;

    // Inicia funcionalidad de visualización
    dia = dia.replace(/\//g, "_");
    let doc_guardado = `${subject}-${dia}.pdf`
    doc.save(doc_guardado)
    // Termina funcionalidad de visualización

    //endodear el resultado del pdf
    /*var file_data = btoa(doc.output())
    var form_data = new FormData()
    
    // aquí se deberán colocar los elementos a enviar como parte del formulario
    form_data.append("file", file_data) // se envía el archivo empaquetado
    form_data.append("subj", subject) // se envía el asunto
    form_data.append("nombre", "ATSD") // como nombre del documento se envía su código
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
  } else {
    alert("Asegúrse de competar todos los campos para generar el documento");
  }

});