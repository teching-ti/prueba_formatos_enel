/*colocar fecha en base al reloj del sistema, dentro de la casilla 'fecha'*/
let cargarFecha = () => {
    let fecha = document.getElementById("fecha");
    dia = new Date().toLocaleDateString();
    fecha.value = dia;
  };
  cargarFecha();
  /*colocar fecha end*/
  
  //obtener los datos del archivo
  //uso de una petición fetch
  fetch("../scripts/datos.json")
    .then((response) => response.json())
    .then((data) => {
      //la data obtenida será nombrada como users
      users = data;
      /*Autocompletado y llenado para los técnicos*/
      //llena las opciones de 'participantes tecnicos' del primer select que aparecerá por defecto
      //funcion
      llenarSelect(document.querySelector(".trabajador-nombre"));
      autocompletarCampos(
        document.querySelector(".trabajador-nombre"),
        document.querySelector(".contenedor-nombre")
      );
  
      //funcionalidades de llenado para el responsable
      llenarSelect(document.getElementById("responsable-nombre"));
      autocompletarCamposResponsable(
        document.getElementById("responsable-nombre"),
        document.getElementById("firma-responsable")
      );
      //funcionalidades de llenado para el supervisor
      llenarSelectSupervisor(document.getElementById("supervisor-nombre"))
      autoCompletarCamposSupervisor(
        document.getElementById("supervisor-nombre"),
        document.getElementById("firma-supervisor")
      )
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
  }
  
  //autocompletar el select ya creado
  function autocompletarCampos(elementoSelect, datosParticipante) {
    elementoSelect.addEventListener("change", function () {
      const nombreSeleccionado = elementoSelect.value;
      const usuarioSeleccionado = users.tecnico.find(
        (tecnico) => tecnico.name === nombreSeleccionado
      );
      datosParticipante.querySelector(".trabajador-dni").value =
        usuarioSeleccionado.dni;
      datosParticipante.querySelector(".trabajador-firma").value =
        usuarioSeleccionado.firma;
    });
  }
  
  /*Autocompletado del responsable*/
  function autocompletarCamposResponsable(elementoSelect, datosResponsable) {
    elementoSelect.addEventListener("change", function () {
      const nombreSeleccionado = elementoSelect.value;
      const responsableSeleccionado = users.tecnico.find(
        (tecnico) => tecnico.name === nombreSeleccionado
      );
      //autocompletar los campos correspondientes
      if(nombreSeleccionado!="Seleccionar"){
        datosResponsable.value = responsableSeleccionado.firma;
      }else{
        alert("Este espacio no puede permanecer vacío, seleccione al personal requerido")
      }
    });
  }
  
  // Función para llenar el select con opciones de suoervisor, prevencionista y técnicos
  function llenarSelectSupervisor(elementoSelect) {
    //una vez con la data 'users' obtenida se podrá acceder a cada uno de los elementos dentro de ella
    users.supervisor.forEach((supervisor)=>{
      const option = document.createElement("option");
      option.value = supervisor.name;
      option.textContent = supervisor.name;
      elementoSelect.appendChild(option);
    })
  
    users.tecnico.forEach((tecnico) => {
      const option = document.createElement("option");
      option.value = tecnico.name;
      if(tecnico.cargo=="Jefe Cuadrilla de Balance"){
        option.textContent = tecnico.name;
        elementoSelect.appendChild(option);
      }
    });
  
    //una vez con la data 'users' obtenida se podrá acceder a cada uno de los elementos dentro de ella
    users.prevencionista.forEach((prevencionista)=>{
      const option = document.createElement("option");
      option.value = prevencionista.name;
      option.textContent = prevencionista.name;
      elementoSelect.appendChild(option);
    })
  }
  
  function autoCompletarCamposSupervisor(elementoSelect, campo){
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
        campo.value = tecnicoSeleccionado.firma;
      } else if (supervisorSeleccionado) {
        campo.value = supervisorSeleccionado.firma;
      } else if (prevencionistaSeleccionado) {
        campo.value = prevencionistaSeleccionado.firma;
      } else {
        alert("Este espacio no puede permanecer vacío, seleccione al personal requerido")
      }
    });
  }
  /*Agregar Persona*/
  
  let btnAgregarPersonal = document.querySelector(".agregar-personal");
  let btnGenerar = document.querySelector(".terminar");
  
  /*el btnAgregarPersonal ejecutará la función respectiva y al mismo tiempo también posee un contador
  , este servirá para evitar que los radio button creados tengan el mismo nombre que los anteriores*/
  let numUser = 1;
  btnAgregarPersonal.addEventListener("click", function () {
    //solo permitirá la creación de  usuarios
    if (numUser < 4) {
      agregarContenedorPersona(numUser);
      // todo lo correspondiente a selectores sirve como autocompletado para todos los selects clonados
      // ya que la función normal de autocompletado solo se ejecuta con los elementos creados por default
      let selectores = document.querySelectorAll(".trabajador-nombre");
      selectores.forEach((selectorNombre) => {
        selectorNombre.addEventListener("change", function (event) {
          const nombreSeleccionado = selectorNombre.value;
          const usuarioSeleccionado = users.tecnico.find(
            (tecnico) => tecnico.name === nombreSeleccionado
          );
          const contenedor = event.target.closest(".contenedor-nombre");
  
          contenedor.querySelector(".trabajador-dni").value =
            usuarioSeleccionado.dni;
          contenedor.querySelector(".trabajador-firma").value =
            usuarioSeleccionado.firma;
        });
      });
      numUser += 1;
    } else {
      alert("Ha alcanzado el número máximo de participantes");
    }
  });
  
  // la creación de esta variable servirá para hacer un scroll al momento de hacer presionar el boton verde que mostrará al personal
  let contenedoresTrabajadores = document.querySelectorAll(".contenedor-trabajador")
  
  //la creación de esta variable servirá para que se pueda cambiar los select a 0 de de todos los elementos existentes
  //incluyendo a los elementos que sean agregados al añadir un nuevo personal
  let radioButtons = document.querySelectorAll('input[type="radio"]')
  // se hace una iteración sobre todos los radio buttons de la página
  //se crea una funcion que asigna event lsitener a cada radio button para evaluar si es NT cambie su select a 0 y se ejecuta
  let functionObtenerRadioButtons = function(){
    radioButtons.forEach(r => {
      r.addEventListener('click', function() {
      // se obtiene el select correspondiente al raddio buttons
        const selectElement = this.closest('.elemento-cuerpo').querySelector('select');
          // si el valor del botón de radio es 'NT', se establece el valor del select a '0'
          //selectElement.value = (this.value === 'NT') ? '0' : selectElement.value;
          if(this.value === 'NT'){
            selectElement.value = 0
          }else if(this.value!= 'NT' && selectElement.value==0){
            selectElement.value=1
          }
        });
    });
  }
  // se ejecuta la funcion
  functionObtenerRadioButtons()
  
  //funcion para agregar personal al listado
  function agregarContenedorPersona(numUser) {
    alert("Se añadió un nuevo participante, completar sus datos correctamente");
    // Clona el contenedor-trabajador
    const contenedorTrabajador = document.querySelector(".contenedor-trabajador");
    const nuevoContenedor = contenedorTrabajador.cloneNode(true);
    nuevoContenedor.classList.add("clon");
    nuevoContenedor.classList.add(numUser)
  
    /* CLONAR ELEMENTOS DEL FORMATO ACTUALIZADO */
  
    // itera sobre los radio buttons que aparecerán dentro del nuevo contenedor de usuarios y cambia sus atributos "name"
    // ya que los radio buttons deben tener nombres específicos
    nuevoContenedor
      .querySelectorAll('input[type="radio"]')
      .forEach((radioButton) => {
        const originalName = radioButton.getAttribute("name");
        const newName = `${originalName}-${numUser}`;
        radioButton.setAttribute("name", newName);
      });
  
    document.querySelector(".section-todo-personal").appendChild(nuevoContenedor);
    /*se debe revisar la manera de hacer que cuando se realice la clonación 
    el resto de contenedores tengan también sus inputs en en NA
    de esta manera se evitará inconvenientes.
    */
  
    //aquí la variable que contiene a todo el personal se reescribe cada vez que se añade un nuevo miembro 
    contenedoresTrabajadores = document.querySelectorAll(".contenedor-trabajador")
    //aqui se reescribe la la variable para obtener a todos lso radio buttons cada vez que se añade un nuevo personal
    radioButtons = document.querySelectorAll('input[type="radio"]')
    //console.log(radioButtons)
    //la funcion de asignación de eventos se vuelve a ejecutar cada vez que se añade a un nuevo personal
    functionObtenerRadioButtons()
    
  }
  
  //evento en el boton que se encargará de hacer scroll a cada article del personal
  let btnListaPersonal = document.getElementById("btnListaPersonal")
  let indiceActual = 0
  btnListaPersonal.addEventListener("click", function(){
    // Incrementa el índice actual y volver al primero si llegamos al máximo
    indiceActual = (indiceActual + 1) % contenedoresTrabajadores.length;
      
    // se el elemento correspondiente al índice actual
    const articuloActual = contenedoresTrabajadores[indiceActual];
    
    // scroll que dirigirá hasta el elemento actual
    articuloActual.scrollIntoView({ behavior: 'smooth' });
  })

  /*---- PARTE 2 DEL CÓDIGO ----*/
  /* cargar documento */
  //Constante que permitirá usar el objeto jspdf
  const jsPDF = window.jspdf.jsPDF;
  
  //creación de los tamaños para el texto en el documento
  //fontSizeTexo es importante definirla porque es el tamaño de fuente que aarecereá en el pdf
  const fontSizeTexto = 10;
  
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
  
  btnGenerar.addEventListener("click", async function generarPDF(e) {
    e.preventDefault();
    //doc, objeto}
    //dimensiones del documento pdf
    var doc = new jsPDF();
    //imagen del documento vacía
    const image = await loadImage("../recursos/formatoListaInspeccion.jpg");
    //colocar la imagen
    //colocar imagen desde una posicion en especifico, con las dimensiones especificas
    doc.addImage(image, "JPG", 0, 0, 210, 297, '', 'FAST');
  
    //funcion para obtener y evaluar datos de la empresa
    let evaluarEmpresa = () => {
      /*Seleccionar empresa start*/
      doc.setFontSize(4.6)
      let empresa = document.getElementById("empresa");
      /*Seleccionar empresa end*/
  
      /*EMPRESA SELECCIONADA */
      switch (empresa.value) {
        //La validación se da en el primer caso
        //si el valor del input es seleccionar se returna un valor falso
        //esto redirige el flujo al final del código
        case "- Seleccionar -":
          alert("Complete la sección de Empresa");
          return false;
        case "TECHING":
          doc.text("X", 29.8, 12.8);
          break;
        case "CONTRATISTA1":
          doc.text("X", 59.6, 13);
          doc.text(empresa.value, 71, 13);
          break;
        case "CONTRATISTA2":
          doc.text("X", 59.6, 13);
          doc.text(empresa.value, 71, 13);
          break;
      }
      return true;
    };
  
    //funcion para obtener y colocar datos de la parte superior e inferior con firma del responsable
    let evaluarDatosPrincipales = () => {
      doc.setFontSize(4.5)
      let trabajo = document.getElementById("trabajo").value;
      let lugar = document.getElementById("lugar").value;
      let fecha = document.getElementById("fecha").value;
      let hora = document.getElementById("hora").value;
      let responsableNombre = document.getElementById("responsable-nombre").value;
      let responsableFirma = document.getElementById("firma-responsable").value;
      let supervisorNombre = document.getElementById("supervisor-nombre").value;
      let supervisorFirma = document.getElementById("firma-supervisor").value;
  
      if (trabajo != "" && lugar != "" && responsableNombre != "Seleccionar" && supervisorNombre != "Seleccionar") {
        doc.text(trabajo, 49, 14.8);
        doc.text(lugar, 38.5, 16.8);
        doc.text(fecha, 38.2, 18.8);
        doc.text(hora, 53, 18.8);
        doc.text("Bernabe Oscco León", 152, 17.8);
  
        //tecnico responsable
        doc.text(responsableNombre, 94, 282.5 ,{align: "center"})
        doc.addImage(responsableFirma, "PNG", 82, 274.5, 22, 5.5);
  
        //supervisor
        doc.text(supervisorNombre, 173.5, 282.5, {align: "center"});
        doc.addImage(supervisorFirma, "PNG", 162, 274.6, 22, 5.5);
  
        return true;
      } else {
        alert("Complete todos los campos de la parte superior del formulario");
        return false;
      }
    };

    //colocar comentarios
    doc.setFontSize(4.2)
    let comentarios = document.getElementById("comentarios").value;
    doc.text(comentarios, 31.5, 270.8, {
      maxWidth: 156,
      lineHeightFactor: 1.4,
    });
  
    //INICIA COLOCAR CARGOS Y NOMBRES
    function evaluarNombreCargo() {
      let resEvalNombreCargo = true;
      let cargos = document.querySelectorAll(".trabajador-cargo");
      let nombres = document.querySelectorAll(".trabajador-nombre");
      let firmas = document.querySelectorAll(".trabajador-firma");
      let dnis = document.querySelectorAll(".trabajador-dni");
      doc.setFontSize(4);
  
      //colocar cargos
      let cargosX = 113;
      let contador = 0;
      cargos.forEach((cargo) => {
        if (cargo.value != "") {
          if (contador != 0) {
            doc.text(cargo.value, cargosX, 22.6, {
              align: "center",
            });
            cargosX += 29.5;
          } else {
            doc.text(cargo.value, 88.8, 22.6, {
              align: "center",
            });
            contador = 1;
          }
          return true;
        } else {
          alert("Complete todos los cargos del personal evaluado");
          resEvalNombreCargo = false;
          return;
        }
      });
  
      //colocar nombres
      let nombresX1 = 113;
      let contadorn = 0;
      nombres.forEach((nombre) => {
        if (nombre.value != "") {
          if (contadorn != 0) {
            doc.setFontSize(4)
            doc.text(nombre.value, nombresX1, 24.8, {
              align: "center",
              maxWidth: 20,
              lineHeightFactor: 1,
            });
            nombresX1 += 29.5;
          } else {
            doc.setFontSize(3.8)
            doc.text(nombre.value, 88.8, 24.8, {
              align: "center",
              maxWidth: 20,
              lineHeightFactor: 1,
            });
            contadorn = 1;
          }
        } else {
          alert("Complete todos los nombres del personal evaluado");
          resEvalNombreCargo = false;
          return;
        }
      });

      //colocarFirmas
      let firmasX = 75;
      firmas.forEach((firma) => {
        doc.addImage(firma.value, "PNG", firmasX, 263, 14, 3.8);
        firmasX += 30;
      });
  
      //colocarDNI
      let dnisX = 78;
      dnis.forEach((dni) => {
        doc.text(dni.value, dnisX, 268.5);
        dnisX += 30;
      });
  
      if (resEvalNombreCargo) {
        return true;
      } else {
        return false;
      }
    }
  
    //TERMINA COLOCAR CARGOS Y NOMBRES
  
    //CONTENEDORES DE LOS ELEMENTOS A EVALUAR
    //se obtiene todos los contenedores epp especiales
    let eppEspecial = document.querySelectorAll(".contenedor-EPP-ESPECIAL");
    //se obtienen todos los equipso especiales
    let equiposEspeciales = document.querySelectorAll(".contenedor-EQUIPO-ESPECIALES");
    //se obtiene todos los contenedor epp
    let epp = document.querySelectorAll(".contenedor-epp");
    //se obtiene todos los contenedores herramientas
    let herramientas = document.querySelectorAll(".contenedor-herramientas");
    //se obtiene todos los contenedores equipos
    let equipos = document.querySelectorAll(".contenedor-equipos");
    //se obtiene todos los contenedores señalizacion
    let senializacion = document.querySelectorAll(".contenedor-senializacion");
    //se obtiene todos los contenedores documentacion
    let documentacion = document.querySelectorAll(".contenedor-documentacion");
    //se obtienen todos los accesorios
    let accesorios = document.querySelectorAll(".contenedor-accesorios");
  
    /*revisión de los select de cantidad*/
    doc.setFontSize(4.4);
    //EPP
    //posicionamiento inicial
    positionSelectX = 73.4;
    positionSelectY = 30.8;
    let contadorElementos = 1
    let contadorColumnas = 1
    eppEspecial.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      selectsEvaluar = e.querySelectorAll("select");
      //se evalua a cada input
      selectsEvaluar.forEach((se) => {
        doc.text(se.value, positionSelectX, positionSelectY);
        positionSelectY += 2.2;
      
        contadorElementos+=1
      });
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
      if(contadorColumnas==1){
        positionSelectX += 30.5;
      }else if(contadorColumnas==2){
        positionSelectX += 28;
      }else{
        positionSelectX+=31;
      }
      contadorElementos=1
      contadorColumnas+=1
      positionSelectY = 30.8;
    });
  
    //EQUIPOS ESPECIALES
    //posicionamiento inicial
    positionSelectX = 73.4;
    positionSelectY = 49.4;
    let contadorEquiposEspeciales = 1
    let contadorColumnasEspeciales = 1
    equiposEspeciales.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      selectsEvaluar = e.querySelectorAll("select");
      //se evalua a cada input
      selectsEvaluar.forEach((se) => {
        doc.text(se.value, positionSelectX, positionSelectY);
        positionSelectY += 2.2;
      
        contadorEquiposEspeciales+=1
      });
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
      if(contadorColumnasEspeciales==1){
        positionSelectX += 30.5;
      }else if(contadorColumnasEspeciales==2){
        positionSelectX += 28;
      }else{
        positionSelectX+=31;
      }
      contadorEquiposEspeciales=1
      contadorColumnasEspeciales+=1
      positionSelectY = 49.4;
    });
  
    // epp
    positionSelectX = 73.4;
    positionSelectY = 64.4;
    let contadorEpp = 1
    let contadorColumnasEpp = 1
    epp.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      selectsEvaluar = e.querySelectorAll("select");
      //se evalua a cada input
      selectsEvaluar.forEach((se) => {
        doc.text(se.value, positionSelectX, positionSelectY);
        positionSelectY += 2.15;
        contadorEpp+=1
      });
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
      if(contadorColumnasEpp==1){
        positionSelectX += 30.5;
      }else if(contadorColumnasEpp==2){
        positionSelectX += 28;
      }else{
        positionSelectX+=31;
      }
      contadorEpp=1
      contadorColumnasEpp+=1
      positionSelectY = 64.4;
    });
  
    //HERRAMIENTAS
    //posicionamiento inicial
    let contadorHerramientas = 1
    contadorColumnas = 1
    positionSelectX = 73.4;
    positionSelectY = 120.44;
    herramientas.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      selectsEvaluar = e.querySelectorAll("select");
      //se evalua a cada input
      selectsEvaluar.forEach((se) => {
        doc.text(se.value, positionSelectX, positionSelectY);
        positionSelectY += 2.15;
        contadorHerramientas+=1
      });
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
  
      if(contadorColumnas==1){
        positionSelectX += 30.5;
      }else if(contadorColumnas==2){
        positionSelectX += 28;
      }else{
        positionSelectX+=31;
      }

      contadorHerramientas = 1
      contadorColumnas+=1
      positionSelectY = 120.44;
    });
  
    //EQUIPOS
    //posicionamiento inicial
    contadorColumnas = 1
    positionSelectX = 73.4;
    positionSelectY = 196;
    equipos.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      selectsEvaluar = e.querySelectorAll("select");
      //se evalua a cada input
      selectsEvaluar.forEach((se) => {
        doc.text(se.value, positionSelectX, positionSelectY);
        //la posicion y aumenta para completar el resto de elementos
        positionSelectY += 2.15;
      });
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
      if(contadorColumnas==1){
        positionSelectX += 30.5;
      }else if(contadorColumnas==2){
        positionSelectX += 28;
      }else{
        positionSelectX+=31;
      }
      contadorColumnas+=1
      positionSelectY = 196;
    });
  
    //SEÑALIZACION
    //posicionamiento inicial
    contadorColumnas = 1
    positionSelectX = 73.4;
    positionSelectY = 228.2;
    senializacion.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      selectsEvaluar = e.querySelectorAll("select");
      //se evalua a cada input
      selectsEvaluar.forEach((se) => {
        doc.text(se.value, positionSelectX, positionSelectY);
        positionSelectY += 2.15;
  
      });
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
  
      if(contadorColumnas==1){
        positionSelectX += 30.5;
      }else if(contadorColumnas==2){
        positionSelectX += 28;
      }else{
        positionSelectX+=31;
      }

      contadorColumnas+=1
      positionSelectY = 228.2;
    });
  
    //DOCUMENTACION
    //posicionamiento inicial
    contadorColumnas = 1
    positionSelectX = 73.4;
    positionSelectY = 243.6;
    documentacion.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      selectsEvaluar = e.querySelectorAll("select");
      //se evalua a cada input
      selectsEvaluar.forEach((se) => {
        //si el input ha sido marcado
        //if(se.checked){
        //se obtendrá su valor y se colocará en el documento
        doc.text(se.value, positionSelectX, positionSelectY);
        //la posicion y aumenta para completar el resto de elementos
        positionSelectY += 2.15;
        //}
      });
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
      if(contadorColumnas==1){
        positionSelectX += 30.5;
      }else if(contadorColumnas==2){
        positionSelectX += 28;
      }else{
        positionSelectX+=31;
      }
      contadorColumnas += 1
      positionSelectY = 243.6;
    });
  
    //Accesorios
    //posicionamiento inicial
    contadorColumnas = 1
    positionSelectX = 73.4;
    positionSelectY = 260.8;
    accesorios.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      selectsEvaluar = e.querySelectorAll("select");
      //se evalua a cada input
      selectsEvaluar.forEach((se) => {
        //si el input ha sido marcado
        //if(se.checked){
        //se obtendrá su valor y se colocará en el documento
        doc.text(se.value, positionSelectX, positionSelectY);
        //la posicion y aumenta para completar el resto de elementos
        positionSelectY += 2.15;
        //}
      });
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
      if(contadorColumnas==1){
        positionSelectX += 30.5;
      }else if(contadorColumnas==2){
        positionSelectX += 28;
      }else{
        positionSelectX+=31;
      }
      contadorColumnas += 1
      positionSelectY = 260.8;
    });
  
    /*revisión de los inputs*/
  
    //EPP especial
    //posicionamiento inicial
    positionX = 82.4;
    positionY = 30.8;
    contadorElementos = 1
    contadorColumnas = 1
  
    eppEspecial.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      inputsEvaluar = e.querySelectorAll("input[type='radio']");
      //se evalua a cada input
      inputsEvaluar.forEach((se) => {
        if(se.checked){
          doc.text(se.value, positionX, positionY, {align:'center'});
          positionY += 2.2;
          contadorElementos+=1;
        }
      });
      if(contadorColumnas==1){
        positionX += 30.5;
      }else if(contadorColumnas==2){
        positionX+=28;
      }else{
        positionX+=31;
      }
      contadorElementos=1
      contadorColumnas+=1
      positionY = 30.8;
    });
  
    //Equipos especiales
    //posicionamiento inicial
    positionX = 82.4;
    positionY = 49.4;
    contadorElementos = 1
    contadorColumnas = 1
  
    equiposEspeciales.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      inputsEvaluar = e.querySelectorAll("input[type='radio']");
      //se evalua a cada input
      inputsEvaluar.forEach((se) => {
        if(se.checked){
          doc.text(se.value, positionX, positionY, {align:'center'});
          positionY += 2.2;
          contadorElementos+=1
        }
      });
      if(contadorColumnas==1){
        positionX += 30.5;
      }else if(contadorColumnas==2){
        positionX+=28;
      }else{
        positionX+=31;
      }
      contadorElementos=1
      contadorColumnas+=1
      positionY = 49.4;
    });
  
    //epp
    //posicionamiento inicial
    positionX = 88.8;
    positionY = 64.4;
    contadorElementos = 1;
    contadorColumnas = 1;
  
    epp.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      inputsEvaluar = e.querySelectorAll("input[type='radio']");
      //se evalua a cada input
      inputsEvaluar.forEach((se) => {
        if(se.checked){
          doc.text(se.value, positionX, positionY, {align:'center'});
          positionY += 2.15
          contadorElementos+=1
        }
      });
      if(contadorColumnas==1){
        positionX += 30;
      }else if(contadorColumnas==2){
        positionX+=28.4;
      }else{
        positionX+=31.6;
      }
      contadorElementos=1
      contadorColumnas+=1
      positionY = 64.4;
    });
  
    //HERRAMIENTAS
    //posicionamiento inicial
    positionX = 88.8;
    positionY = 120.44;
    //contadorElementos = 1
    contadorColumnas = 1
    //recore todos los contenedores epp
    herramientas.forEach((e) => {
      inputsEvaluar = e.querySelectorAll("input[type='radio']");
      inputsEvaluar.forEach((ie) => {
        if(ie.checked){
          doc.text(ie.value, positionX, positionY, {align:'center'});
          positionY += 2.15;
          //contadorElementos+=1
        }
      });
      if(contadorColumnas==1){
        positionX += 30;
      }else if(contadorColumnas==2){
        positionX+=28.4;
      }else{
        positionX+=31.6;
      }
      //contadorElementos=1;
      contadorColumnas+=1;
      positionY = 120.44;
    });
  
    //EQUIPOS
    //posicionamiento inicial
    positionX = 88.8;
    positionY = 196;
    contadorColumnas = 1
    //recore todos los contenedores epp
    equipos.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      inputsEvaluar = e.querySelectorAll("input[type='radio']");
      //se evalua a cada input
      inputsEvaluar.forEach((ie) => {
        //si el input ha sido marcado
        if (ie.checked) {
          doc.text(ie.value, positionX, positionY, {align: "center"});
          positionY += 2.15;
        }
      });
  
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
      if(contadorColumnas==1){
        positionX += 30;
      }else if(contadorColumnas==2){
        positionX+=28.4;
      }else{
        positionX+=31.6;
      }
      contadorColumnas+=1;
      positionY = 196;
    });
  
    //SEÑALIZACION
    //posicionamiento inicial
    contadorColumnas = 1
    positionX = 88.8;
    positionY = 228.2;
    //recore todos los contenedores epp
    senializacion.forEach((e) => {
      inputsEvaluar = e.querySelectorAll("input[type='radio']");
      inputsEvaluar.forEach((ie) => {
        //si el input ha sido marcado
        if (ie.checked) {
          doc.text(ie.value, positionX, positionY, {align: "center"});
          positionY += 2.15;
        }
      });
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
      if(contadorColumnas==1){
        positionX += 30;
      }else if(contadorColumnas==2){
        positionX+=28.4;
      }else{
        positionX+=31.6;
      }
      contadorColumnas+=1
      positionY = 228.2;
    });
  
    //DOCUMENTACIÓN
    //posicionamiento inicial
    contadorColumnas = 1
    positionX = 88.8;
    positionY = 243.6;
    //recore todos los contenedores epp
    documentacion.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      inputsEvaluar = e.querySelectorAll("input[type='radio']");
      //se evalua a cada input
      inputsEvaluar.forEach((ie) => {
        //si el input ha sido marcado
        if (ie.checked) {
          //se obtendrá su valor y se colocará en el documento
          doc.text(ie.value, positionX, positionY, {align:"center"});
          //la posicion y aumenta para completar el resto de elementos
          positionY += 2.15;
        }
      });
      //al terminar con el primer contenedor se corre el sitio de impresion en 60
      //y vuelve el punto y a su lugar de inicio
      if(contadorColumnas==1){
        positionX += 30;
      }else if(contadorColumnas==2){
        positionX+=28.4;
      }else{
        positionX+=31.6;
      }
      contadorColumnas += 1
      positionY = 243.6;
    });
  
    //ACCESORIOS
    //posicionamiento inicial
    contadorColumnas = 1
    positionX = 88.8;
    positionY = 260.8;
    //recore todos los contenedores de accesorios
    accesorios.forEach((e) => {
      //se crea un array que contenga a todos los inputs
      //que se encontraban dentro de ese contenedor
      inputsEvaluar = e.querySelectorAll("input[type='radio']");
      //se evalua a cada input
      inputsEvaluar.forEach((ie) => {
        //si el input ha sido marcado
        if (ie.checked) {
          //se obtendrá su valor y se colocará en el documento
          doc.text(ie.value, positionX, positionY, {align: "center"});
          //la posicion y aumenta para completar el resto de elementos
          positionY += 2.15;
        }
        
      });
  
      if(contadorColumnas==1){
        positionX += 30;
      }else if(contadorColumnas==2){
        positionX+=28.4;
      }else{
        positionX+=31.6;
      }
      contadorColumnas += 1
      positionY = 260.8;
    });
  
    //CODIGOS
    //EQUIPOS DE PROTECCION PERSONAL ESPECIAL
    contadorColumnas = 1
    positionX = 93.6;
    positionY = 30.4;
    doc.setFontSize(3)
    eppEspecial.forEach((codv)=>{
      casillaCod = codv.querySelectorAll(".cod")
      casillaCod.forEach((ie)=>{
        doc.text(ie.value, positionX, positionY, {align:'center'})
        positionY+=2.15;
      }) 
      if(contadorColumnas==1){
        positionX += 28;
      }else if(contadorColumnas==2){
        positionX+=30.2;
      }else{
        positionX+=31.6;
      }
      contadorColumnas += 1;
      positionY = 30.4;
    })
  
    //EQUIPOS ESPECIALES
    contadorColumnas = 1
    positionX = 93.6;
    positionY = 48.8
    doc.setFontSize(3)
    equiposEspeciales.forEach((codv)=>{
      casillaCod = codv.querySelectorAll(".cod")
      casillaCod.forEach((ie)=>{
        doc.text(ie.value, positionX, positionY, {align:'center'})
        positionY+=2.15;
      }) 
      if(contadorColumnas==1){
        positionX += 28;
      }else if(contadorColumnas==2){
        positionX+=30.2;
      }else{
        positionX+=31.6;
      }
      contadorColumnas += 1;
      positionY = 48.8;
    })
  
      // FECHAS DE VENCIMIENTO
      //EQUIPOS DE PROTECCION PERSONAL ESPECIAL
      contadorColumnas = 1
      positionX = 93.6;
      positionY = 31.4;//1
      doc.setFontSize(3)
      eppEspecial.forEach((codv)=>{
        casillaCod = codv.querySelectorAll(".vencimiento")
        casillaCod.forEach((ie)=>{
          doc.text(ie.value, positionX, positionY, {align:'center'})
          positionY+=2.15;
        }) 
        if(contadorColumnas==1){
          positionX += 28;
        }else if(contadorColumnas==2){
          positionX+=30.2;
        }else{
          positionX+=31.6;
        }
        contadorColumnas += 1;
        positionY = 31.4;
      })
    
      //EQUIPOS ESPECIALES
      contadorColumnas = 1
      positionX = 93.6;
      positionY = 49.8;//+.7
      doc.setFontSize(3)
      equiposEspeciales.forEach((codv)=>{
        casillaCod = codv.querySelectorAll(".vencimiento")
        casillaCod.forEach((ie)=>{
          doc.text(ie.value, positionX, positionY, {align:'center'})
          positionY+=2.15;
        }) 
        if(contadorColumnas==1){
          positionX += 28;
        }else if(contadorColumnas==2){
          positionX+=30.2;
        }else{
          positionX+=31.6;
        }
        contadorColumnas += 1;
        positionY = 49.8;
      })
  
    if (evaluarEmpresa() && evaluarDatosPrincipales() && evaluarNombreCargo()) {
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
  
    //   dia = dia.replace(/\//g, "_")
    //   //console.log(dia)
    //   const nombreDocumento = `lista_inspeccion_${dia}.pdf` 
    //   doc.save(nombreDocumento)
    //   //endodear el resultado del pdf
    //   var file_data = btoa(doc.output())
    //   var form_data = new FormData()
  
    //   form_data.append("file", file_data)
    //   form_data.append("nombre", "LISTA_DE_INSPECCION")
    //   //alert(form_data)
    //   $.ajax({
    //       url: "../envios/enviar_alerta.php",
    //       dataType: "text",
    //       cache: false,
    //       contentType: false,
    //       processData: false,
    //       data: form_data,
    //       type:"post",
    //       success: function(php_script_response){
    //           alert("Archivo generado correctamente")
    //       }
    //   })
    // } else {
    //   alert("Complete los campos solicitados para generar el documento");
    }
    //final
  });