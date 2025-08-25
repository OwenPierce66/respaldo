import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Marker = () => (
  <div>
    <FontAwesomeIcon className="map-marker" icon="map-marker" />
  </div>
);

export function MapContainer(props){
  const key = "AIzaSyDufY2oIMApXUL1nD7GOExLzRJQmU4WEE4";

  if (props.item) {
    return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: key }}
        center={{
          lat: props.item.latitude,
          lng: props.item.longitude,
        }}
        defaultZoom={14}
      >
        <Marker
          lat={props.item.latitude}
          lng={props.item.longitude}
        />
      </GoogleMapReact>
    );
  } else {
    return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: key }}
        defaultCenter={{ lat: 30.005542, lng: -107.558909 }}
        defaultZoom={14}
      ></GoogleMapReact>
    );
  }
}

