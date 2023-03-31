import React, { useRef, useState, useEffect } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SearchBar from "react-native-elements/dist/searchbar/SearchBar-ios";
import MapView, { Marker, Polyline} from "react-native-maps";
import Voice from '@react-native-voice/voice';
export default function App() {
  
  const [Result, setResult] =useState('')
  const [error, seterror] =useState('')
  const [Recording, setRecording] =useState(false)
  
  Voice.onSpeechStart = ()=>setRecording(true);
  Voice.onSpeechEnd = () =>setRecording(false);
  Voice.onSpeechError =(err)=> seterror(err.error);
  Voice.onSpeechResults =(result)=> setResult(result.value[0]);

  const startRecording = async()=>{
    try{await Voice.start('en-us'); }
    catch(err){seterror(err)}
  }

  const stopRecording = async ()=>{
    try{await Voice.stop }
    catch(err){seterror(err)}
  }

  const mapRef = useRef(null);
  const [region, setRegion] = useState({
                     latitude: 51.5079145,
                     longitude: -0.0899163,
                     latitudeDelta: 0.01,
                     longitudeDelta: 0.01,
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

  return (
    <View style={styles.container}>

      {/*Render our MapView*/}
      <MapView
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 35.6762,
          longitude: 139.6503,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
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
        <Polyline coordinates={[region, newRegin]}/>
        
      </MapView>
      <Text style={{margin:30,fontSize: 30, color:'red'}} >
         {Result} </Text>
         <Text style={{margin:30,fontSize: 30, color:'red'}} >
         {error}</Text>
      <TouchableOpacity 
      onPress={Recording ? stopRecording : startRecording}>
        <Text style={{margin:0,fontSize: 30, 
                     color:'red', 
                     backgroundColor: "blue",
                     width:"100%"}} >
          {Recording ? "Stop Recording" : "Start Recording"}</Text>
       </TouchableOpacity>

      <Button title="Click here" onPress={() => Mylocation()}></Button>
       
          {/* <SearchBar placeholder="Type Here..."/> */}
            
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
    width: "100%", height: "3%",
    textAlign: 'center',
    margin: 'auto',
    padding: "2%",
     

  },
  Button: {

  }
});