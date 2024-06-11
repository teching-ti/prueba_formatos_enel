let fecha = document.getElementById("fecha");
let fechaActual = new Date().toLocaleDateString();
fecha.value = fechaActual;

//obtener los datos del archivo
//uso de una petición fetch
fetch("../scripts/datos.json")
  .then((response) => response.json())
  .then((data) => {
    //la data obtenida será nombrada como users
    users = data;
    llenarSelect(document.getElementById("user"))
    copiarNombre(document.getElementById("user"), document.getElementById("usuario"))

    llenarSelect(document.getElementById("supervisor"));
    autocompletarFirma(document.getElementById("supervisor"), document.getElementById("supervisor-firma"))

  })
  .catch((error) => console.error("Error al cargar los datos:", error));

//funcion para seleccionar entre los responsables de cuadrilla y el supervisor
function llenarSelect(elemento) {
  //obtiene los datos del supervisor
  
  users.supervisor.forEach((supervisor) => {
    const option = document.createElement("option");
    option.value = supervisor.name;
    option.textContent = supervisor.name;
    //agrega los elementos obtenidos al select
    elemento.appendChild(option);
  });

  //obtiene los datos de los técnicos responsables de cuadrilla
  //y el autocompletado solo funciona para los responsables de cuadrilla
  users.tecnico.forEach((tecnico) => {
      const option = document.createElement("option");
      option.value = tecnico.name;
      option.textContent = tecnico.name;
      //agrega los elementos obtenidos al select
      elemento.appendChild(option);
  });
}

function autocompletarFirma(elementoSelect, dato){
    elementoSelect.addEventListener("change", function(){
        const nombreSeleccionado = elementoSelect.value;
        if(nombreSeleccionado!="" && nombreSeleccionado!="Seleccionar"){
            const usuarioSeleccionado = users.tecnico.find(
                (tecnico) => tecnico.name === nombreSeleccionado
            );
            const supervisorSeleccionado = users.supervisor.find(
                (supervisor) => supervisor.name === nombreSeleccionado
            );
            if (usuarioSeleccionado) {
                dato.value = usuarioSeleccionado.firma;
            } else if (supervisorSeleccionado) {
                dato.value = supervisorSeleccionado.firma;
            }
        }
    })
}

function copiarNombre(elementoSelect, dato){
    elementoSelect.addEventListener("change", function(){
        const nombreSeleccionado = elementoSelect.value;
        dato.value = nombreSeleccionado
    })
}

const jsPDF = window.jspdf.jsPDF;

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
    //doc, objeto
    //dimensiones del documento pdf
    var doc = new jsPDF();
    //imagen del documento vacía
    const image = await loadImage("../recursos/formatoEscalera.jpg");
    //colocar la imagen
    //colocar imagen desde una posicion en especifico, con las dimensiones especificas
    doc.addImage(image, "JPG", 0, 0, 210, 297);
    doc.setFontSize(9)
    let eval = true

    function evaluarDatosGenerales(){
        let trabajo = document.getElementById("trabajo").value
        let ubicacion = document.getElementById("ubicacion").value
        let empresa = document.getElementById("empresa").value
        let tipoEscalera = document.getElementById("tipo-escalera").value
        let hora = document.getElementById("hora").value
        let usuario = document.getElementById("usuario").value
        let codSerie = document.getElementById("cod-serie").value

        let datosGenerales = [trabajo, ubicacion, empresa, tipoEscalera, fecha.value, hora, usuario, codSerie]

        let col1X = 43
        let col2X = 132
        let datosY = 33
        let cont = 1

        datosGenerales.forEach(e=>{
            if(cont<5){
                if(e!=""){
                    doc.text(e, col1X, datosY)
                    datosY+=5.2
                }else{
                    eval = false
                }
                cont+=1
            }else if(cont==5){
                datosY = 33
                if(e!=""){
                    doc.text(e, col2X, datosY)
                    datosY+=5.2
                }else{
                    eval = false
                }
                cont+=1
            }else{
                if(e!=""){
                    doc.text(e, col2X, datosY)
                    datosY+=5.2
                }else{
                    eval = false;
                }
            }
        })
        if(eval==false){
            alert("Debe completar todos los campos de datos generales")
            return
        }
    }

    function evaluarPartes(){
        let positionY = 60
        let contenedores = document.querySelectorAll(".parte-examinada")
        contenedores.forEach(e=>{
            let valor = e.querySelector("select").value
            if(valor=="✓"){
                doc.addImage('../recursos/check.jpg','JPG', 142.5, positionY, 3, 2)
            }else if(valor=="X"){
                doc.addImage('../recursos/x.jpg','JPG', 142.5, positionY, 3, 2, 60, 55)
            }else{
                doc.addImage('../recursos/NA.jpg','JPG', 142.5, positionY, 3, 2)
            }
            positionY+=5.1
        })
    }

    function evaluarObservaciones(){
        let positionY = 60.1
        let contenedores = document.querySelectorAll(".parte-examinada")
        doc.setFontSize(4.3)
        contenedores.forEach(e=>{
            let valor = e.querySelector("textarea").value
            doc.text(valor, 156.8, positionY, {
                align: 'justify',
                maxWidth: 44,
                lineHeightFactor: 0.85
            })
            positionY+=5.12
        })
    }

    function escaleraApta(){
        let inputEvaluado = document.querySelector(".escalera-apta").querySelectorAll("input")
        inputEvaluado.forEach(i=>{
            doc.setFontSize(14)
            if(i.checked){
                if(i.value=="si"){
                    doc.text("X", 126, 149.8)
                }else{
                    doc.text("X", 134, 149.8)
                }
            }
        })
        doc.setFontSize(9)
    }

    function evaluarInspector(){
        let inspector = document.getElementById("supervisor").value

        if(inspector!=""){
            doc.text(inspector, 65, 158)
            let inspectorFirma = document.getElementById("supervisor-firma").value
            doc.addImage(inspectorFirma, 'PNG', 150, 153, 28, 9)
        }else{
            eval = false
            alert("Seleccione el nombre del inspector")
        }
    }

    //ejecutar funciones en orden de creacion
    evaluarDatosGenerales()
    evaluarPartes()
    evaluarObservaciones()
    escaleraApta()
    evaluarInspector()
    if(eval){
        /*var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));*/

        fechaActual = fechaActual.replace(/\//g, "_")
        const nombreDocumento = `INSPECCION_DE_ESCALERA_${fechaActual}.pdf`
        doc.save(nombreDocumento)
        //endodear el resultado del pdf
        /*var file_data = btoa(doc.output())
        var form_data = new FormData()

        form_data.append("file", file_data)
        form_data.append("nombre", "INSPECCION_DE_ESCALERA")
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
})