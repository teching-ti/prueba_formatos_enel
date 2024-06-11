let auto = document.getElementById("vehiculo-auto")
let moto = document.getElementById("vehiculo-moto")
let sectionAuto = document.querySelector(".selectores")
let sectionMoto = document.querySelector(".selectores-motorizado")

let eppMoto1 = document.getElementsByName("e9")
let eppMoto2 = document.getElementsByName("e10")
let eppMoto3 = document.getElementsByName("e11")

auto.addEventListener("click", function(){
    sectionAuto.style.display = "block"
    sectionMoto.style.display = "none"

    
    eppMoto1[3].checked = true
    eppMoto1[0].checked = false

    eppMoto2[3].checked = true
    eppMoto2[0].checked = false

    eppMoto3[3].checked = true
    eppMoto3[0].checked = false
})

moto.addEventListener("click", function(){
    sectionMoto.style.display = "grid"
    sectionAuto.style.display = "none"

    eppMoto1[3].checked = false
    eppMoto1[0].checked = true

    eppMoto2[3].checked = false
    eppMoto2[0].checked = true

    eppMoto3[3].checked = false
    eppMoto3[0].checked = true
})

//alert("Los elementos marcados de color rojo con un (*), son obligatorios")
let fecha = document.getElementById("fecha")
let fechaActual= new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
fecha.value = fechaActual
//esta es la fecha en que se realiza la inspección

function validarFechas(campoFecha){

    let fechaIngresada = campoFecha
    let fechaEvaluar = new Date(fechaIngresada.value)

    let fechaMinima = new Date(2020, 1, 1)

    let fechaMaxima = new Date(2999, 1, 1)
    
    if (fechaEvaluar < fechaMinima || fechaEvaluar>fechaMaxima) {
        alert("Ingrese una fecha adecuada.");
        fechaIngresada.value = ""// Limpiar el campo de entrada
        return false
    }

    return true

}

let fechaVencimientoRt = document.getElementById("vencimiento-revision-tecnica")
let fechaVencimientoSOAT = document.getElementById("vencimiento-soat")
let fechaVencimiento = document.getElementById("fecha-vencimiento")


fechaVencimientoRt.addEventListener("blur", function(){
    validarFechas(fechaVencimientoRt)
})
fechaVencimientoSOAT.addEventListener("blur", function(){
    validarFechas(fechaVencimientoSOAT)
})
fechaVencimiento.addEventListener("blur", function(){
    //console.log('revisando la fecha de vencimiento')
    validarFechas(fechaVencimiento)
})

//obtener los datos del archivo
//uso de una petición fetch
fetch("../scripts/datos.json")
  .then((response) => response.json())
  .then((data) => {
    //la data obtenida será nombrada como users
    users = data;
    //cargar nombre de los choferes
    llenarSelect(document.getElementById("nombre-conductor"))

    //autocompletar firmas
    AutocompletarFirma(document.getElementById("nombre-conductor"), document.getElementById("firma-conductor"))

    //completar fechas de vencimiento y placa
    completarFechasVencimiento(document.getElementById("nombre-conductor"), document.getElementById("placa"))
    
  })
  .catch((error) => console.error("Error al cargar los datos:", error));

  //cargar nombre de los choferes
  function llenarSelect(selector){

    //evaluacion de tecnicos para el posible llenado
    users.tecnico.forEach(c=>{
        if(c.vehiculo!=""){
            let opcion = document.createElement("option")
            opcion.innerText = c.name
            selector.appendChild(opcion)
        }
    })
    //evaluacion de supervisores para el posible llenado
    users.supervisor.forEach(c=>{
        if(c.vehiculo!=""){
            let opcion = document.createElement("option")
            opcion.innerText = c.name
            selector.appendChild(opcion)
        }
    })
    //evaluacion de prevencionistas para el posible llenado
    users.prevencionista.forEach(c=>{
        if(c.vehiculo!=""){
            let opcion = document.createElement("option")
            opcion.innerText = c.name
            selector.appendChild(opcion)
        }
    })
  }

  //autocompletar firmas
  function AutocompletarFirma(selector, inputFirma){
    selector.addEventListener("change", function(){
        let nombreSeleccionado = selector.value

        let conductorTecnico = users.tecnico.find(
            (tecn) => tecn.name === nombreSeleccionado
        )
        let conductorSupervisor = users.supervisor.find(
            (supp) => supp.name === nombreSeleccionado
        )

        let conductorPrevencionista = users.prevencionista.find(
            (prev) => prev.name === nombreSeleccionado
        )

        // Verificar en qué categoría se encontró y completar la firma
        if (conductorTecnico) {
            inputFirma.value = conductorTecnico.firma
        } else if (conductorPrevencionista) {
            inputFirma.value = conductorPrevencionista.firma;
        } else if (conductorSupervisor) {
            inputFirma.value = conductorSupervisor.firma;
        } else {
            alert("Este espacio no puede permanecer vacío, seleccione al personal requerido")
        }
    })
  }

    /*Aquí inician las funcionalidades para las fechas*/
    let btnModificarFechas = document.getElementById("btn-modificar-fechas")
    btnModificarFechas.disabled = true

    btnModificarFechas.addEventListener("click", function(){
        //nombre del conductor seleccionado
        let nombre_conductor = document.getElementById("nombre-conductor").value
        //se obtienen los input donde están las fechas de vencimiento
        let elementosBotiquin = document.querySelectorAll(".vencimiento-elemento-botiquin");
        //se colocan todas las fechas obtenidas en un arreglo
        let fechasVencimiento = Array.from(elementosBotiquin).map(input => input.value)
        
        //se crea un objeto con los datos a enviar
        let data = {
            nombreConductor: nombre_conductor,
            fechasVencimiento: fechasVencimiento
        }

        fetch('../logica_adicional/guardar_fechas_botiquin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al enviar los datos.');
            }
            return response.json();
        })
        .then(data => {
            alert(`Los elementos del botiquín asociados a: ${data.nombreConductor} han sido modificados exitosamente`)
            //console.log('Datos actualizados exitosamente:', data);
            btnModificarFechas.disabled = true
        })
        .catch(error => {
            console.error('Error:', error);
        });
    })
    
    // Completar las fechas de vencimiento en los inputs de elementos del botiquin
    function completarFechasVencimiento(selector, elementoPlaca){
        selector.addEventListener("change", function(){

            //activacion del boton de modificar fechas
            btnModificarFechas.disabled = false
            btnModificarFechas.classList.add("btn-activo")

            //se obtiene el select donde se escoge al participante de la inspeccion
            let nombre_seleccionado = selector.value
            let indice = 0
            let conductorSeleccionado = null;

            //se busca el nombre que coincida
            let conductorTecnico = users.tecnico.find(
                (tecn) => tecn.name === nombre_seleccionado
            )

            let conductorSupervisor = users.supervisor.find(
                (tecn) => tecn.name === nombre_seleccionado
            )

            let conductorPrevencionista = users.prevencionista.find(
                (tecn) => tecn.name === nombre_seleccionado
            )
            
            //se guarda al conductor obtenido en una variable
            if (conductorTecnico) {
                conductorSeleccionado = conductorTecnico;
            } else if (conductorSupervisor) {
                conductorSeleccionado = conductorSupervisor;
            } else if (conductorPrevencionista) {
                conductorSeleccionado = conductorPrevencionista;
            }

            // Si se ha obtenido un valor se realiza lo siguiente
            if (conductorSeleccionado) {
                // Se carga la placa en la casilla de placa
                elementoPlaca.value = conductorSeleccionado.placa;
                
                // se selecciona a todos los input donde se digitan las fechas
                let fechasVencimientoInput = document.querySelectorAll(".vencimiento-elemento-botiquin")
                fechasVencimientoInput.forEach((fechaVencimientoInput)=>{
                    // Se cargan las fechas de vencimiento de manera ordenada (solo se cargan en orden)
                    fechaVencimientoInput.value = conductorSeleccionado.botiquin[indice].fecha_vencimiento
                    indice++
                })
            } else {
                alert("Este espacio no puede permanecer vacío, seleccione al personal requerido");
            }

        })
    }

    //validar que las fechas que se colocan en el botiquin sean correctas
    let contenedoresBotiquin = document.querySelectorAll(".elemento-botiquin")
    contenedoresBotiquin.forEach(function(element){
        let fecha_vencimiento = element.querySelector('input[type="date"]')
        fecha_vencimiento.addEventListener("blur", function(){
            validarFechas(fecha_vencimiento)
        })
    })

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
    //doc, objeto
    var doc = new jsPDF();
    //imagen del documento vacía
    const image = await loadImage("../recursos/formatoInspeccionVehicular.jpg");
    doc.addImage(image, "jpg", 0, 0, 210, 295);
    doc.setFontSize(6)

    let evaluar = true
    function evaluarDatosGenerales(){
        doc.setFontSize(6)
        let dia = fecha
        let placa = document.getElementById("placa").value.toUpperCase()
        let tarjeta = document.getElementById("tarjeta-propiedad").value
        let empresa = document.getElementById("empresa").value
        let lentes = document.getElementById("usa-lentes") //es checkbox
        let inicio = document.getElementById("inicio-km").value
        let final = document.getElementById("final-km").value
        let soat = document.getElementById("numero-soat").value
        let eSoat = document.getElementById("empresa-soat").value

        let partesFecha = fechaVencimientoSOAT.value.split("-")
        let vSeparado = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);
        let vSoatF = vSeparado.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        
        let horaInspeccion = document.getElementById("hora-inspeccion").value

        partesFecha = fechaVencimientoRt.value.split("-")
        vSeparado = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2])
        let vRevTecF = vSeparado.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

        let numBrevete = document.getElementById("numero-brevete").value
        let categoria = document.getElementById("categoria").value.toUpperCase()

        partesFecha = fechaVencimiento.value.split("-")
        vSeparado = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2])
        let vencimiento = vSeparado.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

            //fecha de inspeccion
            doc.text(fecha.value, 177, 36)

            if(empresa!=""){
                doc.text(empresa, 40.5, 24.5)
            }else{
                alert("Complete el campo de empresa")
                evaluar = false
                return
            }

            if(placa!=""){
                doc.text(placa, 40.5, 27.5)
            }else{
                alert("Complete el campo de la placa del vehículo")
                evaluar = false
                return
            }

            if(tarjeta!=""){
                doc.text(tarjeta, 40.5, 30.5)
            }else{
                alert("Complete el campo de tarjeta de propiedad")
                evaluar = false
                return
            }

            if(vRevTecF!="Invalid Date"){
                doc.text(vRevTecF, 40.5, 38)
            }else{
                alert("Complete el campo de vencimiento de revisión técnica")
                evaluar = false
                return
            }
            
            if(numBrevete!=""){
                doc.text(numBrevete, 165, 27.5)
            }else{
                alert("Complete el campo de número de brevete")
                evaluar = false
                return
            }

            if(categoria!=""){
                doc.text(categoria, 165, 30.4)
            }else{
                alert("Complete el campo de categoría")
                evaluar = false
                return
            }
            
            if(lentes.checked){
                doc.text("x", 178.5, 21)
            }else{
                doc.text("x", 191.3, 21)
            }

            if(inicio!=""){
                doc.setFontSize(4.5)
                doc.text(inicio, 176.5, 24.5)
            }else{
                alert("Complete el campo de km de inicio")
                evaluar = false
                return
            }

            //final deja de ser obligatorio y se coloca como oculto en el html
            /*if(final!=""){*/
                doc.setFontSize(4.5)
                doc.text(final, 199, 24.5)
            /*}else{
                alert("Complete el campo de km final")
                evaluar = false
                return
            }*/

            if(soat!=""){
                doc.setFontSize(6)
                doc.text(soat, 87, 27.5)
            }else{
                alert("Complete el campo de km final")
                evaluar = false
                return
            }

            if(eSoat!=""){
                doc.setFontSize(6)
                doc.text(eSoat, 87, 30.5)
            }else{
                alert("Complete el campo de empresa SOAT")
                evaluar = false
                return
            }

            if(vSoatF!="Invalid Date"){
                doc.setFontSize(6)
                doc.text(vSoatF, 87, 33.5)
            }else{
                alert("Complete el campo de vencimiento de soat")
                evaluar = false
                return
            }

            if(horaInspeccion!=""){
                doc.setFontSize(6)
                doc.text(horaInspeccion, 177, 39)
            }else{
                alert("Complete el campo de empresa SOAT")
                evaluar = false
                return
            }

            if(vencimiento!="Invalid Date"){
                doc.setFontSize(6)
                doc.text(vencimiento, 165, 33.5)
            }else{
                alert("Complete el campo de empresa SOAT")
                evaluar = false
                return
            }
            

        if(evaluar){
            return true
        }else{
            alert("Complete todos los campos de Datos Generales")
            return false
        }
    }

    function evaluarNombre(){
        let nombreConductor = document.getElementById("nombre-conductor").value
        let firmaConductor = document.getElementById("firma-conductor").value

        if(nombreConductor!="" && firmaConductor!=""){
            doc.text(nombreConductor, 40.5, 21.4)
            doc.addImage(firmaConductor, "PNG", 36, 268, 35, 5.8)
        }else{
            evaluar = false
        }
        
        if(evaluar){
            return true
        }else{
            alert("Seleccionar el nombre del conductor")
            return false
        }
    }

    function evaluarObservaciones(){
        let observaciones = document.getElementById("observaciones").value
        doc.text(observaciones, 6.5, 255.4, {
            maxWidth: 192,
            lineHeightFactor: 1.48, 
            align: "justify"
        })
        return true
    }

    function evaluarTodoVehiculo(){
        let positionY = 58
        let contarSaltoX = 0
        let contadorEspacio = 0

        doc.setFontSize(4.6)
        //evaluando los radio button
        let tv = document.querySelector(".selectores-todo-vehiculo").querySelectorAll(".selector-elemento")
        tv.forEach(t=>{
            inputsEvaluar = t.querySelectorAll("input")
            inputsEvaluar.forEach((i)=>{
                
                if(i.checked){

                    if(contarSaltoX<10){
                        doc.text(i.value, 54, positionY,{ align: "center"})
                    }else if(10<=contarSaltoX && contarSaltoX<=19){
                        doc.text(i.value, 122, positionY,{ align: "center"})
                    }else if(19<contarSaltoX){
                        doc.text(i.value, 182, positionY,{ align: "center"})
                    }
                    
                    if(contadorEspacio==4){
                        positionY+=5
                    }else if(contadorEspacio==14){
                        positionY+=5
                    }else if(contadorEspacio==24){
                        positionY+=5
                    }else{
                        positionY+=3
                    }
                    
                    contarSaltoX+=1
                    contadorEspacio+=1

                    if(contarSaltoX%10==0){
                        positionY= 58
                    }
                }
            })
        })

        positionY = 58
        contarSaltoX = 0
        contadorEspacio = 0

        //evaluando los select
        tv.forEach(s=>{
            selectEvaluar = s.querySelectorAll("select")
            selectEvaluar.forEach((se)=>{
                
                if(contarSaltoX<10){
                    doc.text(se.value, 63, positionY,{ align: "center"})
                }else if(10<=contarSaltoX && contarSaltoX<=19){
                    doc.text(se.value, 133, positionY,{ align: "center"})
                }else if(19<contarSaltoX){
                    doc.text(se.value, 197, positionY,{ align: "center"})
                }
                
                if(contadorEspacio==4){
                    positionY+=5
                }else if(contadorEspacio==14){
                    positionY+=5
                }else if(contadorEspacio==24){
                    positionY+=5
                }else{
                    positionY+=3
                }
                
                contarSaltoX+=1
                contadorEspacio+=1

                if(contarSaltoX%10==0){
                    positionY = 58
                }
            })
        })
        return true
    }

    function evaluarLLantas(){
        let cl = document.querySelector(".contenedor-llantas").querySelectorAll(".selector-elemento")
        positionLlantasY = 93.5
        cl.forEach(c=>{
            inputsEvaluar = c.querySelectorAll("input")
            inputsEvaluar.forEach((i)=>{
                if(i.checked){
                    doc.text(i.value, 54, positionLlantasY,{
                        align: "center"
                    })
                    positionLlantasY+=3
                }
            })
        })

        positionLlantasY = 93.5
        cl.forEach(c=>{
            selectEvaluar = c.querySelectorAll("select")
            selectEvaluar.forEach((i)=>{
                doc.text(i.value, 63, positionLlantasY,{ align: "center"} )
                positionLlantasY += 3
            })
        })

        return true
    }


    function evaluarAccesorios(){
        let cl = document.querySelector(".contenedor-accesorios").querySelectorAll(".selector-elemento")
        positionY = 93.5
        cl.forEach(c=>{
            inputsEvaluar = c.querySelectorAll("input")
            inputsEvaluar.forEach((i)=>{
                if(i.checked){
                    doc.text(i.value, 122, positionY,{
                        align: "center"
                    })
                    positionY+=3
                }
            })
        })

        positionY = 93.5
        cl.forEach(c=>{
            selectEvaluar = c.querySelectorAll("select")
            selectEvaluar.forEach((i)=>{
                doc.text(i.value, 133, positionY,{ align: "center"} )
                positionY += 3
            })
        })

        return true
    }

    function evaluarTapas(){
        let cl = document.querySelector(".contenedor-tapas").querySelectorAll(".selector-elemento")
        positionY = 93.5
        cl.forEach(c=>{
            inputsEvaluar = c.querySelectorAll("input")
            inputsEvaluar.forEach((i)=>{
                if(i.checked){
                    doc.text(i.value, 182, positionY,{
                        align: "center"
                    })
                    positionY+=3
                }
            })
        })

        positionY = 93.5
        cl.forEach(c=>{
            selectEvaluar = c.querySelectorAll("select")
            selectEvaluar.forEach((i)=>{
                doc.text(i.value, 197, positionY,{ align: "center"} )
                positionY += 3
            })
        })

        return true
    }

    function evaluarMoto(){
        doc.setFontSize(4.6)
        
        let positionY = 114.5
        let contarSaltoX = 0
        let contadorEspacio = 0

        let motos = document.querySelectorAll(".selector-motorizado")
        motos.forEach(mt=>{
            inputsEvaluar = mt.querySelectorAll("input")
            inputsEvaluar.forEach(i=>{
                if(i.checked){

                    if(contarSaltoX<4){
                        doc.text(i.value, 54, positionY, {
                            align: "center"
                        })
                    }else if(4<=contarSaltoX && contarSaltoX<=7){
                        doc.text(i.value, 122, positionY, {
                            align: "center"
                        })
                    }else{
                        doc.text(i.value, 182, positionY, {
                            align: "center"
                        })
                    }
                    
                    if(contadorEspacio==2){
                        positionY+=6
                    }else if(contadorEspacio==6){
                        positionY+=6
                    }else{
                        positionY+=3
                    }

                    contarSaltoX+=1
                    contadorEspacio+=1

                    if(contarSaltoX%4==0){
                        positionY=114.5
                    }

                }
            })
        })

        positionY = 114.5
        contarSaltoX = 0
        contadorEspacio = 0

        motos.forEach(mt=>{
            inputsEvaluar = mt.querySelectorAll("select")
            inputsEvaluar.forEach(i=>{
       
                if(contarSaltoX<4){
                    doc.text(i.value, 63, positionY, {
                        align: "center"
                    })
                }else if(4<=contarSaltoX && contarSaltoX<=7){
                    doc.text(i.value, 133, positionY, {
                        align: "center"
                    })
                }else{
                    doc.text(i.value, 197, positionY, {
                        align: "center"
                    })
                }
                    
                if(contadorEspacio==2){
                    positionY+=6
                }else if(contadorEspacio==6){
                    positionY+=6
                }else{
                    positionY+=3
                }

                contarSaltoX+=1
                contadorEspacio+=1

                if(contarSaltoX%4==0){
                    positionY=114.5
                }
            })
        })
        return true
    }

    function evaluarEpp(){
        let contenedoresEpp = document.querySelectorAll(".elemento-epp")
        positionY = 144
        contenedoresEpp.forEach(c=>{
            elemento = c.querySelectorAll("input")
            elemento.forEach(i=>{
                if(i.checked){
                    doc.text(i.value, 58, positionY,{
                        align: "center"
                    } )
                    positionY+=2.75
                }
            })
        })

        positionY = 144
        contenedoresEpp.forEach(c=>{
            elemento = c.querySelectorAll("select")
            elemento.forEach(i=>{

                    doc.text(i.value, 76.5, positionY,{
                        align: "center"
                    } )
                    positionY+=2.75
            })
        })
        
        return true
    }

    function evaluarPma(){
        let contenedoresPma = document.querySelectorAll(".elemento-pma")
        positionY = 177
        contenedoresPma.forEach(c=>{
            elemento = c.querySelectorAll("input")
            elemento.forEach(i=>{
                if(i.checked){
                    doc.text(i.value, 58, positionY,{
                        align: "center"
                    } )
                    positionY+=2.8
                }
            })
        })

        positionY = 177
        contenedoresPma.forEach(c=>{
            elemento = c.querySelectorAll("select")
            elemento.forEach(i=>{

                    doc.text(i.value, 76.5, positionY,{
                        align: "center"
                    } )
                    positionY+=2.8
            })
        })
        
        return true
    }

    //Section del botiquin
    function evaluarBotiquin(){
        evaluar = true
        let botY = 193
        let salto = 0
        let contadorElementoBotiquin = 0
        //fechas inicia
        contenedoresBotiquin.forEach(f=>{
            inputFecha = f.querySelector('input[type="date"]')
            partesFecha = inputFecha.value.split("-")
            vSeparado = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2])
            let fechaBotiquin = vSeparado.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
            
            if(fechaBotiquin!="" && fechaBotiquin!="Invalid Date" || contadorElementoBotiquin==7 ||
            contadorElementoBotiquin==12 || contadorElementoBotiquin==13){
                if(salto==1 || salto==7){
                    if(fechaBotiquin=="Invalid Date"){
                        typeof(fechaBotiquin)
                        fechaBotiquin=""
                    }
                    doc.text(fechaBotiquin, 72, botY, { align: 'center'})
                    botY+=4.5
                }else{
                    if(fechaBotiquin=="Invalid Date"){
                        typeof(fechaBotiquin)
                        fechaBotiquin=""
                    }
                    doc.text(fechaBotiquin, 72, botY, { align: 'center'})
                    botY+=2.86
                }
                
            }else{
                evaluar = false
                return
            }
            contadorElementoBotiquin+=1
            salto+=1
        })

        botY = 193
        salto = 0
        contenedoresBotiquin.forEach(c=>{
            elemento = c.querySelectorAll("input[type='radio']")
            elemento.forEach(i=>{
                if(i.checked){
                    if(salto==1 || salto==7){
                        doc.text(i.value, 101, botY, { align: 'center'})
                        botY+=4.5
                    }else{
                        doc.text(i.value, 101, botY, { align: 'center'})
                        botY+=2.86
                    }
                }
            })
            salto+=1
        })

        botY = 193
        salto = 0
        contenedoresBotiquin.forEach(c=>{
            elemento = c.querySelectorAll("select")
            elemento.forEach(i=>{
                if(salto==1 || salto==7){
                    doc.text(i.value, 122, botY, { align: 'center'})
                    botY+=4.5
                }else{
                    doc.text(i.value, 122, botY, { align: 'center'})
                    botY+=2.86
                }
            })
            salto+=1

        })

        if(evaluar){
            return true
        }else{
            alert('Debe ingresar la fecha de vencimiento de los productos en el botiquín')
            return false
        }
        //fechas termina
    }


    function evaluarConductor(){
        evaluar = true

        let eval1 = document.getElementById("ev-conductor1")
        let eval2 = document.getElementById("ev-conductor2")

        doc.setFontSize(8.5)
        doc.setTextColor(0, 0, 225);

        if(!eval1.checked){
            doc.text("X", 195, 245.6)
        }else{
            doc.text("X", 173.73, 245.6)
        }
        
        if(!eval2.checked){
            doc.text("X", 195, 249)
        }else{
            doc.text("X", 173.73, 249)
        }
        

        return evaluar
    }

    /*datos del supervisor directamente al documento*/
    
    doc.setFontSize(5.2)
    doc.text("Roberto Carlos Luis Bailon", 40.5, 33.4)
    doc.text("Roberto Carlos Luis Bailon", 172, 281, {
        maxWidth: "32"
    })
    doc.addImage("../recursos/firmas/RobertoLuisBailon.png", "PNG", 158, 268,  35, 6)

    

    if(auto.checked){

        if(evaluarDatosGenerales() && evaluarNombre() && evaluarObservaciones() && evaluarTodoVehiculo() && evaluarLLantas() && evaluarAccesorios() && evaluarTapas() && evaluarEpp() && evaluarPma() && evaluarBotiquin() && evaluarConductor()){
            var blob = doc.output("blob");
            window.open(URL.createObjectURL(blob));

            /*fechaActual = fechaActual.replace(/\//g, "_")
            const nombreDocumento =`INSPECCION_VEHICULAR_${fechaActual}.pdf`
            doc.save(nombreDocumento)
            //endodear el resultado del pdf
            var file_data = btoa(doc.output())
            var form_data = new FormData()
            form_data.append("file", file_data)
            form_data.append("nombre", "INSPECCION_VEHICULAR")
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
            alert("Completar todos los campos")
        }
    }else if(moto.checked){

        if(evaluarDatosGenerales() && evaluarNombre() && evaluarObservaciones() && evaluarMoto() && evaluarEpp() && evaluarPma() && evaluarBotiquin() && evaluarConductor()){
            var blob = doc.output("blob");
            window.open(URL.createObjectURL(blob));

            /*fechaActual = fechaActual.replace(/\//g, "_")
            const nombreDocumento =`INSPECCION_VEHICULAR_${fechaActual}.pdf`
            doc.save(nombreDocumento)
            //endodear el resultado del pdf
            var file_data = btoa(doc.output())
            var form_data = new FormData()
            form_data.append("file", file_data)
            form_data.append("nombre", "INSPECCION_VEHICULAR")
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
            alert("Completar todos los campos obligatorios")
        }
    }
  })