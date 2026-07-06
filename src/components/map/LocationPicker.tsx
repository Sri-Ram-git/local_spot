import { useMapEvents, Marker, Popup } from 'react-leaflet';

interface Props {
  position: [number, number] | null;
  onLocationSelect: (pos: [number, number]) => void;
}

export default function LocationPicker({ position, onLocationSelect }: Props) {
  useMapEvents({
    click(e) {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });

  if (!position) return null;

  return (
    <Marker position={position} draggable
      eventHandlers={{
        dragend(e) {
          const m = e.target;
          onLocationSelect([m.getLatLng().lat, m.getLatLng().lng]);
        },
      }}
    >
      <Popup>Selected location</Popup>
    </Marker>
  );
}
