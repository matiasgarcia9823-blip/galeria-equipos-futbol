// Seleccionamos los elementos del DOM
const galeria = document.getElementById("galeria");
const btnCargar = document.getElementById("cargar");
const selectLiga = document.getElementById("liga"); 
const inputBuscar = document.getElementById("buscar"); // Capturamos el buscador

// Función asíncrona para consumir la API
async function cargarDatos() {
  galeria.innerHTML = "<p>Cargando equipos...</p>";

  // Tomamos el valor exacto del menú y lo preparamos para la URL
  const ligaActiva = encodeURIComponent(selectLiga.value);

  try {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${ligaActiva}`);
    
    if (!res.ok) throw new Error("Error en la conexión: " + res.status);

    const datos = await res.json();
    
    // Validación de seguridad por si la API no encuentra datos en alguna liga
    if (!datos.teams) {
         galeria.innerHTML = "<p>No se encontraron equipos para esta liga.</p>";
         return;
    }

    const equipos = datos.teams; 
    galeria.innerHTML = ""; 

    equipos.forEach(equipo => {
      if (!equipo || !equipo.strTeam) return; 

      const escudo = equipo.strBadge || equipo.strTeamBadge || "https://cdn-icons-png.flaticon.com/512/870/870921.png";
      const urlSitio = equipo.strWebsite ? `https://${equipo.strWebsite.replace(/^https?:\/\//, '')}` : '#';

      const card = document.createElement("article");
      card.className = "tarjeta";

      card.innerHTML = `
        <img src="${escudo}" alt="Escudo de ${equipo.strTeam}">
        <h3>${equipo.strTeam}</h3>
        <p><strong>Estadio:</strong> ${equipo.strStadium}</p>
        <p><strong>Fundación:</strong> ${equipo.intFormedYear}</p>
        ${equipo.strWebsite ? `<a href="${urlSitio}" target="_blank" class="btn-club">Visitar Sitio Web</a>` : '<p><em>Sin página web</em></p>'}
      `;
      
      galeria.appendChild(card);

      // MEJORA: Hacemos que toda la tarjeta sea seleccionable (clickable)
      card.addEventListener("click", (e) => {
        // Evitamos abrir dos pestañas si el usuario hace clic exactamente en el enlace <a>
        if (e.target.tagName.toLowerCase() === 'a') return;

        if (equipo.strWebsite) {
          window.open(urlSitio, "_blank");
        } else {
          alert("Este equipo no tiene sitio web oficial registrado en la base de datos.");
        }
      });
    });

  } catch (error) {
    galeria.innerHTML = "<p>No se pudieron cargar los clubes. Intenta de nuevo más tarde.</p>";
    console.error(error);
  }
}

// Escuchamos los eventos de carga y cambios de liga
btnCargar.addEventListener("click", cargarDatos);
selectLiga.addEventListener("change", cargarDatos);

// RETO BONUS: Lógica para el Buscador en Vivo
inputBuscar.addEventListener("input", (e) => {
  // Capturamos lo que el usuario escribe y lo pasamos a minúsculas
  const textoBusqueda = e.target.value.toLowerCase();
  
  // Seleccionamos todas las tarjetas que están actualmente renderizadas en pantalla
  const tarjetas = document.querySelectorAll(".tarjeta");

  // Recorremos cada tarjeta para ver si el nombre coincide con la búsqueda
  tarjetas.forEach(tarjeta => {
    const nombreEquipo = tarjeta.querySelector("h3").textContent.toLowerCase();
    
    // Mostramos la tarjeta si hay coincidencia, la ocultamos si no
    if (nombreEquipo.includes(textoBusqueda)) {
      tarjeta.style.display = "block";
    } else {
      tarjeta.style.display = "none";
    }
  });
});
