// Seleccionamos los elementos del DOM que vamos a usar
const galeria = document.getElementById("galeria");
const btnCargar = document.getElementById("cargar");

// Función asíncrona para consumir la API
async function cargarDatos() {
  // Estado de carga para que el usuario sepa que algo está pasando
  galeria.innerHTML = "<p>Cargando equipos...</p>";

  try {
    // Llamada a la API de TheSportsDB (Premier League)
    const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League");
    
    // Verificamos si la respuesta es correcta
    if (!res.ok) throw new Error("Error en la conexión: " + res.status);

    // Convertimos la respuesta a formato JSON
    const datos = await res.json();
    const equipos = datos.teams; // La API devuelve un arreglo llamado 'teams'

    // Limpiamos el contenedor antes de inyectar las tarjetas
    galeria.innerHTML = ""; 

    // Recorremos los datos para crear una tarjeta por cada club
    equipos.forEach(equipo => {
      // Validamos que los campos existan antes de renderizar para evitar errores
      if (!equipo || !equipo.strTeam) return; 

      // Creamos la etiqueta <article> para la tarjeta
      const card = document.createElement("article");
      card.className = "tarjeta";

      // Inyectamos el HTML interno con los datos precisos del club
      card.innerHTML = `
        <img src="${equipo.strTeamBadge}" alt="Escudo de ${equipo.strTeam}">
        <h3>${equipo.strTeam}</h3>
        <p><strong>Estadio:</strong> ${equipo.strStadium}</p>
        <p><strong>Fundación:</strong> ${equipo.intFormedYear}</p>
      `;
      
      // Agregamos la tarjeta a la galería
      galeria.appendChild(card);
    });

  } catch (error) {
    // Si la API falla, se muestra un mensaje de error al usuario
    galeria.innerHTML = "<p>No se pudieron cargar los clubes en la cancha. Intenta de nuevo más tarde.</p>";
    console.error(error);
  }
}

// Escuchamos el clic en el botón para ejecutar la función
btnCargar.addEventListener("click", cargarDatos);
