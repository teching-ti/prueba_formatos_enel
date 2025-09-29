let fecha = document.getElementById("fecha")
let dia = new Date().toLocaleDateString()
fecha.value = dia

let codCuadrillaSubjetct = "";

//obtener los datos del archivo
//uso de una petición fetch
fetch(`../scripts/datos.json?t=${new Date().getTime()}`)
  .then((response) => response.json())
  .then((data) => {
    //la data obtenida será nombrada como users
    users = data;

    llenarSelect(document.querySelector(".nombre-participante"))
    autocompletarCampos(document.querySelector(".nombre-participante"), document.querySelector(".contenedor-personal"))
    
    //Para la parte de autorización
    //funcion para seleccionar entre los responsables de cuadrilla y el supervisor
    llenarSelectRt(document.getElementById("supervisor-responsable"))
    autocompletarCamposSup(document.querySelector("#supervisor-responsable"), document.querySelector(".contenedor-sup-res"))
    //funcion para seleccionar entre los responsables de cuadrilla y el supervisor
    llenarSelect(document.querySelector("#responsable"))
    autocompletarCamposSup(document.querySelector("#responsable"), document.querySelector(".contenedor-resp"))
    //funcion para seleccionar entre los responsables de cuadrilla y el prevencionista
    llenarSelectRP(document.getElementById("prevencionista"))
    autocompletarCamposSup(document.querySelector("#prevencionista"), document.querySelector(".contenedor-prev-res"))
    
  })
  .catch((error) => console.error("Error al cargar los datos:", error));

    function llenarSelect(elementoSelect) {
        users.tecnico.forEach((tecnico) => {
        const option = document.createElement("option");
        option.value = tecnico.name;
        option.textContent = tecnico.name;
        elementoSelect.appendChild(option);
        });
    }

    //datos personal será el elemento donde se encuentran todos los elementos a modificar
    function autocompletarCampos(elementoSelect, datosPersonal) {
        elementoSelect.addEventListener("change", function () {
        const nombreSeleccionado = elementoSelect.value;
        const usuarioSeleccionado = users.tecnico.find(
            (tecnico) => tecnico.name === nombreSeleccionado
        );

        datosPersonal.querySelector(".ocupacion").value =
            usuarioSeleccionado.cargo;
            datosPersonal.querySelector(".firma-inicio").value =
            usuarioSeleccionado.firma;
            datosPersonal.querySelector(".firma-salida").value =
            usuarioSeleccionado.firma;
        });
    }
    //autcompletado solo para el caso de autorizacion y supervisión, evaluar y revisar funciona bien
    function autocompletarCamposSup(elementoSelect, df) {
        elementoSelect.addEventListener("change", function () {
          const nombreSeleccionado = elementoSelect.value;

            // Buscar en la categoría "tecnico"
            const tecnicoSeleccionado = users.tecnico.find(
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
            if (tecnicoSeleccionado) {
                df.querySelector(".a-s-firma").value = tecnicoSeleccionado.firma;
            } else if (supervisorSeleccionado) {
                df.querySelector(".a-s-firma").value = supervisorSeleccionado.firma;
            } else if (prevencionistaSeleccionado) {
                df.querySelector(".a-s-firma").value = prevencionistaSeleccionado.firma;
            } else {
                alert("Este espacio no puede permanecer vacío, seleccione al personal requerido")
            }
        });
    }

    //funcion para seleccionar entre los responsables de cuadrilla y el supervisor
    function llenarSelectRt(elementoSelect) {
        //obtiene los datos del supervisor
        users.supervisor.forEach((supervisor) => {
            const option = document.createElement("option");
            option.value = supervisor.name;
            option.textContent = supervisor.name;
            //agrega los elementos obtenidos al select
            elementoSelect.appendChild(option);
        });
        //obtiene los datos de los técnicos responsables de cuadrilla
        users.tecnico.forEach((tecnico) => {
        if (tecnico.cargo === "Jefe Cuadrilla de Balance") {
            const option = document.createElement("option");
            option.value = tecnico.name;
            option.textContent = tecnico.name;
            //agrega los elementos obtenidos al select
            elementoSelect.appendChild(option);
        }
        });
    }

    //funcion para seleccionar entre los responsables de cuadrilla y el supervisor
    function llenarSelectRP(elementoSelect) {
        //obtiene los datos del supervisor
        users.prevencionista.forEach((prevencionista) => {
            const option = document.createElement("option");
            option.value = prevencionista.name;
            option.textContent = prevencionista.name;
            //agrega los elementos obtenidos al select
            elementoSelect.appendChild(option);
        });
        //obtiene los datos de los técnicos responsables de cuadrilla
        users.tecnico.forEach((tecnico) => {
        if (tecnico.cargo === "Jefe Cuadrilla de Balance") {
            const option = document.createElement("option");
            option.value = tecnico.name;
            option.textContent = tecnico.name;
            //agrega los elementos obtenidos al select
            elementoSelect.appendChild(option);
        }
        });
    }
    
  let contenedorPersonas = document.querySelector(".section-todo-personal")
  let btnAgregarPersona = document.querySelector(".agregar-personal")

  //Solo se podrán agregar 3 equipos/materiales adicionales
  btnAgregarPersona.addEventListener("click", function(){
    let numPersonasCreadas = document.querySelectorAll(".creado").length
    if(numPersonasCreadas<6){
        agregarPersonal()
    }else{
      alert("Se ha alcanzado el máximo número permitido")
    }
  })


  //antes del agregar al personal agregar llamar al boton para luego comparar el número de participantes
  function agregarPersonal(){

    let contenedorPersonal = document.createElement("div")
    contenedorPersonal.classList.add("contenedor-personal")
    contenedorPersonal.classList.add("creado")

    let nombrePersonal = document.createElement("select")
    nombrePersonal.classList.add("nombre-participante")
    let option0 = document.createElement("option");
    option0.textContent = "-Seleccionar-"
    nombrePersonal.appendChild(option0)

    let ocupacion = document.createElement("input")
    ocupacion.classList.add("ocupacion")
    ocupacion.placeholder = "Ocupación."
    ocupacion.setAttribute("readonly", true)

    let firmaInicio = document.createElement("input")
    firmaInicio.classList.add("firma-personal")
    firmaInicio.classList.add("firma-inicio")

    let firmaSalida = document.createElement("input")
    firmaSalida.classList.add("firma-personal")
    firmaSalida.classList.add("firma-salida")

    let btnEliminarPersona = document.createElement('div');
    let iEliminar = document.createElement("i")
    iEliminar.classList.add("fa-solid")
    iEliminar.classList.add("fa-user-minus")
    btnEliminarPersona.appendChild(iEliminar)

    llenarSelect(nombrePersonal)
    autocompletarCampos(nombrePersonal, contenedorPersonal)    
    //btnEliminarPersona.textContent = 'Eliminar ';
    btnEliminarPersona.classList.add("btn-eliminar-persona")
    btnEliminarPersona.addEventListener('click', function() {
      // Eliminar la tarea al hacer clic en el botón de eliminar
      contenedorPersonas.removeChild(contenedorPersonal);
    });

    contenedorPersonal.append(nombrePersonal, ocupacion, firmaInicio, firmaSalida, btnEliminarPersona)

    contenedorPersonas.append(contenedorPersonal)
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
        e.preventDefault()
        //doc, objeto}
        //dimensiones del documento pdf
        var doc = new jsPDF();
        //imagen del documento vacía
        const image = await loadImage("../recursos/formatoPetar.jpg");
        //colocar la imagen
        //colocar imagen desde una posicion en especifico, con las dimensiones especificas
        doc.addImage(image, "JPG", 0, 0, 210, 297);
        doc.setFontSize(6.5) //es el tamaño por defecto

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

    function evaluarDatosGenerales(){
        let evalDatosGenerales = true

        let area = document.getElementById("area").value
        let lugar = document.getElementById("lugar").value
        let empresa = document.getElementById("empresa").value
        let hInicio = document.getElementById("h-inicio").value
        let hFInal = document.getElementById("h-final").value

        if(area!=""){
            doc.text(area, 24.5, 25.5)
        }else{
            alert("Complete el campo de area")  
            evalDatosGenerales = false
            return
        }

        if(lugar!=""){
            doc.text(lugar, 24.5, 29)
        }else{
            alert("Complete el campo de lugar")  
            evalDatosGenerales = false
            return
        }

        if(fecha.value!=""){
            doc.text(fecha.value, 24.5, 32.5)
        }else{
            alert("Complete el campo de lugar")  
            evalDatosGenerales = false
            return
        }

        if(empresa!=""){
            doc.text(empresa, 163, 25.5)
        }else{
            alert("Complete el campo de empresa")  
            evalDatosGenerales = false
            return
        }

        if(hInicio!=""){
            doc.text(hInicio, 163, 29)
        }else{
            alert("Complete la hora de inicio")  
            evalDatosGenerales = false
            return
        }

        if(hFInal!=""){
            doc.text(hFInal, 163, 32.5)
        }else{
            alert("Complete la hora de salida")  
            evalDatosGenerales = false
            return
        }

        if(evalDatosGenerales){
            return true
        }else{
            return false
        }
    }

    let evalNaObservaciones = true
    function evaluarMantenimientoElectrico(){
        let elementosMantenimientoElectrico = document.querySelectorAll(".elemento-mantenimiento-electrico")

        meY = 67
        //opciones
        elementosMantenimientoElectrico.forEach(e=>{

            inputsEvaluar = e.querySelectorAll("input")
            //se obtiene el text area especifico a la par del bucle que evalúa el checkbox
            //de esta forma se revisa si el elemento hermano está marcado y con texto al mismo tiempo
            textArea = e.querySelector("textarea").value

            inputsEvaluar.forEach(ie=>{
                if(ie.checked){
                    if(ie.value=="SI"){
                        doc.text("X", 142.5, meY)
                    }else{
                        //else significa que por defecto se encuentra marcado el na
                        //si el textarea hermano tiene texto menor a digitos, entonces se considera como no válido ya que de por si
                        //no sería un sustento 
                        if(textArea.length<4){
                            evalNaObservaciones = false
                            return
                        }
                        doc.text("X", 155.5, meY)
                    }
                    meY+=4.8
                }
            })
        })

        meObsY = 65
        doc.setFontSize(4.5)
        elementosMantenimientoElectrico.forEach(o=>{
            textArea = o.querySelectorAll("textarea")
            textArea.forEach(t=>{
                doc.text(t.value, 163, meObsY, {
                    maxWidth: 32,
                    lineHeightFactor: 0.8
                })
                meObsY+=4.8
            })
        })

        if(evalNaObservaciones){
            return true
        }else{
            alert("En la sección de 'Mantenimiento Eléctrico' debe completar el campo observaciones si ha marcado N/A")
            return false
        }

        //return true
    }
    
    function evaluarTrabajoAltura(){
        doc.setFontSize(6.5)
        let elementosTrabajoAltura = document.querySelectorAll(".elemento-trabajo-altura")

        taY = 104
        elementosTrabajoAltura.forEach(e=>{
            inputsEvaluar = e.querySelectorAll("input")
            //se obtiene el text area especifico a la par del bucle que evalúa el checkbox
            //de esta forma se revisa si el elemento hermano está marcado y con texto al mismo tiempo
            textArea = e.querySelector("textarea").value

            inputsEvaluar.forEach(ie=>{
                if(ie.checked){
                    if(ie.value=="SI"){
                        doc.text("X", 142.5, taY)
                    }else{
                        //else significa que por defecto se encuentra marcado el na
                        //si el textarea hermano tiene texto menor a digitos, entonces se considera como no válido ya que de por si
                        //no sería un sustento 
                        if(textArea.length<4){
                            evalNaObservaciones = false
                            return
                        }
                        doc.text("X", 155.5, taY)
                    }
                    taY+=4.8
                }
                
            })
        })

        taObsY = 102
        doc.setFontSize(4.5)
        elementosTrabajoAltura.forEach(o=>{
            textArea = o.querySelectorAll("textarea")

            textArea.forEach(t=>{
                doc.text(t.value, 163, taObsY, {
                    maxWidth: 32,
                    lineHeightFactor: 0.8
                })
                taObsY+=4.8
            })
        })

        if(evalNaObservaciones){
            return true
        }else{
            alert("En la sección de 'Trabajo en Altura' debe completar el campo observaciones si ha marcado N/A")
            return false
        }

        //return true
    }

    function evaluarEspaciosConfinados(){
        doc.setFontSize(6.5)
        let elementosEspaciosConfinados = document.querySelectorAll(".elemento-espacios-confinados")

        ecY = 141
        elementosEspaciosConfinados.forEach(e=>{
            inputsEvaluar = e.querySelectorAll("input")
            //se obtiene el text area especifico a la par del bucle que evalúa el checkbox
            //de esta forma se revisa si el elemento hermano está marcado y con texto al mismo tiempo
            textArea = e.querySelector("textarea").value

            inputsEvaluar.forEach(ie=>{
                if(ie.checked){
                    if(ie.value=="SI"){
                        doc.text("X", 142.5, ecY)
                    }else{
                        //else significa que por defecto se encuentra marcado el na
                        //si el textarea hermano tiene texto menor a digitos, entonces se considera como no válido ya que de por si
                        //no sería un sustento 
                        if(textArea.length<4){
                            evalNaObservaciones = false
                            return
                        }
                        doc.text("X", 155.5, ecY)
                    }
                    ecY+=4.8
                }
            })
        })

        ecObsY = 139
        doc.setFontSize(4.5)
        elementosEspaciosConfinados.forEach(o=>{
            textArea = o.querySelectorAll("textarea")

            textArea.forEach(t=>{
                doc.text(t.value, 163, ecObsY, {
                    maxWidth: 32,
                    lineHeightFactor: 0.8
                })
                ecObsY+=4.8
            })
        })

        if(evalNaObservaciones){
            return true
        }else{
            alert("En la sección de 'Espacios Confinados' debe completar el campo observaciones si ha marcado N/A")
            return false
        }
        //return true
    }

    function evaluarDescripcionTarea(){
        let evalDesc = true
        let descripcionTarea = document.getElementById("descripcion-tarea").value

        if(descripcionTarea==""){
            alert("Por favor, ingrese la descripción de la tarea a realizar, en la casilla correspondiente")
            evalDesc = false
            return
        }else{
            doc.setFontSize(6.5)
            doc.text(descripcionTarea, 21, 167.5, {
                maxWidth: 180,
                lineHeightFactor: 1.6
            })
        }
        
        if(evalDesc){
            return true
        }else{
            return false
        }
        
    }

    

    function evaluarPersonal(){
        doc.setFontSize(5)
        let evalPersonal = true
        let pY = 187

        let cargos = document.querySelectorAll(".ocupacion")
        cargos.forEach(c=>{
            if(c.value!=""){
                doc.text(c.value, 20.2, pY)
            }else{
                evalPersonal=false
                //alert("Seleccione un responsable en 'Personal Involucrado en la Tarea'")
                return
            }
            pY+=3.3
        })

        pY = 187
        let participantes = document.querySelectorAll(".nombre-participante")
        participantes.forEach(p=>{
            if(p.value!="Seleccionar" && p.value!=""){
                doc.text(p.value, 72, pY)
            }else{
                evalPersonal=false
                alert("Seleccione un responsable en 'Personal Involucrado en la Tarea'")
                return
            }
            pY+=3.3
        })

        /*Probarlo con las firmas verdaderas*/
        pY = 185
        let firmasInicio = document.querySelectorAll(".firma-inicio")
        firmasInicio.forEach(p=>{
            if(p.value!=""){
                doc.addImage(p.value, 142, pY, 16.3, 2.1)
            }else{
                evalPersonal=false
                //alert("Seleccione un responsable en 'Personal Involucrado en la Tarea'")
                return
            }
            pY+=3.3
        })
        
        /*Probarlo con las firmas verdaderas*/
        pY = 185
        let firmasSalida = document.querySelectorAll(".firma-salida")
        firmasSalida.forEach(p=>{
            if(p.value!=""){
                doc.addImage(p.value, 172, pY, 16.3, 2.1)
            }else{
                evalPersonal=false
                //alert("Seleccione un responsable en 'Personal Involucrado en la Tarea'")
                return
            }
            pY+=3.3
        })

        if(evalPersonal){
            return true
        }else{
            return false
        }
    }

    function evaluarEquiposProteccion(){
        let column1 = document.querySelectorAll(".c1")
        let cY = 214.8
        column1.forEach(c=>{
            if(c.checked){
                doc.text("X", 20, cY)
            }
            cY+=2.8
        })

        let column2 = document.querySelectorAll(".c2")
        cY = 214.8
        column2.forEach(c=>{
            if(c.checked){
                doc.text("X", 71.3,  cY)
            }
            cY+=2.8
        })

        let column3 = document.querySelectorAll(".c3")
        cY = 214.8
        column3.forEach(c=>{
            if(c.checked){
                doc.text("X", 146.6, cY)
            }
            cY+=2.8
        })
        doc.setFontSize(5)
        doc.text(document.getElementById("guantes-clase").value, 102, 220)

        let otros = document.getElementById("otros").value
        if(otros!=""){
            doc.text("X", 20.5, 235.8)
            doc.text(otros, 40, 235.5)
        }

        return true
    }

    function evaluarHerramientas(){
        let evalH = true
        let hEM = document.getElementById("hem").value
        
        if(hEM!=""){
            doc.setFontSize(6.5)
            doc.text(hEM, 21, 243.2, {
                maxWidth: 180,
                lineHeightFactor: 1.5
            })
        }else{
            alert("Debe completar el campo de herramientas, equipos y materiales")
            evalH = false
            return
        }

        if(evalH){
            return true
        }else{
            return false
        }
    }

    function evaluarProcedimiento(){
        let proc = document.getElementById("procedimiento").value
        let evalP = true

        if(proc!=""){
            doc.setFontSize(6.5)
            doc.text(proc, 21, 256.8, {
                maxWidth: 180,
                lineHeightFactor: 1.5
            })
        }else{
            alert("Debe completar el campo de procedimiento")
            evalP = false
            return
        }
        
        if(evalP){
            return true
        }else{
            return false
        }
    }

    function evaluarAutorizacionSupervision(){
        let evalAuto = true
        doc.setFontSize(6.5)

        let supervisor = document.getElementById("supervisor-responsable").value
        if(supervisor==""){
            alert("Ingrese el nombre del supervisor o responsable en la parte inferior de la página")
            evalAuto = false
            return
        }else{
            doc.text(supervisor, 115, 278,{
                align: "center"
            })
        }

        let responsable = document.getElementById("responsable").value
        if(responsable==""){
            alert("Ingrese el nombre del responsable en la parte inferior de la página")
            evalAuto = false
            return
        }else{
            doc.text(responsable, 115, 284,{
                align: "center"
            })
        }
        
        let prevencionista = document.getElementById("prevencionista").value

        if(prevencionista==""){
            alert("Ingrese el nombre del prevencionista o responsable en la parte inferior de la página")
            evalAuto = false
            return
        }else{
            doc.text(prevencionista, 115, 290,{
                align: "center"
            })
        }
        
        let firmas = document.querySelectorAll(".a-s-firma")
        let fY = 274
        firmas.forEach(f=>{
            doc.addImage(f.value, "PNG", 172, fY, 20, 4)
            fY+=6
        })

        if(evalAuto){
            return true
        }else{
            return false
        }   
    }
    
    if(evaluarCodigoCuadrillas() && evaluarDatosGenerales() && evaluarMantenimientoElectrico() && evaluarTrabajoAltura() && evaluarEspaciosConfinados() && evaluarDescripcionTarea() && evaluarPersonal() && evaluarEquiposProteccion() && evaluarHerramientas() && evaluarProcedimiento() && evaluarAutorizacionSupervision()){
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));

        let subject = `PETARD_${codCuadrillaSubjetct}`;

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
        form_data.append("nombre", "PETARD") // como nombre del documento se envía su código
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