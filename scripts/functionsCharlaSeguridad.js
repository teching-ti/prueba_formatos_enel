fecha = document.getElementById("fecha");
dia = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
fecha.value = dia;

const contenedorItemsPrm = document.getElementById("container-items-prm");
const btnAniadirItemPrm = document.getElementById("aniadir-item-prm");

let codCuadrillaSubjetct = "";

let contadorGlobalItemsPrm = 0;
btnAniadirItemPrm.addEventListener("click", ()=>{

    contadorGlobalItemsPrm++; // siempre suma 1
    // let valorElemento = contadorGlobalItemsPrm;
    let idUnico = contadorGlobalItemsPrm;

    const contenedorNewItem = document.createElement("div");
    contenedorNewItem.classList.add("item-prm");
    contenedorNewItem.setAttribute("data-id", `prm-item-${idUnico}`);

    // Contenedor Peligro
    const contenedorElementPrm1 = document.createElement("div");
    contenedorElementPrm1.classList.add("container-element-prm");

    const labelP1 = document.createElement("label");
    labelP1.setAttribute("for", `p${idUnico}`);
    labelP1.classList.add("element-item-prm");
    labelP1.innerHTML = `Peligro<input type='text' id='p${idUnico}' class='peligro-input'>`;
    contenedorElementPrm1.appendChild(labelP1);

    const contenedorElementPrm2 = document.createElement("div");
    contenedorElementPrm2.classList.add("container-element-prm");

    // Contenedor Riesgos
    const labelP2 = document.createElement("label");
    labelP2.setAttribute("for", `r${idUnico}`);
    labelP2.classList.add("element-item-prm");
    labelP2.innerHTML = `Riesgo<input type='text' id='r${idUnico}' class='riesgo-input'>`;
    contenedorElementPrm2.appendChild(labelP2);

    const contenedorElementPrm3 = document.createElement("div");
    contenedorElementPrm3.classList.add("container-element-prm");

    // Contenedor Medidas de Control
    const labelP3 = document.createElement("label");
    labelP3.setAttribute("for", `mc${idUnico}`);
    labelP3.classList.add("element-item-prm");
    labelP3.innerHTML = `Medida de Control<input type='text' id='mc${idUnico}' class='medida-control-input'>`;
    contenedorElementPrm3.appendChild(labelP3);

    const contenedorEliminarItem = document.createElement("div");
    contenedorEliminarItem.classList.add("container-eliminar-item-prm");
    contenedorEliminarItem.innerHTML = `
    <a href='#' class='btn-eliminar-item-prm'>
        <i class='fa-solid fa-trash'></i>
    </a>`;

    // Guardando los contenedores en el fragmento
    const fragmentContenedores = document.createElement("div");
    fragmentContenedores.classList.add("fragment-elemts");
    fragmentContenedores.appendChild(contenedorElementPrm1);
    fragmentContenedores.appendChild(contenedorElementPrm2);
    fragmentContenedores.appendChild(contenedorElementPrm3);
    fragmentContenedores.appendChild(contenedorEliminarItem);
    
    let tituloItem = document.createElement("h4");
    tituloItem.innerHTML = `Item ${document.querySelectorAll(".item-prm").length +1}`;
    tituloItem.classList.add("titulo-item");

    contenedorNewItem.appendChild(tituloItem);
    contenedorNewItem.appendChild(fragmentContenedores);
    contenedorItemsPrm.appendChild(contenedorNewItem);

    // asignando funcionalidades SOLO al botón recién creado
    contenedorEliminarItem.querySelector(".btn-eliminar-item-prm").addEventListener("click", function(ev){
        ev.preventDefault();
        const titulo = contenedorNewItem.querySelector(".titulo-item").innerText; 
        if(confirm(`¿Seguro que deseas eliminar el ${titulo}`)){
            contenedorNewItem.remove();
            reenumerarItems();
        }
    });

})

// reenumerar títulos después de eliminar
function reenumerarItems(){
    document.querySelectorAll(".item-prm").forEach((item, index)=>{
        const titulo = item.querySelector(".titulo-item");
        if(titulo){
            titulo.innerHTML = `Item ${index+1}`;
        }
    });
}

// Datos de usuarios
let users = [];

fetch(`../scripts/datos.json?t=${new Date().getTime()}`)
    .then((response) => response.json())
    .then((data)=>{
        users = data;
        //llenarSelectPersonal(document.querySelector(".participante"));
    })
    .catch((error) => console.error("Error al cargar los datos:", error));

function llenarSelectPersonal(elemento){
    users.tecnico.forEach((tecnico)=>{
        const option = document.createElement("option");
        option.value = tecnico.name;
        option.textContent = tecnico.name;
        elemento.appendChild(option);
    });
    users.supervisor.forEach((supervisor) => {
        const option = document.createElement("option");
        option.value = supervisor.name;
        option.textContent = supervisor.name;
        elemento.appendChild(option);
    });
    users.prevencionista.forEach((prevencionista) => {
        const option = document.createElement("option");
        option.value = prevencionista.name;
        option.textContent = prevencionista.name;
        elemento.appendChild(option);
    });
}

function autocomplearCampos(elementoSelect, datosParticipante){
    elementoSelect.addEventListener("change", function(){
        const nombreSeleccionado = elementoSelect.value;
        const usuarioSeleccionado = users.tecnico.find(
            (tecnico)=>tecnico.name === nombreSeleccionado
        );
        // Buscar en la categoría "supervisor"
        const supervisorSeleccionado = users.supervisor.find(
            (supervisor) => supervisor.name === nombreSeleccionado
        );
        // Buscar en la categoría "prevencionista"
        const prevencionistaSeleccionado = users.prevencionista.find(
            (prevencionista) => prevencionista.name === nombreSeleccionado
        );

        if(usuarioSeleccionado){
            datosParticipante.querySelector(".cargo").value = usuarioSeleccionado.cargo;
            datosParticipante.querySelector(".firma").value = usuarioSeleccionado.firma;
        }else if (supervisorSeleccionado) {
            datosParticipante.querySelector(".cargo").value = supervisorSeleccionado.cargo;
            datosParticipante.querySelector(".firma").value = supervisorSeleccionado.firma;
        } else if (prevencionistaSeleccionado) {
            datosParticipante.querySelector(".cargo").value = prevencionistaSeleccionado.cargo;
            datosParticipante.querySelector(".firma").value = prevencionistaSeleccionado.firma;
        } else {
            alert("Este espacio no puede permanecer vacío, seleccione al personal requerido");
            datosParticipante.querySelector(".cargo").value = "";
            datosParticipante.querySelector(".firma").value = "";
        }
    });
}

// Añadir trabajadores
const btnAniadirP = document.getElementById("aniadir-participante");
btnAniadirP.addEventListener("click", function(e){
    e.preventDefault();

    let contadorP = document.querySelectorAll(".contenedor-participante").length + 1;
    if(contadorP<=6){
        let generalParticipantes = document.getElementById("general-participantes");
        let contenedorParticipante = document.createElement("div");
        contenedorParticipante.classList.add("contenedor-participante");

        let contNombre = document.createElement("div");
        contNombre.classList.add("contenedor-info-participante");
        let camposInfo = document.createElement("div");
        camposInfo.classList.add("contenedor-info-participante");

        // creacion de labels
        let lblNombreParticipante = document.createElement("label");
        lblNombreParticipante.innerText = `-`;
        lblNombreParticipante.setAttribute("for", `participante${contadorP}`); //

        let lblCargo = document.createElement("label");
        lblCargo.innerText = "Cargo";
        lblCargo.setAttribute("for", `cargo${contadorP}`); //

        // creacion de selects
        let selectNombre = document.createElement("select");
        selectNombre.setAttribute("id", `participante${contadorP}`);
        selectNombre.setAttribute("name", `participante${contadorP}`);
        selectNombre.setAttribute("class", "participante");

        let optionSeleccionarNombre = document.createElement("option");
        optionSeleccionarNombre.value = "-Seleccionar Nombre-";
        optionSeleccionarNombre.innerHTML = "-Seleccionar Nombre-";
        selectNombre.append(optionSeleccionarNombre);
        
        contNombre.append(lblNombreParticipante, selectNombre);
        // creacion de inputs
        let inpCargo = document.createElement("input");
        inpCargo.setAttribute("id", `cargo${contadorP}`);
        inpCargo.setAttribute("name", `cargo${contadorP}`);
        inpCargo.setAttribute("class", "cargo");
        inpCargo.readOnly = true;

        let inpFirma = document.createElement("input");
        inpFirma.setAttribute("id", `firma${contadorP}`);
        inpFirma.setAttribute("name", `firma${contadorP}`);
        inpFirma.setAttribute("class", "firma");
        inpFirma.readOnly = true;

        let btnEliminarPersona = document.createElement('div');
        let iEliminar = document.createElement("i")
        iEliminar.classList.add("fa-solid")
        iEliminar.classList.add("fa-user-minus")
        btnEliminarPersona.appendChild(iEliminar)
        btnEliminarPersona.classList.add("btn-eliminar-persona")
        btnEliminarPersona.addEventListener('click', function() {
            // Eliminar la tarea al hacer clic en el botón de eliminar
            generalParticipantes.removeChild(contenedorParticipante);
        });

        camposInfo.append(lblCargo, inpCargo, inpFirma, btnEliminarPersona);

        let separador = document.createElement("hr");

        llenarSelectPersonal(selectNombre);
        autocomplearCampos(selectNombre, contenedorParticipante);

        contenedorParticipante.append(contNombre, camposInfo, separador);
        generalParticipantes.insertBefore(contenedorParticipante, btnAniadirP);

        contadorP+=1;
    }
});

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

const {jsPDF} = window.jspdf;
const doc = new jsPDF;

async function loadImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
}

let btnGenerar = document.getElementById("btn-generar");

btnGenerar.addEventListener("click", async (e)=>{
    e.preventDefault();

    const image = await loadImage("../recursos/formatoCharlaPreOperacional.jpg");
    doc.addImage(image, "PNG", 0, 0, 210, 297);
    doc.setFontSize(8);

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
        const nombreEmpresa = "TECHING /JA10143035";
        const supervisor = document.getElementById("supervisor-responsable");
        const inspectorPluz = "Andree Quinto";

        let tituloTrabajo = document.getElementById("titulo-trabajo");
        let instalacionEquipo = document.getElementById("instalacion-o-equipo");
        let lugar = document.getElementById("lugar");
        let fecha =  document.getElementById("fecha");
        let hora = document.getElementById("hora");

        doc.text(nombreEmpresa, 40, 32.4);
        
        doc.text(inspectorPluz, 50, 42);

        if(supervisor.value!=""){
            doc.text(supervisor.value, 73, 37);
        }else{
            alert("Por favor, complete el campo de Supervisor y/o responsable de trabajo");
            supervisor.focus();
            return false;
        }
        

        if(tituloTrabajo.value!=""){
            doc.text(tituloTrabajo.value, 44, 47);
        }else{
            alert("Por favor, complete el campo de título de trabajo");
            tituloTrabajo.focus();
            return false;
        }

        if(instalacionEquipo.value!=""){
           doc.text(instalacionEquipo.value, 46, 52);
        }else{
            alert("Por favor, complete el campo de instalación o equipo");
            instalacionEquipo.focus();
            return false;
        }

        if(lugar.value!=""){
            doc.text(lugar.value, 25, 57.4);
        }else{
            alert("Por favor, complete el campo de lugar en la parte inicial del formulario");
            lugar.focus();
            return false;
        }

        // Fecha
        let partesFecha = fecha.value.split("/");
        let fechaPositionX = 149;
        partesFecha.forEach((e)=>{
            doc.text(e, fechaPositionX, 57.2);
            fechaPositionX+=4.7;
        });

        // Hora
        let partesHora = hora.value.split(":");
        let horaPositionX = 183.2;
        partesHora.forEach((e)=>{
            doc.text(e, horaPositionX, 57.2);
            horaPositionX+=4.8;
        });

        return true;
    }

    function evaluarPrmc(){
        doc.setFontSize(5.8);
        /*Peligros*/
        let inputsPeligro = document.querySelectorAll(".peligro-input");
        let positionY = 96.4;
        inputsPeligro.forEach((e)=>{
            
            doc.text(e.value, 13.4, positionY, {maxWidth: 46, lineHeightFactor: .9});
            positionY+=4.92;
        })

        /*Riesgos */
        let inputsRiesgo = document.querySelectorAll(".riesgo-input");
        positionY = 96.4;
        inputsRiesgo.forEach((e)=>{
            doc.text(e.value, 59, positionY, {maxWidth: 46, lineHeightFactor: .9});
            positionY+=4.92;
        })

        /*Medidas de control */
        let inputsMedidasControl = document.querySelectorAll(".medida-control-input");
        positionY = 96.4;
        inputsMedidasControl.forEach((e)=>{
            doc.text(e.value, 105, positionY, {maxWidth: 92, lineHeightFactor: .9});
            positionY+=4.92;
        })

        return true;
    }

    function evaluarCheckboxes(){
        const checkboxes = document.querySelectorAll(".riesgos-checkbox");

        const posicionesRiesgos = {
            "riesgo1": [14.6, 153.8],
            "riesgo2": [14.6, 161],
            "riesgo3": [14.6, 168],
            "riesgo4": [14.6, 173.6],
            "riesgo5": [14.6, 179.4],
            "riesgo6": [51.6, 153.8],
            "riesgo7": [51.6, 162.4],
            "riesgo8": [51.6, 168.4],
            "riesgo9": [51.6, 173.6],
            "riesgo10": [51.6, 179.4],
            "riesgo11": [88.6, 155],
            "riesgo12": [88.6, 162.4],
            "riesgo13": [88.6, 168.4],
            "riesgo14": [88.6, 173.4],
            "riesgo15": [89, 178],
            "riesgo16": [125.6, 155],
            "riesgo17": [125.9, 160.8],
            "riesgo18": [125.6, 168.4],
            "riesgo19": [125.6, 173.6],
            "riesgo20": [125.6, 179.4],
            "riesgo21": [162.9, 153.8],
            "riesgo22": [162.6, 162.4],
            "riesgo23": [162.6, 168.4],
            "riesgo24": [162.4, 173.6],
            "riesgo25": [162.6, 179.4]
        }

        doc.setFontSize(10);
        checkboxes.forEach((cb)=>{
            if(cb.checked){
                const [x, y] = posicionesRiesgos[cb.id];
                doc.text("X", x, y);
            }
        });

        doc.setFontSize(8);
        return true;
    }

    function evaluarAspectosAmbientales(){
        
        const posicionesAspectosAmbientales = {
            "aai-1": [15.9, 193],
            "aai-2": [15.9, 200],
            "aai-3": [15.9, 204],
            "aai-4": [15.9, 208]
        }

        const checkboxesAspectosAmbientales = document.querySelectorAll(".checkbox-aspecto-ambiental");
        checkboxesAspectosAmbientales.forEach((e)=>{
            if(e.checked){
                const [x, y] = posicionesAspectosAmbientales[e.id]
                doc.text("X", x, y);

            }
        })

        const medidasControlarImpacto = document.getElementById("mcci");
        if(medidasControlarImpacto.value!=''){
            doc.text(medidasControlarImpacto.value, 88, 193.8, {maxWidth: 106, align: "justify"});
        }

        return true;
    }
    
    function evaluarParticipantes(){
        const validador = true;
        const participantes = document.querySelectorAll(".participante");
        const cargos = document.querySelectorAll(".cargo");
        const firmas = document.querySelectorAll(".firma");

        if(participantes.length<=0){
            alert("Por favor, agregue a los usuarios que están participando de la actividad");
            validador = false;
            return false;
        }else{
            //nombres
            let namesPositionY = 242;
            participantes.forEach((e)=>{
                if(e.value=="-Seleccionar Nombre-" || e.value==''){
                    alert("Debe seleccionar a un participante, de lo contrario elimite el item vacío");
                    e.focus();
                    validador = false;
                    return validador;
                }else{
                    doc.text(e.value, 24, namesPositionY);
                }
                namesPositionY+=4;
            })
            
            //cargos
            namesPositionY = 242;
            cargos.forEach((e)=>{
                doc.text(e.value, 127, namesPositionY, {align: "center"});
                namesPositionY+=4;
            });

            let positionImage = 239;
            //firmas
            firmas.forEach((e)=>{
                doc.addImage(e.value, "PNG", 164, positionImage, 20, 5);
                positionImage+=3.8;
            })

            // jefe cuadrilla
            let jefeIndex = -1;
            console.log(cargos);
            cargos.forEach((e, i)=>{
                if(jefeIndex === -1 && e.value.trim().toLowerCase() === "jefe cuadrilla de balance"){
                    jefeIndex = i;
                }
            });

            if(jefeIndex !== -1){
                const nombreJefe = participantes[jefeIndex].value;
                const firmaJefe = firmas[jefeIndex].value; 
                doc.text(nombreJefe, 47, 282, {align: "center"});
                doc.addImage(firmaJefe, "PNG", 32, 268, 30, 10); 
            }


        }

        if(validador){
            return true;
        }else{
            return false;
        }
    }





    if(evaluarCodigoCuadrillas() && evaluarDatosGenerales() && evaluarPrmc() && evaluarCheckboxes() && evaluarAspectosAmbientales() && evaluarParticipantes()){
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
    }

});