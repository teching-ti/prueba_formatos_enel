// desactivar eventos de usuario en página web (click derecho y seleccionar elementos con mouse)
// document.oncontextmenu = function(){return false}
// document.onselectstart=function(){return false}

const inputFecha = document.getElementById("fecha");
let dia = new Date().toLocaleDateString();
inputFecha.value = dia;

const btnAniadirInvolucrado = document.getElementById("btn-aniadir");
const contenedorNombres = document.querySelector(".nombres")

//funcionalidad para añadir personal
let aniadirParticipante = ()=>{
    let contenedorParticipante = document.createElement("div");
    contenedorParticipante.className = 'participante-datos';
    contenedorParticipante.innerHTML = `<select name="participante-nombre" class="participante-nombre">
        <option value="Seleccionar">--Seleccionar Nombre--</option>
    </select>
    <input type="text" class="participante-cargo" placeholder="Cargo." readonly/>
    <input type="text" class="participante-firma" placeholder="Firma." readonly/>
    <div class="btn-remover-participante">
        <i class="fa-solid fa-trash"></i>
    </div>
    <hr>`;
    contenedorNombres.appendChild(contenedorParticipante);
    llenarSelect(contenedorParticipante.querySelector(".participante-nombre"))
    autocompletarCampos(contenedorParticipante.querySelector(".participante-nombre"), contenedorParticipante)
}

btnAniadirInvolucrado.addEventListener("click", ()=>{
    let contadorParticipantes = document.querySelectorAll(".participante-datos").length
    if(contadorParticipantes<6){
        aniadirParticipante()
    }else{
        alert("Se ha alcanzado el máximo número permitido")
    }
})

contenedorNombres.addEventListener("click", function (ev) {
    //condición, si el evento causado es por alguien que contiene esa clase
    if (ev.target.classList.contains("btn-remover-participante") || ev.target.classList.contains("fa-trash")) {
      //se guarda dentro de participanteContainer el div en cuestión 'participante-datos que haya tenido dicho evento'
      //debido al método closest
      const participanteContainer = ev.target.closest(".participante-datos");
      //se ejecuta la función eliminarParticipante llevando como argumento el contenedor guardado
      eliminarParticipante(participanteContainer);
    }
});

// funcionalidad para eliminar a un personal
let eliminarParticipante = (contenedor) =>{
    contenedorNombres.removeChild(contenedor)
}

fetch("../scripts/datos.json")
  .then((response) => response.json())
  .then((data) => {
    users = data;

    /*Autocompletado y llenado para los técnicos*/
    //llena las opciones de 'participantes tecnicos' del primer select que aparecerá por defecto
    //funcion
    llenarSelect(document.querySelector(".participante-nombre"));
    //auocompleta los campos relacionados al primer select del personal, que aparece por defecto
    autocompletarCampos(document.querySelector(".participante-nombre"), document.querySelector(".participante-datos"));

    //llenar select para verificador
    llenarSelect2(document.querySelector("#verificador"));
    autocompletarCampos2(document.querySelector("#verificador"), document.getElementById("verificador_firma")),

    //llenar select para la firma del jefe de cuadrilla
    llenarSelect3(document.getElementById("select-jefe-cuadrilla"));
    autocompletarCampos3(document.getElementById("select-jefe-cuadrilla"), document.querySelector(".firma-jefe-cuadrilla"));
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
};

function autocompletarCampos(elementoSelect, datosParticipante){
    elementoSelect.addEventListener("change", ()=>{
        const nombreSeleccionado = elementoSelect.value;
        const usuarioSeleccionado = users.tecnico.find(
            (tecnico) => tecnico.name === nombreSeleccionado
        );

        if(usuarioSeleccionado){
            datosParticipante.querySelector(".participante-cargo").value = usuarioSeleccionado.cargo;
            datosParticipante.querySelector(".participante-firma").value = usuarioSeleccionado.firma;
        }else{
            datosParticipante.querySelector(".participante-cargo").value = "";
            datosParticipante.querySelector(".participante-firma").value = "";
            alert("Por favor, seleccione un nombre válido, o elimine esta casilla de participante");
        }

    });
};

function llenarSelect2(elementoSelect) {
    //obtiene los datos del supervisor
    users.supervisor.forEach((supervisor) => {
        const option = document.createElement("option");
        option.value = supervisor.name;
        option.textContent = supervisor.name;
        //agrega los elementos obtenidos al select
        elementoSelect.appendChild(option);
    });
    //obtiene los datos de los prevencionistas
    users.prevencionista.forEach((prevencionista) => {
        const option = document.createElement("option");
        option.value = prevencionista.name;
        option.textContent = prevencionista.name;
        //agrega los elementos obtenidos al select
        elementoSelect.appendChild(option);
    });
    //obtiene los datos de los técnicos responsables de cuadrilla
    users.tecnico.forEach((tecnico) => {
        if (tecnico.cargo != "Chofer Ayudante de Balance") {
            const option = document.createElement("option");
            option.value = tecnico.name;
            option.textContent = tecnico.name;
            //agrega los elementos obtenidos al select
            elementoSelect.appendChild(option);
        }
    });
}

function autocompletarCampos2(elementoSelect, datosParticipante){
    elementoSelect.addEventListener("change", ()=>{
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

        if(tecnicoSeleccionado){
            datosParticipante.value = tecnicoSeleccionado.firma;
        }else if(supervisorSeleccionado){
            datosParticipante.value = supervisorSeleccionado.firma;
        }else if(prevencionistaSeleccionado){
            datosParticipante.value = prevencionistaSeleccionado.firma;
        }else{
            datosParticipante.value = "";
            alert("Por favor, seleccione un nombre válido para la casilla de verificación");
        }

    });
}

function llenarSelect3(elementoSelect){
    // obtiene los datos solo de lo sjefes de cuadrilla
    users.tecnico.forEach((tecnico)=>{
        if(tecnico.cargo === "Jefe Cuadrilla de Balance"){
            const option = document.createElement("option")
            option.value = tecnico.name;
            option.textContent = tecnico.name;
            elementoSelect.appendChild(option);
        }
    })
}

function autocompletarCampos3(elementoSelect, elementoFirma){
    elementoSelect.addEventListener("change", ()=>{

        let nombreJefeCuadrilla = elementoSelect.value;
        const jefeCuadrillaSeleccionado = users.tecnico.find(
            (tecnico) => tecnico.name === nombreJefeCuadrilla
        );

        if(jefeCuadrillaSeleccionado){
            elementoFirma.value = jefeCuadrillaSeleccionado.firma;
        }else{
            elementoFirma.value="";
            alert("No se ha encontrado al personal seleccionado");
        }
    })
}

//Constante importante para poder usar el objeto jsPDF
const {jsPDF} = window.jspdf
const doc = new jsPDF()

async function loadImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
}

let btnGenerar = document.getElementById("btnGenerar")
btnGenerar.addEventListener("click", async (e)=>{

    const image = await loadImage("../recursos/formatoVerificacionAltura.jpg")
    doc.addImage(image, "PNG", 0, 0, 210, 297)
    doc.setFontSize(8)

    // seccion de datos principales del formulario
    let evaluarDatosPrincipales = ()=>{
        let validador = true;
        let inputProyecto = document.getElementById("proyecto").value;
        let inputEmpresa = document.getElementById("empresa").value;
        let inputLugar = document.getElementById("lugar").value;
        let inputFecha = document.getElementById("fecha").value;
        let inputHora = document.getElementById("hora").value;
        let inputVerificador = document.getElementById("verificador").value;
        let inputFirmaVerificador = document.getElementById("verificador_firma").value;

        // valida que el input contenga al menos una letra y no contiene solo números o símbolos
        const regex = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/;
        const timeRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/;
        
        if (!regex.test(inputProyecto) || !regex.test(inputEmpresa) || !regex.test(inputLugar) || !timeRegex.test(inputHora)) {
            validador=false;
            alert("Debe completar todos los datos principales correctamente.");
        } else {
            if(inputProyecto.length>28){
                doc.setFontSize(5.5)
                doc.text(inputProyecto, 21.5, 41, {maxWidth: 38});
                doc.setFontSize(8)
            }else{
                doc.text(inputProyecto, 22, 42.5);
            }
            doc.text(inputEmpresa, 88, 42.5);
            doc.text(inputLugar, 18, 49);
            doc.text(inputFecha, 71, 49);
            doc.text(inputHora, 26, 55.5);
        }

        if((inputVerificador!="- Seleccionar -" && inputFirmaVerificador!="")|| (inputVerificador!="" && inputFirmaVerificador!="")){
            doc.text(inputVerificador, 97, 55.5);
            doc.addImage(inputFirmaVerificador, 'PNG', 176, 52, 20, 5);
        }else{
            validador=false;
        }
        return validador;
    };

    // seccion de verificación preliminar
    let evaluarVerificacionPreliminar = () =>{
        let validador = true;
        let sectionVerificacionPreliminar = document.querySelector(".verificacion_preliminar");
        let contenedorOpciones = sectionVerificacionPreliminar.querySelectorAll(".contenedor-opciones");
        doc.setFontSize(6);
        let saltoY = 4.241;
        let posicionY = 68.4;
        contenedorOpciones.forEach((e)=>{
            let inputs = e.querySelectorAll("input[type='radio']");
            inputs.forEach(function(r){
                if(r.checked){
                    if(r.value=="1"){
                        doc.text("x", 159.4, posicionY);
                    }else if(r.value=="2"){
                        doc.text("x", 168.5, posicionY);
                    }else{
                        doc.text("x", 187.2, posicionY);
                    }
                }
            })
            posicionY+=saltoY;
        })
        return validador;
    }

    // seccion de consideración general
    let evaluarConsideracionGeneral = () =>{
        let validador = true;
        let sectionConsideracionGeneral = document.querySelector(".consideracion-general");
        let contenedorOpciones = sectionConsideracionGeneral.querySelectorAll(".contenedor-opciones");
        doc.setFontSize(6);
        let saltoY = 4.241;
        let posicionY = 118.6;
        contenedorOpciones.forEach((e)=>{
            let inputs = e.querySelectorAll("input[type='radio']");
            inputs.forEach(function(r){
                if(r.checked){
                    if(r.value=="1"){
                        doc.text("x", 159.4, posicionY);
                    }else if(r.value=="2"){
                        doc.text("x", 168.55, posicionY);
                    }else{
                        doc.text("x", 187.2, posicionY);
                    }
                }
            })
            posicionY+=saltoY;
        })
        return validador;
    }

    // seccion de actividades a más de un nivel de altura
    let evaluarActividades = () =>{
        let validador = true;
        let sectionActividades = document.querySelector(".actividades");
        let contenedorOpciones = sectionActividades.querySelectorAll(".contenedor-opciones");
        doc.setFontSize(6);
        let saltoY = 6;
        let saltoY2 = 4.8;
        let cont = 1;
        let posicionY = 134.5;
        contenedorOpciones.forEach((e)=>{
            let inputs = e.querySelectorAll("input[type='radio']");
            inputs.forEach(function(r){
                if(r.checked){
                    if(r.value=="1"){
                        doc.text("x", 159.4, posicionY);
                    }else if(r.value=="2"){
                        doc.text("x", 168.55, posicionY);
                    }else{
                        doc.text("x", 187.2, posicionY);
                    }
                }
            })
            if(cont==1){
                posicionY+=saltoY2
            }else{
                posicionY+=saltoY;
            }
            
            cont+=1;
        });
        return validador;
    }

    // seccion de manipulación de cargas
    let evaluarManipulacionCargas = () =>{
        let validador = true;
        let sectionManipulacionCargas = document.querySelector(".manipulacion-cargas");
        let contenedorOpciones = sectionManipulacionCargas.querySelectorAll(".contenedor-opciones");
        doc.setFontSize(6);
        let saltoY = 4.9;
        let posicionY = 154.8;
        contenedorOpciones.forEach((e)=>{
            let inputs = e.querySelectorAll("input[type='radio']");
            inputs.forEach(function(r){
                if(r.checked){
                    if(r.value=="1"){
                        doc.text("x", 159.4, posicionY);
                    }else if(r.value=="2"){
                        doc.text("x", 168.55, posicionY);
                    }else{
                        doc.text("x", 187.2, posicionY);
                    }
                }
            })
            posicionY+=saltoY;
        });
        return validador;
    }

    // seccion de manipulación de cargas
    let evaluarConsideraciones = () =>{
        let validador = true;
        let sectionConsideraciones = document.querySelector(".consideraciones");
        let contenedorOpciones = sectionConsideraciones.querySelectorAll(".contenedor-opciones");
        doc.setFontSize(6);
        let saltoY = 4.9;
        let posicionY = 184;
        contenedorOpciones.forEach((e)=>{
            let inputs = e.querySelectorAll("input[type='radio']");
            inputs.forEach(function(r){
                if(r.checked){
                    if(r.value=="1"){
                        doc.text("x", 159.4, posicionY);
                    }else if(r.value=="2"){
                        doc.text("x", 168.55, posicionY);
                    }else{
                        doc.text("x", 187.2, posicionY);
                    }
                }
            })
            posicionY+=saltoY;
        });
        return validador;
    }

    let evaluarParticipantes = ()=>{
        let validador = true;
        doc.setFontSize(8);

        let nombres = document.querySelectorAll(".participante-nombre");
        let nombreSet = new Set();
        let cargos = document.querySelectorAll(".participante-cargo");
        let cargoSet = new Set();
        let firmas = document.querySelectorAll(".participante-firma");
        let firmaSet = new Set();
        
        if(nombres.length===0){
            validador = false;
            alert("No se pudo generar el documento.\nDebe agregar al personal que estaría participando de la actividad encomendada.")
        }else{

            let nombresY = 202;
            let nombresSalto = 6;
            nombres.forEach(e => {
                let valor = e.value.trim();
                if (valor === "Seleccionar" || valor === "" || nombreSet.has(valor)){
                    validador = false;
                    alert("No se pudo generar el documento.\nRevise si existen participantes duplicados, en caso de que exista una sección vacía puede eliminarla presionando su respectivo botón rojo")
                } else {
                    nombreSet.add(valor);
                    doc.text(valor, 64, nombresY);
                    nombresY+=nombresSalto;
                }
            });

            let cargosY = 202;
            let cargosSalto = 6;
            cargos.forEach(e => {
                let valor = e.value.trim();
                if (valor === "Seleccionar" || valor === ""){
                    validador = false;
                } else {
                    cargoSet.add(valor);
                    doc.text(valor, 16, cargosY);
                    cargosY+=cargosSalto;
                }
            });

            let firmasY = 198;
            let firmasSalto = 6;
            firmas.forEach(e => {
                let valor = e.value.trim();
                if (valor === "Seleccionar" || valor === "" || firmaSet.has(valor)){
                    validador = false;
                } else {
                    firmaSet.add(valor);
                    doc.addImage(valor, 'PNG', 170, firmasY, 20, 5);
                    firmasY+=firmasSalto;
                }
            });
        }
        return validador;
    }

    let evaluarObservaciones = () => {
        let validador = true;
        let observaciones = document.querySelector(".observaciones").value;
        doc.text(observaciones, 14, 244.5, {maxWidth: 184, lineHeightFactor: 1.8})
    }

    evaluarObservaciones()

    let evaluarFirmaJefeCuadrilla = ()=>{
        let validar = true;
        let casillaSelectJefeCuadrilla = document.getElementById("select-jefe-cuadrilla").value;
        let firmaJefeCuadrilla = document.querySelector(".firma-jefe-cuadrilla").value;

        if(casillaSelectJefeCuadrilla === "- seleccionar -" || firmaJefeCuadrilla===""){
            validar= false;
            alert("Se debe seleccionar al jefe de cuadrilla que firmará el documento");
        }else{
            doc.setFontSize(6.5)
            doc.text(casillaSelectJefeCuadrilla, 124, 270, {align: 'center'});
            doc.addImage(firmaJefeCuadrilla, 'JPEG', 112, 258, 24, 6);
        }

        return validar;
    }

    if(evaluarDatosPrincipales() && evaluarVerificacionPreliminar() && evaluarConsideracionGeneral() && evaluarActividades() && evaluarManipulacionCargas() && evaluarConsideraciones() && evaluarParticipantes() && evaluarFirmaJefeCuadrilla()){
        //mostrar en una ventana externa
        //console.log("Generando Documento");
        //doc.output("dataurlnewwindow", { filename: "nuevopdf.pdf" });

        dia = dia.replace(/\//g, "_")
        const nombreDocumento =`VERIFICACION_PREVIA_AL_TRABAJO_EN_ALTURA_${dia}.pdf`;
        doc.save(nombreDocumento);

        //endodear el resultado del pdf
        /*var file_data = btoa(doc.output());
        var form_data = new FormData();

        form_data.append("file", file_data);
        form_data.append("nombre", "VERIFICACION_PREVIA_AL_TRABAJO_EN_ALTURA");

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
        console.log("No se pudo generar el documento");
    }
})