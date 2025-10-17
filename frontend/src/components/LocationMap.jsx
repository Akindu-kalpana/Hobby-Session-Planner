import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import config from '../config/config';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function LocationMap({ location, title }) {
  
  
  const getCoordinates = (loc) => {
    if (!loc) return [65.0121, 25.4651]; // default: Oulu, Finland
    
   
    const coords = loc.split(',').map(c => parseFloat(c.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      return coords;
    }
    
    
    return [65.0121, 25.4651]; // Oulu, Finland
  };

  const position = getCoordinates(location);

  const mapStyle = {
    height: '300px',
    width: '100%',
    borderRadius: '8px',
    marginTop: '1rem'
  };

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      style={mapStyle}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={DefaultIcon}>
        <Popup>
          <strong>{title}</strong><br />
          {location}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default LocationMap;