fecha = document.getElementById("fecha");
dia = new Date().toLocaleDateString();
fecha.value = dia;

let contador = 2;
let contador2 = 2;
let contadorP = 1;
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
        textAreaCrpa.setAttribute("id", `p1-op${contador}`);
        textAreaCrpa.setAttribute("name", `p1-op${contador}`);

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
        textAreaAmp.setAttribute("id", `p2-op${contador}`);
        textAreaAmp.setAttribute("name", `p2-op${contador}`);

        contenedorAmp.append(labelAmp, textAreaAmp);

        generalAmp.insertBefore(contenedorAmp, btnAniadirAmp);

        contador2+=1;
    }
});

let users = [];

fetch("../scripts/datos.json")
    .then((response) => response.json())
    .then((data)=>{
        users = data;
        llenarSelectPersonal(document.querySelector(".participante"));
    })
    .catch((error) => console.error("Error al cargar los datos:", error));

function llenarSelectPersonal(elemento){
    users.tecnico.forEach((tecnico)=>{
        const option = document.createElement("option");
        option.value = tecnico.name;
        option.textContent = tecnico.name;
        elemento.appendChild(option);
    }); 
}

function autocomplearCampos(elementoSelect, datosParticipante){
    elementoSelect.addEventListener("change", function(){
        const nombreSeleccionado = elementoSelect.value;
        const usuarioSeleccionado = users.tecnico.find(
            (tecnico)=>tecnico.name === nombreSeleccionado
        );

        datosParticipante.querySelector(".dni").value = usuarioSeleccionado.dni;
        datosParticipante.querySelector(".firma").value = usuarioSeleccionado.firma;
    });
}

const btnAniadirP = document.getElementById("aniadir-participante");
btnAniadirP.addEventListener("click", function(e){
    e.preventDefault();

    if(contadorP<=7){
        let generalParticipantes = document.getElementById("general-participantes");
        let contenedorParticipante = document.createElement("div");
        contenedorParticipante.classList.add("contenedor-participante");

        // creacion de labels
        let lblNombreParticipante = document.createElement("label");
        lblNombreParticipante.innerText = "Nombre";
        lblNombreParticipante.setAttribute("for", `participante${contadorP}`); //

        let lblDni = document.createElement("label");
        lblDni.innerText = "DNI";
        lblDni.setAttribute("for", `dni${contadorP}`); //

        // creacion de selects
        let selectNombre = document.createElement("select");
        selectNombre.setAttribute("name", `participante${contadorP}`);
        selectNombre.setAttribute("id", `participante${contadorP}`);
        selectNombre.setAttribute("class", "participante");
        
        // creacion de inputs
        let inpDni = document.createElement("input");
        inpDni.setAttribute("name", `dni${contadorP}`);
        inpDni.setAttribute("id", `dni${contadorP}`);
        inpDni.setAttribute("class", "dni");
        inpDni.readOnly = true;

        let inpFirma = document.createElement("input");
        inpFirma.setAttribute("name", `firma${contadorP}`);
        inpFirma.setAttribute("id", `firma${contadorP}`);
        inpFirma.setAttribute("class", "firma");
        inpFirma.readOnly = true;
        llenarSelectPersonal(selectNombre);
        autocomplearCampos(selectNombre, contenedorParticipante);

        contenedorParticipante.append(lblNombreParticipante, selectNombre, lblDni, inpDni, inpFirma);
        generalParticipantes.insertBefore(contenedorParticipante, btnAniadirP);

        contadorP+=1;
    }

});