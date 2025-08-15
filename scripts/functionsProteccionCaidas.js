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
    llenarSelect(document.getElementById("supervisor"));
    llenarSelect(document.getElementById("responsable"));

    autocompletarCamposSup(document.getElementById("supervisor"), 
    document.getElementById("dni-supervisor"), 
    document.getElementById("supervisor-firma"));
    autocompletarCamposSup(document.getElementById("responsable"), 
    document.getElementById("dni-responsable"), 
    document.getElementById("responsable-firma"))

  })
  .catch((error) => console.error("Error al cargar los datos:", error));

function llenarSelect(elemento) {
    //obtiene los datos del supervisor
    users.supervisor.forEach((supervisor) => {
      const option = document.createElement("option");
      option.value = supervisor.name;
      option.textContent = supervisor.name;
      //agrega los elementos obtenidos al select
      elemento.appendChild(option);
    });
  
    users.tecnico.forEach((tecnico) => {
        const option = document.createElement("option");
        option.value = tecnico.name;
        option.textContent = tecnico.name;
        //agrega los elementos obtenidos al select
        elemento.appendChild(option);
    });
}

function autocompletarCamposSup(elementoSelect, elementoD, elementoF) {
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

        // Verificar en qué categoría se encontró y completar la firma
        if (tecnicoSeleccionado) {
            elementoD.value = tecnicoSeleccionado.dni;
            elementoF.value = tecnicoSeleccionado.firma;
        } else if (supervisorSeleccionado) {
            elementoD.value = supervisorSeleccionado.dni;
            elementoF.value = supervisorSeleccionado.firma;
        }else{
            alert("Este espacio no puede permanecer vacío, seleccione al personal requerido")
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
    const image = await loadImage("../recursos/formatoProteccionCaidas.jpg");
    //colocar la imagen
    //colocar imagen desde una posicion en especifico, con las dimensiones especificas
    doc.addImage(image, "JPG", 0, 0, 210, 297);
    doc.setFontSize(9)
    let eval = true

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
        let actividad = document.getElementById("actividad").value
        let lugar = document.getElementById("lugar").value
        let marcaModelo = document.getElementById("marca-modelo").value
        let hora = document.getElementById("hora").value
        let codigo = document.getElementById("codigo").value

        let datosGenerales = [actividad, lugar, marcaModelo, fecha.value, hora, codigo]
        
        let col1X = 42
        let col2X = 164
        let datosY = 46
        let cont = 0

        datosGenerales.forEach(e=>{
            if(cont<3){
                if(e!=""){
                    doc.text(e, col1X, datosY)
                    datosY+=4
                }else{
                    eval=false
                }
            }else if(cont==3){
                datosY=46
                if(e!=""){
                    doc.text(e, col2X, datosY)
                    datosY+=4
                }else{
                    eval=false
                }
            }else{
                if(e!=""){
                    doc.text(e, col2X, datosY)
                    datosY+=4
                }else{
                    eval=false
                }
            }
            cont+=1
        })

        if(eval){
            return true
        }else{
            alert("Complete todos los campos de datos generales")
            return false
        }
    }

    function evaluarArnes(){
        let elementosArnes = document.querySelectorAll(".elemento-arnes")
        let pY = 74
        elementosArnes.forEach(i=>{
            radio = i.querySelectorAll("input[type='radio']")
            radio.forEach(e=>{
                if(e.checked){
                    if(e.value=="bueno"){
                        doc.text("X", 111, pY)
                    }else if(e.value=="malo"){
                        doc.text("X", 119.7, pY)
                    }else{
                        doc.text("X", 127, pY)
                    }
                }
            })
            pY+=7.3
        })

        pY=69.8
        doc.setFontSize(4.5)
        elementosArnes.forEach(i=>{
            
            obs = i.querySelectorAll("textarea")
            obs.forEach(e=>{
                doc.text(e.value, 132.5, pY, {
                    align: 'justify',
                    maxWidth: 64,
                    lineHeightFactor: 1
                })
            })
            pY+=7.28
        })
        doc.setFontSize(9)
    }

    function evaluarAccesoriosEscalamiento(){
        let elementosAccesorio = document.querySelectorAll(".elemento-escalamiento")
        let pY = 147
        elementosAccesorio.forEach(i=>{
            radio = i.querySelectorAll("input[type='radio']")
            radio.forEach(e=>{
                if(e.checked){
                    if(e.value=="bueno"){
                        doc.text("X", 111, pY)
                    }else if(e.value=="malo"){
                        doc.text("X", 119.7, pY)
                    }else{
                        doc.text("X", 127, pY)
                    }
                }
            })
            pY+=6.7
        })

        pY=142.4
        doc.setFontSize(4.5)
        elementosAccesorio.forEach(i=>{
            
            obs = i.querySelectorAll("textarea")
            obs.forEach(e=>{
                doc.text(e.value, 132.5, pY, {
                    align: 'justify',
                    maxWidth: 64,
                    lineHeightFactor: 1
                })
            })
            pY+=6.7
        })

        doc.setFontSize(9)
    }

    function evaluarConclusion(){
        let apto = document.querySelectorAll("input[name='apto']")
        apto.forEach(i=>{
            if(i.checked){
                if(i.value=="si"){
                    doc.text("X", 110.6, 203)
                }else{
                    doc.text("X", 167.5, 203)
                }
            }
        })
    }

    
    function evaluarInspector(){
        doc.setFontSize(6.5)
        let inspector = document.getElementById("supervisor").value
        if(inspector!=""){
            dni = document.getElementById("dni-supervisor").value
            firma = document.getElementById("supervisor-firma").value

            doc.text(inspector, 50, 263)
            doc.text(dni, 46, 266.5)
            doc.addImage(firma, 'PNG', 46, 245, 36, 12)
        }else{
            alert("Seleccione al Inspector")
            eval = false
        }
    }

    function evaluarResponsable(){
        doc.setFontSize(6.5)
        let responsable = document.getElementById("responsable").value
        if(responsable!=""){
            dni = document.getElementById("dni-responsable").value
            firma = document.getElementById("responsable-firma").value

            doc.text(responsable, 132, 263)
            doc.text(dni, 128, 266.5)
            doc.addImage(firma, 'PNG', 130, 245, 36, 12)
        }else{
            alert("Seleccione al responsable de trabajo")
            eval = false
            
        }
    }


    evaluarDatosGenerales()
    evaluarArnes()
    evaluarAccesoriosEscalamiento()
    evaluarConclusion()
    evaluarInspector()
    evaluarResponsable()
    if(evaluarCodigoCuadrillas() && eval){
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));

        // aqui se deberá colocar el código del documento
        let subject = `SPCCD_${codCuadrillaSubjetct}`;

        // Inicia funcionalidad de visualización
        dia = dia.replace(/\//g, "_");
        let doc_guardado = `${subject}-${dia}.pdf`
        doc.save(doc_guardado)
        // Termina funcionalidad de visualización

        //endodear el resultado del pdf
        var file_data = btoa(doc.output())
        var form_data = new FormData()

        // aquí se deberán colocar los elementos a enviar como parte del formulario
        form_data.append("file", file_data) // se envía el archivo empaquetado
        form_data.append("subj", subject) // se envía el asunto
        form_data.append("nombre", "SPCCD") // como nombre del documento se envía su código
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
        })
    }

})