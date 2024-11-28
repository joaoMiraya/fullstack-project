import { useEffect } from "react";

interface MapsProps {
  origin?: {
    lat: number;
    lng: number;
  }[];
  destination?: {
    lat: number;
    lng: number;
  }[];
}

export const Maps = (props: MapsProps) => {
  useEffect(() => {
    if (
      !props.origin ||
      !props.origin[0] ||
      !props.origin[0].lat ||
      !props.origin[0].lng ||
      !props.destination ||
      !props.destination[0] ||
      !props.destination[0].lat ||
      !props.destination[0].lng
    ) {
      console.error("Coordenadas inválidas ou ausentes para origem ou destino.");
      return;
    }

    const origin = { lat: props.origin[0].lat, lng: props.origin[0].lng };
    const destination = { lat: props.destination[0].lat, lng: props.destination[0].lng };

    async function initMap(): Promise<void> {
      try {
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        const map = new Map(document.getElementById("map") as HTMLElement, {
          zoom: 8,
          center: origin,
          mapId: "teste"
        });

        const markerPositions = [origin, destination];

        markerPositions.forEach((pos) => {
          if (typeof pos.lat === "number" && typeof pos.lng === "number") {
            new AdvancedMarkerElement({
              map: map,
              position: pos,
            });
          } else {
            console.error(`Coordenadas inválidas para o marcador: ${pos}`);
          }
        });

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
        });

        const request: google.maps.DirectionsRequest = {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
          } else {
            console.error("Erro ao calcular a rota:", status);
          }
        });
      } catch (error) {
        console.error("Erro ao carregar o mapa:", error);
      }
    }

    initMap();
  }, [props.origin, props.destination, props]);

  return (
    <>
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </>
  );
};
