import React, { useRef, useState, useEffect } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SearchBar from "react-native-elements/dist/searchbar/SearchBar-ios";

import MapView, { Marker, Polyline } from "react-native-maps";
import { decode } from "@mapbox/polyline";
import Voice from '@react-native-voice/voice';


export default function App() {

  const [Result, setResult] = useState('')
  const [error, seterror] = useState('')
  const [Recording, setRecording] = useState(false)

  Voice.onSpeechStart = () => setRecording(true);
  Voice.onSpeechEnd = () => setRecording(false);
  Voice.onSpeechError = (err) => seterror(err.error);
  Voice.onSpeechResults = (result) => setResult(result.value[0]);

  const startRecording = async () => {
    try { await Voice.start('en-us'); }
    catch (err) { seterror(err) }
  }

  const stopRecording = async () => {
    try { await Voice.stop }
    catch (err) { seterror(err) }
  }

  const mapRef = useRef(null);
  
  const [region, setRegion] = useState({
    latitude: 15.9071262,
    longitude: 74.5184459,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const newRegin = {
    latitude: 15.9071262,
    longitude: 74.5184459,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  const Mylocation = () => {
    mapRef.current.animateToRegion(newRegin, 3 * 1000);
  }

  const [coords, setCoords] = useState([]);

  useEffect(() => {
    //fetch the coordinates and then store its value into the coords Hook.
    getDirections()
      .then(coords => setCoords(coords))
      .catch(err => console.log("Something went wrong"));
  }, [Mylocation]);

  const getDirections = async () => {
    try {
      const KEY = "AIzaSyB5nKHsxH0NCqgewaLdiq4RtIQ34Zp9LE0"; //put your API key here.
      //otherwise, you'll have an 'unauthorized' error.
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${region}&destination=${newRegin}&key=${KEY}`
      );
      let respJson = await resp.json();
      let points = decode(respJson.routes[0].overview_polyline.points);
      console.log(points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        };
      });
      return coords;
    } catch (error) {
      return error;
    }
  };

  return (
    <View style={styles.container}>

      {/*Render our MapView*/}
      <MapView
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 15.9071262,
          longitude: 74.5184459,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={(region) => setRegion(region)}
        ref={mapRef}
      >
        <Marker coordinate={{
          latitude: 15.9071262,
          longitude: 74.5184459,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }} />
        <Marker coordinate={region} />
        {/* <Polyline coordinates={[region, newRegin]}/> */}

        <Polyline coordinates={coords} />
      </MapView>
      <Text style={{ fontSize: 30, padding: 10, display: "flex", backgroundColor: "gray", width: "100%" }} > Youer destination ..{Result} </Text>
      <Text style={{ margin: 380, fontSize: 30, color: 'red' }} >  {error}</Text>

      <TouchableOpacity
        Style={{}}
        onPress={Recording ? stopRecording : startRecording}>
        <Text style={{ margin: 30, fontSize: 30, color: 'red' }} >
          {Recording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      <Button block title="Live Location" onPress={() => Mylocation()}>  </Button>

      {/* <SearchBar placeholder="Type Here..."
      /> */}
      <Text style={styles.text}>Current latitude: {region.latitude}</Text>
      <Text style={styles.text}>Current longitude: {region.longitude}</Text>

    </View>
  );
}
//create our styling code:
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    display: "flex",
    backgroundColor: "white",
    width: "100%", height: "4%",
    textAlign: 'center',
    margin: 'auto',
    padding: "1%"
  },

});