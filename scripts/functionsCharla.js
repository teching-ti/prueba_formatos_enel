//1. Manipulación de estructura

/*colocar fecha start*/

let inputFecha = document.getElementById("fecha")
let dia = new Date().toLocaleDateString()
inputFecha.value = dia

let codCuadrillaSubjetct = "";

/*colocar fecha end*/

/*Sección de los radio button y preguntas*/
let respuesta1 = ""
let opcionesPreguntas = document.querySelectorAll(".op1")
opcionesPreguntas.forEach(e=>{
    e.addEventListener("click", ()=>{
            respuesta1 = e.id
    })
})

let respuesta2 = ""
let opcionesPreguntas2 = document.querySelectorAll(".op2")
opcionesPreguntas2.forEach(e=>{
    e.addEventListener("click", ()=>{
        respuesta2 = e.id
    })
})

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
    llenarSelectPersonal(document.querySelector(".participante-nombre"));
    //auocompleta los campos relacionados al primer select, que aparece por defecto
    autocompletarCamposPersonal(document.querySelector(".participante-nombre"), document.querySelector(".participante-datos"));

    //expositor
    llenarSelectPersonal(document.getElementById("expositor-nombre"))
    autocompletarCamposExpositor(document.getElementById("expositor-nombre"), document.getElementById("expositor-firma"))

    funcionalidadesPersonal();
  })
  .catch((error) => console.error("Error al cargar los datos:", error));

// Función para llenar el select con opciones de nombres de los técnicos
function llenarSelectPersonal(elementoSelect) {
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
function autocompletarCamposPersonal(elementoSelect, datosParticipante) {
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
        //autocompletar los campos correspondientes
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
function autocompletarCamposExpositor(elementoSelect, datosExpositor) {
    elementoSelect.addEventListener("change", function () {
        const nombreSeleccionado = elementoSelect.value;
        const tecnicoSeleccionado = users.tecnico.find(
            (tecnico) => tecnico.name === nombreSeleccionado
        );
        const supervisorSeleccionado = users.supervisor.find(
            (supervisor) => supervisor.name === nombreSeleccionado
        );
        const prevencionistaSeleccionado = users.prevencionista.find(
            (prevencionista) => prevencionista.name === nombreSeleccionado
        );
        //autocompletar los campos correspondientes
        // Verificar en qué categoría se encontró y completar la firma
        if (tecnicoSeleccionado) {
            datosExpositor.value = tecnicoSeleccionado.firma;
        } else if (supervisorSeleccionado) {
            datosExpositor.value = supervisorSeleccionado.firma;
        } else if (prevencionistaSeleccionado) {
            datosExpositor.value = prevencionistaSeleccionado.firma;
        } else {
            alert("Este espacio no puede permanecer vacío, seleccione al personal requerido")
        }
    });
}
  
/*añadir participante start*/
let btnAniadir = document.getElementById("btn-aniadir")
let contInputs = document.getElementById("contenedor-inputs")

/*Funcionalidades para el Personal*/
function funcionalidadesPersonal() {
    function eliminarParticipante(contenedor) {
        //contenedorParticipante es una variable declarada con un elemento del dom, muchas líneas atrás
        contInputs.removeChild(contenedor);
    }
    /*Función para añadir inputs al DOM*/
    function aniadirParticipante(){
        //div para contener a los inputs
        let datosParticipante = document.createElement("div")
        datosParticipante.classList.add("participante-datos")

        // Crear un select para los nombres
        let nombreParticipante = document.createElement("select");
        let option0 = document.createElement("option");
        option0.value = "Seleccionar";
        option0.textContent = "--Seleccionar Nombre--";
        nombreParticipante.appendChild(option0);
        nombreParticipante.classList.add("participante-nombre");
        //se completan las opciones con los nombres de los usuarios obtenidos para que luego pueda realizar su respectivo autocompletado
        llenarSelectPersonal(nombreParticipante);

        //creación de input
        let dniParticipante = document.createElement("input")
        dniParticipante.classList.add("participante-dni")
        dniParticipante.readOnly = true
        dniParticipante.placeholder = "DNI."

        //creación de input
        let firmaParticipante = document.createElement("input")
        firmaParticipante.classList.add("participante-firma")
        firmaParticipante.readOnly = true
        firmaParticipante.placeholder = "Firma."

        //creacion del btn-remover
        let btnRemoverParticipante = document.createElement("div")
        btnRemoverParticipante.classList.add("btn-remover-participante")
        let iconTrash = document.createElement("i")
        iconTrash.classList.add("fa-solid")
        iconTrash.classList.add("fa-trash")
        btnRemoverParticipante.appendChild(iconTrash)

        //función creada con anterioridad para el autocompletado en base al nombre seleccionado
        //param 'nombreParticipante' es el dato que se obtiene desde el select
        //param 'datosParticipante' se usará para los elementos html a modificar
        autocompletarCamposPersonal(nombreParticipante, datosParticipante);

        //añadiendo los input creados al div
        datosParticipante.append(nombreParticipante, dniParticipante, firmaParticipante, btnRemoverParticipante)

        //añadir el div con los input dentro al DOM
        contInputs.appendChild(datosParticipante)
    }

    //acción para añadir los cuadros para un participante adicional
    btnAniadir.addEventListener("click", function(e){
        let numParticipantes = document.querySelectorAll(".participante-datos").length

        if(numParticipantes<12){
            e.preventDefault()
            aniadirParticipante()
        }else{
            e.preventDefault()
            alert("Se ha alcanzado el máxmimo número de participantes")
        }
        
    })

    //el manejo de los click están delegados al un contenedor de participante en específico
    contInputs.addEventListener("click", function (ev) {
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

/*añadir participante end*/

//Constante importante para poder usar el objeto jsPDF
const jsPDF = window.jspdf.jsPDF;

//creación de los tamaños para el texto en el documento
//fontSizeTexo es importante definirla porque es el tamaño de fuente que aarecereá en el pdf
const fontSizeTexto = 10

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
btnGenerar= document.getElementById("btn-generar");

btnGenerar.addEventListener("click", async function generarPDF(e) {
    e.preventDefault()
    //doc, objeto
    var doc = new jsPDF()
    //imagen del documento vacía
    const image = await loadImage("../recursos/formatoCharla.jpg")
    //colocar la imagen
    doc.addImage(image, "PNG", 0, 0, 210, 297)
    //variables con la información obtenida del formulario
    
    let evaluarDatosPrincipales = ()=>{
        let fecha = document.getElementById("fecha").value
        let tema = document.getElementById("tema").value
        let lugar = document.getElementById("lugar").value
        let responsable = document.getElementById("responsable-nombre").value
        //condicional para determminar si los campos del formulario han sido completados
        if(tema!="" && lugar!="" && responsable!=""){
            doc.setFontSize(9)
            //rellenar campo tema
            doc.text(tema, 51.5, 54)
            //rellenar campo lugar
            doc.text(lugar, 51.5, 59.5)
            //rellenar campo fecha
            doc.text(fecha, 51.5, 63.5)
            //rellenar campo responsable
            doc.text(responsable, 148.5 , 60, {maxWidth: 45})
            return true
        }else{
            alert("Complete los campos superiores del formulario")
            return false
        }
    }

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

    /*Seleccionar empresa*/
    let evaluarEmpresa = ()=>{
        let empresa = document.getElementById("empresa")
        doc.setFontSize(9)
        switch(empresa.value){
            case "- Seleccionar -":
                return false
            case "TECHING":
                doc.text("x", 40.5, 42.5)
                break;
            case "CONTRATISTA1":
                doc.text("x", 79.5, 42.5)
                doc.text(empresa.value, 93.5, 43)
                break;
            case "CONTRATISTA2":
                doc.text("x", 79.5, 42.5)
                doc.text(empresa.value, 93.5, 43)
                break;
        }
        return true

    }
    
    /*Opciones para preguntas sobre la charla*/
    let evaluarMarcadoOpciones = ()=>{
        //condicional para el marcado de opciones pregunta 1
        switch(respuesta1){
            case "":
                alert("Responda la pregunta 1")
                return false
            case "nada":
                doc.text("x", 38.5, 88.5)
                break;
            case "poco":
                doc.text("x", 92, 88.5)
                break;
            case "mucho":
                doc.text("x", 126.2, 88.5)
                break;
            case "otro":
                doc.text("x", 159.5, 88.5)
                break;
        }
        //condicional para el marcado de opciones pregunta 2
        switch(respuesta2){
            case "":
                alert("Responda la pregunta 2")
                return false
            case "muyInteresante":
                doc.text("x", 53.5, 109)
                break;
            case "interesante":
                doc.text("x", 101.5, 109)
                break;
            case "pocoInteresante":
                doc.text("x", 138.5, 109)
                break;
            case "otro2":
                doc.text("x", 158, 109)
                break;
        }
        return true
    }
    
    let evaluarNombres = ()=>{
        let resEvalNombres = true
        nombresX = 18.5
        nombresY = 136.5
        dniX = 115
        dniY = 136.5
        firmasX = 150
        firmasY = 128.8

        nombres = document.querySelectorAll(".participante-nombre")
        nombres.forEach((nombre)=>{
            if(nombre.value != "" && nombre.value != "Seleccionar"){
                doc.text(nombre.value, nombresX, nombresY)
                nombresY+=10.3
            }else{
                alert("Seleccionar un nombre de participante")
                resEvalNombres = false
                return
            }   
        })

        dnis = document.querySelectorAll(".participante-dni")
        dnis.forEach((dni)=>{
            if(dni.value != ""){
                doc.text(dni.value, dniX, dniY)
                dniY+=10.3
            }else{
                alert("Campo DNI vacío")
                resEvalNombres = false
                return
            }
        })

        firmas = document.querySelectorAll(".participante-firma")
        //este bucle será para cargar las imágenes
        firmas.forEach((firma)=>{
            if(firma.value != ""){
                doc.addImage(firma.value, "PNG", firmasX, firmasY, 46, 8)
                firmasY+=10.3
            }else{
                alert("Campo Firma vacío")
                resEvalNombres = false
                return
            }
        })

        if(resEvalNombres){
            return true
        }else{
            return false
        }
    }

    /*termina datos para el registro de participantes*/

    let evaluarExpositor = ()=>{
        let expFirma = document.getElementById("expositor-firma").value
        let expNombre = document.getElementById("expositor-nombre").value
        let supFirma = "../recursos/firmas/RobertoLuisBailon.png"
        let supNombre = "Roberto Carlos Luis Bailon"

        doc.addImage(expFirma, "PNG", 44, 274, 48, 8)
        doc.text(expNombre, 114, 281)
        
        //Insertar datos del supervisor
        /*doc.setFontSize(11)
        doc.text("Firma del Supervisor: ", 14, 266)
        doc.addImage(supFirma, "PNG", 45, 261, 48, 8)
        doc.text("Nombre del Supervisor: ", 92, 266)
        doc.setFontSize(9)
        doc.text(supNombre, 136 , 266)*/
        


        //Colocando Nombre y firma del Supervisor
        return true
    }

    if(evaluarDatosPrincipales() && evaluarCodigoCuadrillas() && evaluarEmpresa() && evaluarMarcadoOpciones() && evaluarNombres() && evaluarExpositor()){
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob))

        // aqui se deberá colocar el código del documento
        let subject = `C5D_${codCuadrillaSubjetct}`;

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
        form_data.append("nombre", "C5D") // como nombre del documento se envía su código
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