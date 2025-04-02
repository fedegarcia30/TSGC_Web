// Script para gestionar el formulario y las llamadas API
document.addEventListener('DOMContentLoaded', function() {
  // Configuración
  const API_HOST = "https://pre-fedegarcia30.pythonanywhere.com/api";
  const PAYMENT_URL = "https://pay-es.thesecretgolfclub.es/";
  
  // Inicializar formularios
  initializeForm('form01');
  initializeForm('form03');
  
  // Función para inicializar un formulario específico
  function initializeForm(formId) {
    console.log(`Inicializando formulario ${formId}`);
    
    // Referencias a elementos del formulario
    const form = document.getElementById(formId);
    
    if (!form) {
      console.error(`Formulario con ID ${formId} no encontrado`);
      return;
    }
    
    const validarBtn = document.getElementById(`${formId}-validar`);
    const solicitarBtn = document.getElementById(`${formId}-solicitar`);
    const statusDiv = document.getElementById(`${formId}-status`);
    const validatedFields = document.getElementById(`${formId}-validated-fields`);
    
    if (!validarBtn || !solicitarBtn || !statusDiv || !validatedFields) {
      console.error(`No se encontraron todos los elementos necesarios del formulario ${formId}`);
      console.log({
        validarBtn: validarBtn ? 'Encontrado' : 'No encontrado',
        solicitarBtn: solicitarBtn ? 'Encontrado' : 'No encontrado',
        statusDiv: statusDiv ? 'Encontrado' : 'No encontrado',
        validatedFields: validatedFields ? 'Encontrado' : 'No encontrado'
      });
      return;
    }
    
    // Crear barra de progreso
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.style.display = 'none';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    progressText.textContent = 'Procesando...';
    
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(progressText);
    
    // Insertar después del div de estado
    statusDiv.parentNode.insertBefore(progressContainer, statusDiv.nextSibling);
    
    console.log(`Todos los elementos del formulario ${formId} encontrados correctamente`);
    
    // Función para actualizar la barra de progreso
    function updateProgress(percent, message) {
      progressBar.style.width = `${percent}%`;
      progressText.textContent = message;
      progressContainer.style.display = 'block';
    }
    
    // Función para validar los datos con la API
    validarBtn.addEventListener('click', async function() {
      const licencia = document.getElementById(`${formId}-licencia`).value.trim();
      const email = document.getElementById(`${formId}-email`).value.trim();
      const movil = document.getElementById(`${formId}-movil`).value.trim();
      const club = document.getElementById(`${formId}-club`).value;
      const socio = document.getElementById(`${formId}-socio`).value.trim();
      
      // Validar que todos los campos estén completos
      if (!licencia || !email || !movil || !club || !socio) {
        showStatus(statusDiv, "Por favor, completa todos los campos antes de validar.", "error");
        return;
      }
      
      // Validar email
      if (!isValidEmail(email)) {
        showStatus(statusDiv, "Por favor, introduce un email válido.", "error");
        return;
      }
      
      try {
        showStatus(statusDiv, "Validando licencia...", "info");
        
        // Llamar a la API para obtener el handicap y nombre
        const response = await fetch(`${API_HOST}/handicap?licencia=${encodeURIComponent(licencia)}`);
        
        if (!response.ok) {
          throw new Error(`Error al validar licencia: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.handicap && data.name) {
          // Mostrar los campos validados
          document.getElementById(`${formId}-nombre`).value = data.name;
          document.getElementById(`${formId}-handicap`).value = data.handicap;
          validatedFields.style.display = "block";
          
          showStatus(statusDiv, "Licencia validada correctamente. Ahora puedes solicitar acceso.", "success");
          
          // Log para depuración
          console.log("Datos obtenidos de la API handicap:");
          console.log(data);
        } else {
          throw new Error("No se pudo obtener la información de handicap");
        }
      } catch (error) {
        console.error(error);
        showStatus(statusDiv, "No se pudo validar la licencia. Por favor, verifica el número e inténtalo de nuevo.", "error");
      }
    });
    
    // Función para solicitar acceso
    solicitarBtn.addEventListener('click', async function() {
      const email = document.getElementById(`${formId}-email`).value.trim();
      const licencia = document.getElementById(`${formId}-licencia`).value.trim();
      const nombre = document.getElementById(`${formId}-nombre`).value.trim();
      const handicap = document.getElementById(`${formId}-handicap`).value.trim();
      const club = document.getElementById(`${formId}-club`).value;
      const movil = document.getElementById(`${formId}-movil`).value.trim();
      const socio = document.getElementById(`${formId}-socio`).value.trim();
      
      try {
        showStatus(statusDiv, "Procesando tu solicitud...", "info");
        updateProgress(10, "Iniciando proceso de registro...");
        
        // Primera llamada: Crear usuario con handicap
        updateProgress(25, "Creando usuario...");
        console.log("Llamando a NuevoUsuarioHandicap con:", { licencia, nombre, email });
        
        const nuevoUsuarioUrl = `${API_HOST}/NuevoUsuarioHandicap?licencia=${encodeURIComponent(licencia)}&nombre=${encodeURIComponent(nombre)}&email=${encodeURIComponent(email)}`;
        console.log("URL NuevoUsuarioHandicap:", nuevoUsuarioUrl);
        
        const response1 = await fetch(nuevoUsuarioUrl);
        
        if (!response1.ok) {
          const errorText = await response1.text();
          console.error("Error respuesta NuevoUsuarioHandicap:", errorText);
          throw new Error(`Error al crear usuario: ${response1.status}`);
        }
        
        const result1 = await response1.json();
        console.log("Respuesta NuevoUsuarioHandicap:", result1);
        
        await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos entre llamadas
        
        // Segunda llamada: Crear configuración del jugador
        updateProgress(50, "Configurando perfil de jugador...");
        
        // Asegurando que handicap sea un valor adecuado
        let hcpValue = handicap;
        if (typeof hcpValue === 'string') {
          hcpValue = hcpValue.replace(',', '.'); // Convertir coma a punto decimal
        }
        
        console.log("Llamando a creaJugadorConfiguracion con:", { 
          email, 
          liga: club, 
          nombre, 
          licencia, 
          hcp: hcpValue, 
          telefono: movil, 
          socio 
        });
        
        const configUrl = `${API_HOST}/creaJugadorConfiguracion?email=${encodeURIComponent(email)}&nombre=${encodeURIComponent(nombre)}&liga=${encodeURIComponent(club)}&licencia=${encodeURIComponent(licencia)}&hcp=${encodeURIComponent(hcpValue)}&telefono=${encodeURIComponent(movil)}&socio=${encodeURIComponent(socio)}`;
        console.log("URL creaJugadorConfiguracion:", configUrl);
        
        const response2 = await fetch(configUrl);
        
        if (!response2.ok) {
          const errorText = await response2.text();
          console.error("Error respuesta creaJugadorConfiguracion:", errorText);
          throw new Error(`Error al configurar jugador: ${response2.status}`);
        }
        
        const result2 = await response2.json();
        console.log("Respuesta creaJugadorConfiguracion:", result2);
        
        await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar 3 segundos entre llamadas
        
        // Tercera llamada: Añadir jugador a la liga
        updateProgress(75, "Añadiendo a la liga...");
        
        console.log("Llamando a creaJugadorEnLiga con:", { email, nombre, liga: club, hcp: hcpValue });
        
        const ligaUrl = `${API_HOST}/creaJugadorEnLiga?email=${encodeURIComponent(email)}&nombre=${encodeURIComponent(nombre)}&liga=${encodeURIComponent(club)}&hcp=${encodeURIComponent(hcpValue)}`;
        console.log("URL creaJugadorEnLiga:", ligaUrl);
        
        const response3 = await fetch(ligaUrl);
        
        if (!response3.ok) {
          const errorText = await response3.text();
          console.error("Error respuesta creaJugadorEnLiga:", errorText);
          throw new Error(`Error al añadir jugador a la liga: ${response3.status}`);
        }
        
        const result3 = await response3.json();
        console.log("Respuesta creaJugadorEnLiga:", result3);
        
        // Si todo va bien, actualizar progreso y redireccionar
        updateProgress(100, "¡Registro completado con éxito!");
        showStatus(statusDiv, "¡Solicitud enviada con éxito! Redirigiendo a la página de pago...", "success");
        
        // Registrar evento de Analytics si está disponible
        if (typeof gtag === 'function') {
          gtag('event', 'registration_complete', {
            'event_category': 'registration',
            'event_label': club
          });
        }
        
        // Redireccionar a la página de pago
        setTimeout(() => {
          window.location.href = PAYMENT_URL;
        }, 2000);
        
      } catch (error) {
        console.error(error);
        updateProgress(0, "");
        progressContainer.style.display = 'none';
        showStatus(statusDiv, `Error al procesar la solicitud: ${error.message}`, "error");
      }
    });
  }
  
  // Función para mostrar mensajes de estado
  function showStatus(element, message, type) {
    element.textContent = message;
    element.style.display = "block";
    
    // Aplicar estilo según el tipo de mensaje
    element.className = "";
    element.classList.add(`status-${type}`);
    
    if (type === "error") {
      element.style.color = "#ff5555";
    } else if (type === "success") {
      element.style.color = "#BBE55A";
    } else {
      element.style.color = "#FFFFFF";
    }
  }
  
  // Función para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Arreglo para el evento GTM que causa error
  if (document.getElementById('embed01')) {
    const scriptContent = `
      // Eventos de Analytics
      document.addEventListener('DOMContentLoaded', function() {
        var form01SolicitarBtn = document.getElementById('form01-solicitar');
        var form03SolicitarBtn = document.getElementById('form03-solicitar');
        
        if (form01SolicitarBtn) {
          form01SolicitarBtn.addEventListener('click', function() {
            if (typeof gtag === 'function') {
              gtag('event', 'button_click', {
                'event_category': 'engagement',
                'event_label': 'sign_up'
              });
            }
          });
        }
        
        if (form03SolicitarBtn) {
          form03SolicitarBtn.addEventListener('click', function() {
            if (typeof gtag === 'function') {
              gtag('event', 'button_click', {
                'event_category': 'engagement',
                'event_label': 'sign_up'
              });
            }
          });
        }
      });
    `;
    
    // Reemplazar el contenido del embed01
    const embedDiv = document.getElementById('embed01');
    embedDiv.innerHTML = '';
    const newScript = document.createElement('script');
    newScript.textContent = scriptContent;
    embedDiv.appendChild(newScript);
  }
});