let fecha = document.getElementById("fecha");
let dia = new Date().toLocaleDateString();
fecha.value = dia;

let codCuadrillaSubjetct = "";
//mensaje de aviso
alert("Buen día, por favor, seleccione correctamente los datos de inspección y marque la casilla correspondiente si desea añadir información adicional.")

//obtener los datos del archivo
//uso de una petición fetch
fetch(`../scripts/datos.json?t=${new Date().getTime()}`)
  .then((response) => response.json())
  .then((data) => {
    //la data obtenida será nombrada como users
    users = data;
    llenarSelect(document.getElementById("jefe-cuadrilla"));
    autocompletarInformacion(
      document.getElementById("jefe-cuadrilla"),
      document.getElementById("nombres"),
      document.getElementById("apellidos"),
      document.getElementById("firma"),
      document.getElementById("dni")
    );
  })
  .catch((error) => console.error("Error al cargar los datos:", error));

//funcion para seleccionar entre los responsables de cuadrilla y el supervisor
function llenarSelect(elemento) {
  //obtiene los datos de los técnicos responsables de cuadrilla
  //y el autocompletado solo funciona para los responsables de cuadrilla
  users.tecnico.forEach((tecnico) => {
    const option = document.createElement("option");
    option.value = tecnico.name;

    if (tecnico.cargo == "Jefe Cuadrilla de Balance") {
      option.textContent = tecnico.name;
      //agrega los elementos obtenidos al select
      elemento.appendChild(option);
    }
  });
}

function autocompletarInformacion(elementoSelect, dato, dato1, dato2, dato3) {
  elementoSelect.addEventListener("change", function () {
    const nombreSeleccionado = elementoSelect.value;
    if (nombreSeleccionado != "" && nombreSeleccionado != "Seleccionar") {
      const usuarioSeleccionado = users.tecnico.find(
        (tecnico) => tecnico.name === nombreSeleccionado
      );

      if (usuarioSeleccionado) {
        dato.value = usuarioSeleccionado.nombres;
        dato1.value = usuarioSeleccionado.apellidos;
        dato2.value = usuarioSeleccionado.firma;
        dato3.value = usuarioSeleccionado.dni;
      }
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

let btnGenerar = document.getElementById("btnGenerar");

btnGenerar.addEventListener("click", async function generarPDF(e) {
  e.preventDefault();
  //doc, objeto
  //dimensiones del documento pdf
  var doc = new jsPDF();
  //imagen del documento vacía
  const image = await loadImage("../recursos/formatoActaInspeccion.jpg");
  //colocar la imagen
  //colocar imagen desde una posicion en especifico, con las dimensiones especificas
  doc.addImage(image, "JPG", 0, 0, 210, 297);
  doc.setFontSize(6.5);
  let eval = true;

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

  function evaluarDatosGenerales() {
    let subestacion = document.getElementById("subestacion").value;
    let tiposed = document.getElementById("tipo-sed").value;
    let nivel_tension = document.getElementById("nivel-tension").value;
    let cliente = document.getElementById("cliente").value;
    let ubicacion = document.getElementById("ubicacion").value;
    let fecha = document.getElementById("fecha").value;
    let hora_inicio = document.getElementById("h-inicio").value;
    let hora_final = document.getElementById("h-fin").value;

    let datosGenerales = [
      subestacion,
      tiposed,
      nivel_tension,
      cliente,
      ubicacion,
      fecha,
      hora_inicio,
      hora_final,
    ];

    let col1X = 39;
    let col2X = 97;
    let datosX = 89;
    let datosY = 47.5;
    let datosYc2 = 47.5;
    let cont = 1;

    datosGenerales.forEach((e) => {
      if (cont < 4) {
        if (e != "") {
          doc.text(e, col1X, datosY);
          datosY += 4.6;
        } else {
          eval = false;
        }
        cont += 1;
      } else if (cont <= 5) {
        if (e != "") {
          doc.text(e, col2X, datosYc2);
          datosYc2 += 4.6;
        } else {
          eval = false;
        }
        cont += 1;
      } else {
        datosY = 56.7;
        if (e != "") {
          doc.text(e, datosX, datosY);
          datosX += 37;
        } else {
          eval = false;
        }
      }
    });

    if (eval == false) {
      alert("Debe completar todos los campos de datos generales");
      return;
    }
  }

  function evaluarSituacionEncontrada() {
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 135);
    let opcionesSituacion1 = document.querySelectorAll(
      ".situacion-encontrada-1"
    );
    opcionesSituacion1.forEach((e) => {
      if (e.checked) {
        if (e.value == 1) {
          doc.text("X", 81, 70.4);
        } else {
          doc.text("X", 126, 70.4);
        }
      }
    });

    let opcionesSituacion2 = document.querySelectorAll(
      ".situacion-encontrada-2"
    );
    opcionesSituacion2.forEach((e) => {
      if (e.checked) {
        if (e.value == 1) {
          doc.text("X", 81, 75.2);
        } else {
          doc.text("X", 126, 75.2);
        }
      }
    });
  }

  function evaluarDatosInspeccion() {
    doc.setFontSize(6.5);
    doc.setTextColor(30, 41, 135);
    let contador = 1;
    //Esta variable obtiene a todos los input de respuestas o detalles de los datos de inspección
    //la lógica es la siguiente
    //primero se selecciona a todos los contenedores principales de 'Datos de inspeccion'
    document.querySelectorAll(".contenedor-dato-inspeccion").forEach((e) => {
      //Luego se selecciona solo a sus input, ya que estos son los que serán evaluados
      let inputs = e.querySelectorAll("input[type='checkbox']:checked")
      
      //Se recorre cada uno de  los input existentes dentro de uno de los contenedores
      inputs.forEach(function (i) {
        //la aplicaicon de un contador sería útil para que se ejecute una lógica difrente
        //según el número de contenedor que esté siendo utilizado
        switch (contador) {
          //En cada caso se debe colocar la posición según corresponda
          /*Coloca condicional de posicionamiento acerca de para el texto de detalles en el caso:
          2, 3, 4, 5 y 14 de manera similar a como funciona el caso 9, en esos casos se trata de texto,
          se recomienda también modificar el tamaño con un style simple en donde existen input del tipo numérico
          */
          case 1:
            if (i.value == 1) {
              doc.text("X", 58, 93.8);
            } else if (i.value == 2) {
              doc.text("X", 87, 93.8);
            } else if (i.value == 3) {
              doc.text("X", 95.5, 93.8);
            } else if (i.value == 4) {
              doc.text("X", 122, 93.8);
            } else if (i.value == 5) {
              doc.text("X", 144, 93.8);
            } else {
              doc.text("X", 169, 93.8);
            }
            break;
          case 2:
            if (i.value == 1) {
              doc.text("X", 67, 99.2);
            } else if (i.value == 2) {
              doc.text("X", 105, 99.2);
            } else {
              detalle = document.getElementById("txtcondicion2").value;
              if (detalle != "") {
                doc.setFontSize(5)
                if(detalle.length>10){
                  doc.text(detalle, 160, 97.7, { maxWidth: 28, align: "justify", lineHeightFactor: 0.8});
                }else{
                  doc.text(detalle, 161.5, 99.2)
                }
                doc.setFontSize(6.5)
              } else {
                alert(
                  "La casilla 'Reductores de Corriente de Totalizador debe contener información'"
                );
                eval = false;
              }
            }
            break;
          case 3:
            if (i.value == 1) {
              doc.text("X", 67, 105.5);
            } else if (i.value == 2) {
              doc.text("X", 104, 105.5);
            } else {
              detalle = document.getElementById("txtcondicion3").value;
              if (detalle != "") {
                doc.setFontSize(5)
                if(detalle.length>10){
                  doc.text(detalle, 150.5, 103.5, { maxWidth: 38, align: "justify", lineHeightFactor: 0.8})
                }else{
                  doc.text(detalle, 150.5, 104.5)
                }
                doc.setFontSize(6.5)
              } else {
                alert("La casilla 'Tablero BT' debe contener información");
                eval = false;
              }
            }
            break;
          case 4:
            if (i.value == 1) {
              doc.text("X", 67, 111);
            } else if (i.value == 2) {
              doc.text("X", 105, 111);
            } else {
              detalle = document.getElementById("txtcondicion4").value;
              if (detalle != "") {
                doc.setFontSize(5)
                if(detalle.length>10){
                  doc.text(detalle, 160, 109, { maxWidth: 28, align: "justify", lineHeightFactor: 0.8})
                }else{
                  doc.text(detalle, 160, 110.5)
                }
                doc.setFontSize(6.5)
              } else {
                alert("La casilla 'Tablero BT' debe contener información");
                eval = false;
              }
            }
            break;
          case 5:
            if (i.value == 1) {
              detalle = document.getElementById("txtcondicion51").value;
              if (detalle != "") {
                doc.setFontSize(5)
                doc.text(detalle, 80, 116.5);
                doc.setFontSize(6.5)
              } else {
                alert(
                  "La casilla 'N° Llaves de valor[1]' debe contener información"
                );
                eval = false;
              }
            } else if (i.value == 2) {
              doc.text("X", 104, 116.5);
            } else if (i.value == 3) {
              detalle = document.getElementById("txtcondicion52").value;
              if (detalle != "") {
                doc.setFontSize(5)
                doc.text(detalle, 147, 116.5);
                doc.setFontSize(6.5)
              } else {
                alert(
                  "La casilla 'N° Llaves de valor[3]' debe contener informaciónn"
                );
                eval = false;
              }
            } else {
              detalle = document.getElementById("txtcondicion53").value;
              if (detalle != "") {
                doc.setFontSize(5)
                doc.text(detalle, 175, 116.5);
                doc.setFontSize(6.5)
              } else {
                alert(
                  "La casilla 'N° Llaves de valor[4]' debe contener información"
                );
                eval = false;
              }
            }

            break;
            //Si se presenta un caso6, entonces se colocarán únicamente las marcas de X
          case 6:
            if (i.value == 1) {
              doc.text("X", 58, 122.5);
            } else if (i.value == 2) {
              doc.text("X", 75, 122.5);
            } else if (i.value == 3) {
              doc.text("X", 96.5, 123.4);
            } else if (i.value == 4) {
              doc.text("X", 108, 122.5);
            } else if (i.value == 5) {
              doc.text("X", 117, 123);
            } else if (i.value == 6) {
              doc.text("X", 132, 123);
            } else if (i.value == 7) {
              doc.text("X", 144, 123);
            } else if (i.value == 8) {
              doc.text("X", 152.3, 123);
            } else if (i.value == 9) {
              doc.text("X", 168, 123);
            }
            break;
          case 7:
            if(i.value==1){
                doc.text("X", 68, 128)
            }else if(i.value==2){
                doc.text("X", 104, 128)
            }else{
                detalle = document.getElementById("txtcondicion7").value
                if(detalle!=""){
                  doc.setFontSize(5)
                  if(detalle.length>10){
                    doc.text(detalle, 163, 126.4, { maxWidth: 25, align: "justify", lineHeightFactor: 0.8})
                  }else{
                    doc.text(detalle, 163, 128)
                  }
                  doc.setFontSize(6.5)
                }else{
                    alert("La casilla 'Reductores de corriente del medidor AP debe contener información")
                    eval = false
                }
            }
            break;
          case 8:
            if (i.value == 1) {
                doc.text("X", 58, 134);
              } else if (i.value == 2) {
                doc.text("X", 90, 134);
              } else if (i.value == 3) {
                doc.text("X", 95.5, 134);
              } else if (i.value == 4) {
                doc.text("X", 120, 134);
              } else if (i.value == 5) {
                doc.text("X", 143.5, 134);
              } else {
                doc.text("X", 168, 134);
              }
              break;
          case 9:
            if(i.value == 1){
                doc.text("X", 68, 139.5)
            }else if(i.value == 2){
                doc.text("X", 103, 139.5)
            }else{
                detalle = document.getElementById("txtcondicion9").value
                if(detalle!=""){
                  doc.setFontSize(5)
                  if(detalle.length>10){
                    doc.text(detalle, 161, 137.8, { maxWidth: 28, align: "justify", lineHeightFactor: 0.8})
                  }else{
                    doc.text(detalle, 161, 139)
                  }
                  doc.setFontSize(6.5)
                }else{
                    alert("La casilla 'DMS Redes Eléctricas MT' debe contener información")
                    eval = false
                }
            }
            break;
          case 10:
            if(i.value==1){
                doc.text("X", 68, 145)
            }else if(i.value==2){
                doc.text("X", 105, 145)
            }else{
                doc.text("X", 153, 145)
            }
            break;
          case 11:
            if(i.value==1){
                doc.text("X", 63, 151)
            }else if(i.value==2){
                doc.text("X", 100, 151)
            }else if(i.value==3){
                doc.text("X", 131, 151)
            }else{
                doc.text("X", 175, 151)
            }
            break;
          case 12:
            if(i.value==1){
                doc.text("X", 65.4, 156.2)
            }else if(i.value==2){
                doc.text("X", 101.5, 156.2)
            }else if(i.value==3){
                doc.text("X", 149, 156.2)
            }
            break;
          case 13:
            if(i.value==1){
                doc.text("X", 58, 161.3)
            }else if(i.value==2){
                doc.text("X", 82.2, 161)
            }else if(i.value==3){
                doc.text("X", 103.4, 161)
            }else if(i.value==4){
                doc.text("X", 120, 161.3)
            }else{
                doc.text("X", 150, 161.3)
            }
            break;
          case 14:
            if(i.value==1){
                doc.text("X", 65, 168)
            }else if(i.value==2){
                doc.text("X", 97.5, 168)
            }else if(i.value==3){
                doc.text("X", 116.2, 168)
            }else{
                detalle = document.getElementById("txtcondicion14").value
                if(detalle!=""){
                  doc.setFontSize(5)
                  if(detalle.length>10){
                    doc.text(detalle, 138.5, 166.5, { maxWidth: 48, align: "justify", lineHeightFactor: 0.8})
                  }else{
                    doc.text(detalle, 138.5, 168)
                  }
                  doc.setFontSize(6.5)
                }else{
                    alert("La casilla 'Giro del cliente' debe contener información")
                    eval = false
                }
            }
            break;
        }
      });
      contador += 1;
    });

    let procede = document.querySelectorAll(".d15")
    procede.forEach(a=>{
      if(a.checked){
        if(a.value==1){
          doc.text("X", 59, 173.5)
        }else{
          doc.text("X", 98, 173.5)
        }
      }
    })
            
  }

  function evaluarObservaciones() {
    let observaciones = document.getElementById("t-observaciones").value;

    if(observaciones!=""){
      observaciones = observaciones.replace(/(\r\n|\n|\r)/gm, "  ")
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      
      let textY = 185;
      doc.text(observaciones, 21, textY, {
        maxWidth: 168,
        lineHeightFactor: 1.75,
        align: "justify",
      });
    }else{{
      eval = false
      alert("Completar la casilla de Observaciones")
    }}
    
  }

  function evaluarRecomendaciones() {
    let recomendaciones = document.getElementById("t-recomendaciones").value;

    if(recomendaciones!=""){
      let textY = 212.6;
      doc.text(recomendaciones, 21, textY, {
        maxWidth: 168,
        lineHeightFactor: 1.75,
        align: "justify",
      });
    }else{
      eval = false
      alert("Completar la casilla de Recomendaciones")
    }
  }

  function evaluarSupervisor(){
    let firmaSupervisor = "../recursos/firmas/RobertoLuisBailon.png";
    doc.addImage(firmaSupervisor, "PNG", 39, 230, 30, 10);
  }

  function evaluarJefeCuadrilla() {
    doc.setFontSize(7);
    let nombres = document.getElementById("nombres").value.toUpperCase();
    let apellidos = document.getElementById("apellidos").value.toUpperCase();
    let dni = document.getElementById("dni").value;
    let firma = document.getElementById("firma").value;

    doc.text(apellidos, 95.1, 250);
    doc.text(nombres, 95.1, 254.6);
    doc.text(dni, 89.1, 258.8);
    doc.addImage(firma, "PNG", 88, 230, 30, 10);
  }

  function evaluarResponsable(){
    let firmaResponsable = "../recursos/firmas/HiderNelsonCastellanosCardenas.png";
    let nombreResponsable = "HIDER NELSON";
    let apellidosResponsable = "CASTELLANOS CARDENAS";
    let dniResponsable = "47200017";

    doc.text(nombreResponsable, 142, 250);
    doc.text(apellidosResponsable, 142, 254.6);
    doc.text(dniResponsable, 136, 258.8);
    doc.addImage(firmaResponsable, "PNG", 147, 230, 30, 10);
  }

  //ejecutar funciones en orden de creacion
  evaluarDatosGenerales()
  evaluarSituacionEncontrada()
  evaluarDatosInspeccion()
  evaluarObservaciones()
  evaluarRecomendaciones()
  evaluarSupervisor()
  evaluarJefeCuadrilla()
  evaluarResponsable()

  if(eval && evaluarCodigoCuadrillas()) {
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

    dia = dia.replace(/\//g, "_")
    const nombreDocumento = `ACTA_DE_INSPECCION_${dia}.pdf`
    doc.save(nombreDocumento)
    //endodear el resultado del pdf
    var file_data = btoa(doc.output())
    var form_data = new FormData()

    form_data.append("file", file_data)
    form_data.append("nombre", "ACTA_DE_INSPECCION")
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
  } else {
    alert("Debe completar todos los datos solicitados");
  }
});
