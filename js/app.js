// Seleccionamos los elementos del DOM
const galeria = document.getElementById("galeria");
const btnCargar = document.getElementById("cargar");

// Función asíncrona para consumir la API
async function cargarDatos() {
  galeria.innerHTML = "<p>Cargando equipos...</p>";

  try {
    const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League");
    
    if (!res.ok) throw new Error("Error en la conexión: " + res.status);

    const datos = await res.json();
    const equipos = datos.teams; 

    galeria.innerHTML = ""; 

    equipos.forEach(equipo => {
      if (!equipo || !equipo.strTeam) return; 

      // SOLUCIÓN BUG 1: Validamos ambas propiedades de imagen y damos un escudo por defecto si falla
      const escudo = equipo.strBadge || equipo.strTeamBadge || "https://cdn-icons-png.flaticon.com/512/870/870921.png";
      
      // SOLUCIÓN BUG 2: Limpiamos la URL que viene de la API y preparamos el enlace
      const urlSitio = equipo.strWebsite ? `https://${equipo.strWebsite.replace(/^https?:\/\//, '')}` : '#';

      const card = document.createElement("article");
      card.className = "tarjeta";

      // Agregamos el nuevo botón de enlace (etiqueta <a>) dentro de la tarjeta
      card.innerHTML = `
        <img src="${escudo}" alt="Escudo de ${equipo.strTeam}">
        <h3>${equipo.strTeam}</h3>
        <p><strong>Estadio:</strong> ${equipo.strStadium}</p>
        <p><strong>Fundación:</strong> ${equipo.intFormedYear}</p>
        ${equipo.strWebsite ? `<a href="${urlSitio}" target="_blank" class="btn-club">Visitar Sitio Web</a>` : '<p><em>Sin página web</em></p>'}
      `;
      
      galeria.appendChild(card);
    });

  } catch (error) {
    galeria.innerHTML = "<p>No se pudieron cargar los clubes. Intenta de nuevo más tarde.</p>";
    console.error(error);
  }
}

// Escuchamos el clic en el botón
btnCargar.addEventListener("click", cargarDatos);
