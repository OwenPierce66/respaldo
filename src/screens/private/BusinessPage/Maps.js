import React from "react";
import GoogleMapReact from "google-map-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Marker = () => (
  <div>
    <FontAwesomeIcon className="map-marker" icon="map-marker" />
  </div>
);

export function GoogleMaps(props) {
  const key = "AIzaSyDufY2oIMApXUL1nD7GOExLzRJQmU4WEE4";
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: key }}
      center={{
        lat: props.latitude,
        lng: props.longitude,
      }}
      defaultZoom={14}
    >
      <Marker lat={props.latitude} lng={props.longitude} />
    </GoogleMapReact>
  );
}
