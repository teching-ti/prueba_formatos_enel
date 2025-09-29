fecha = document.getElementById("fecha");
dia = new Date().toLocaleDateString();
fecha.value = dia;
let codCuadrillaSubjetct = "";

let contador = 2;
let contador2 = 2;

const btnAniadirCrpa = document.getElementById("aniadir-crpa");
btnAniadirCrpa.addEventListener("click", function(e){
    e.preventDefault();
    if(contador<=5){
        let generalCrpa = document.getElementById("general-crpa");

        let contenedorCrpa = document.createElement("div");
        contenedorCrpa.classList.add("contenedor-crpa");

        let labelCrpa = document.createElement("label");
        labelCrpa.setAttribute("for", `p1-op${contador}`);
        labelCrpa.innerText= `${contador}. `;

        let textAreaCrpa = document.createElement("textarea");
        textAreaCrpa.setAttribute("type", "text");
        textAreaCrpa.setAttribute("id", `p1-op${contador}`);
        textAreaCrpa.setAttribute("name", `p1-op${contador}`);
        textAreaCrpa.setAttribute("class", "crpa-e")

        contenedorCrpa.append(labelCrpa, textAreaCrpa);

        generalCrpa.insertBefore(contenedorCrpa, btnAniadirCrpa);

        contador+=1;
    }
});

const btnAniadirAmp = document.getElementById("aniadir-amp");
btnAniadirAmp.addEventListener("click", function(e){
    e.preventDefault();
    if(contador2<=5){
        let generalAmp = document.getElementById("general-amp");

        let contenedorAmp = document.createElement("div");
        contenedorAmp.classList.add("contenedor-amp");

        let labelAmp = document.createElement("label");
        labelAmp.setAttribute("for", `p2-op${contador2}`);
        labelAmp.innerText = `${contador2}. `;

        let textAreaAmp = document.createElement("textarea");
        textAreaAmp.setAttribute("type", "text");
        textAreaAmp.setAttribute("id", `p2-op${contador2}`);
        textAreaAmp.setAttribute("name", `p2-op${contador2}`);
        textAreaAmp.setAttribute("class", "amp-e");

        contenedorAmp.append(labelAmp, textAreaAmp);

        generalAmp.insertBefore(contenedorAmp, btnAniadirAmp);

        contador2+=1;
    }
});

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
            datosParticipante.querySelector(".dni").value = usuarioSeleccionado.dni;
            datosParticipante.querySelector(".firma").value = usuarioSeleccionado.firma;
        }else if (supervisorSeleccionado) {
            datosParticipante.querySelector(".dni").value = supervisorSeleccionado.dni;
            datosParticipante.querySelector(".firma").value = supervisorSeleccionado.firma;
        } else if (prevencionistaSeleccionado) {
            datosParticipante.querySelector(".dni").value = prevencionistaSeleccionado.dni;
            datosParticipante.querySelector(".firma").value = prevencionistaSeleccionado.firma;
        } else {
            alert("Este espacio no puede permanecer vacío, seleccione al personal requerido")
        }
    });
}

const btnAniadirP = document.getElementById("aniadir-participante");
btnAniadirP.addEventListener("click", function(e){
    e.preventDefault();

    let contadorP = document.querySelectorAll(".contenedor-participante").length + 1;
    if(contadorP<=7){
        let generalParticipantes = document.getElementById("general-participantes");
        let contenedorParticipante = document.createElement("div");
        contenedorParticipante.classList.add("contenedor-participante");

        let contNombre = document.createElement("div");
        let camposInfo = document.createElement("div");

        // creacion de labels
        let lblNombreParticipante = document.createElement("label");
        lblNombreParticipante.innerText = `${contadorP}. `;
        lblNombreParticipante.setAttribute("for", `participante${contadorP}`); //

        let lblDni = document.createElement("label");
        lblDni.innerText = "DNI";
        lblDni.setAttribute("for", `dni${contadorP}`); //

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
        let inpDni = document.createElement("input");
        inpDni.setAttribute("id", `dni${contadorP}`);
        inpDni.setAttribute("name", `dni${contadorP}`);
        inpDni.setAttribute("class", "dni");
        inpDni.readOnly = true;

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

        camposInfo.append(lblDni, inpDni, inpFirma, btnEliminarPersona);

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

    const image = await loadImage("../recursos/formatoCharlaPostOperacional.jpg");
    doc.addImage(image, "PNG", 0, 0, 210, 297);
    doc.setFontSize(8);

    let validador = true;

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

    let evaluarDatosPrincipales = function(){
        let lugar = document.getElementById("lugar").value;
        let datoFecha = document.getElementById("fecha").value;
        let hora = document.getElementById("hora").value;

        if(lugar!= "" && datoFecha !="" && hora!=""){
            doc.text(lugar, 52, 43);
            doc.text(datoFecha, 52, 47);
            doc.text(hora, 52, 51.4);
        }else{
            validador = false;
            alert("Estimado trabajador, asegúrese de completar los campos de 'Lugar, Fecha y Hora'.");
        }

        return validador;

    };

    let evaluarComportamiento = function(){
        let elementosComportamiento = document.querySelectorAll(".crpa-e");
        let contador = 1;
        let saltoY = 73.2;
        elementosComportamiento.forEach((e)=>{
            doc.setFontSize(7);
            let texto = `${contador}. ${e.value}`;
            texto = texto.replace(/\s+/g, ' ');
            if(e.value != ""){
                if(e.value.length>=316){
                    doc.setFontSize(6);
                }
                doc.text(texto, 15, saltoY, {maxWidth: 176});

            }
            saltoY+=8.4;
            contador+=1;
        })
        return validador;
    };

    let evaluarAccionMejora = function(){
        let elementoAccionMejora = document.querySelectorAll(".amp-e");
        let contador = 1;
        let saltoY = 134;
        elementoAccionMejora.forEach((e)=>{
            doc.setFontSize(7);
            let texto = `${contador}. ${e.value}`;
            texto = texto.replace(/\s+/g, ' ');
            if(e.value != ""){
                if(e.value.length>=316){
                    doc.setFontSize(6);
                }
                doc.text(texto, 15, saltoY, {maxWidth: 176});
            }
            saltoY+=8.4;
            contador+=1;
        });
        return validador;
    };

    let evaluarParticipantes = function(){
        doc.setFontSize(8.6);
        let elementosParticipantes = document.querySelectorAll(".participante");
        let elementosDni = document.querySelectorAll(".dni");
        let elementosFirma = document.querySelectorAll(".firma");

        saltoY = 209
        elementosParticipantes.forEach((e)=>{
            if(e.value!="" && e.value!="-Seleccionar Nombre-"){
                doc.text(e.value, 20, saltoY);
            }else{
                alert("Por favor, asegúrese de compeltar la información de todos los usuarios");
                validador = false;
                return validador;
            }
            saltoY+=10.1;
        });

        saltoY = 209
        elementosDni.forEach((e)=>{
            if(e.value!=""){
                doc.text(e.value, 122, saltoY, {align: 'center'})
            }
            saltoY+=10.1;
        });

        saltoY = 201.6
        elementosFirma.forEach((e)=>{
            if(e.value!=""){
                doc.addImage(e.value, 'PNG', 159, saltoY, 24, 8.4);
                saltoY+=10;
            }
        });
        
        return validador;
    };



    if(evaluarDatosPrincipales() && evaluarCodigoCuadrillas() && evaluarComportamiento() && evaluarAccionMejora() && evaluarParticipantes()){
        //línea par mostrar el documento
        doc.output("dataurlnewwindow", { filename: "nuevopdf.pdf" });

        // aqui se deberá colocar el código del documento
        let subject = `C5POSTD_${codCuadrillaSubjetct}`;

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
        form_data.append("nombre", "C5POSTD") // como nombre del documento se envía su código
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
        alert("No se pudo generar el documento");
    }


});