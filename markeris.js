// uzstāda koardinātes un zoom līmeni kurā ielādēsies karte
const map = L.map('map').setView([56.95, 24.1], 8); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// definē dzelteno markeri
const dzeltenaisMarkeris = L.divIcon({
    className: 'dzeltenais-marker',
    html: `<div class="markeris dzeltens"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

// definē zilo markeri
const zilaisMarkeris = L.divIcon({
    className: 'zilais-marker',
    html: `<div class="markeris zils"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

// fetcho json failu un izveido markerus
fetch('geomap.json')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {         // sāk foreach ciklu kas novietos markerus uz kartes
            const { coordinates } = feature.geometry;
            const { PLACENAME } = feature.properties;

            // konvertē koordinātes 
            const [lat, lon] = LKS92WGS84.convertXYToLatLon([coordinates[0], coordinates[1]]);

            // nosaka vai vieta ir atpūtas vieta un izvēlas markeri
            const markerIcon = /atpūtas/i.test(PLACENAME) ?dzeltenaisMarkeris : zilaisMarkeris;   // ja PLACENAME ir iekļauts vārds 'atpūtas', tad izvēlas dzelteno markeri, citādi zilo

            // novieto merkeri uz kartes un pievieno popup
            L.marker([lat, lon], { icon: markerIcon }).addTo(map)
                .bindPopup(`<strong>${PLACENAME}</strong>`);
        });
    })
    .catch(error => console.error('Error loading map data:', error));