import React, { useRef, useEffect, useState, MutableRefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
  Image,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';


const ShareableReactImage = () => {

  const viewRef: MutableRefObject<any> = React.useRef<any>(null);
  const [showInstagramStory, setShowInstagramStory] = useState(false);
  const [uri, setUri] = useState('');



  const shareDummyImage = async () => {
    try {
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 0.7,
        result: 'base64'
      });
     console.log(uri);
     setUri(uri)
   
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  console.log(blob, "blob");
  
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View>
      <View collapsable={false} style={{ padding: 20, alignItems: 'center' }} ref={viewRef}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            textAlign: 'center',
            paddingBottom: 20,
          }}>
          Don't be a dummy!
        </Text>
        <View style={styles.dummy}></View>
        <Text
          style={{
            fontSize: 26,
            fontWeight: '700',
            textAlign: 'center',
            paddingTop: 20,
          }}>
          LEARN REACT NATIVE
        </Text>
      </View>
      <TouchableOpacity style={{ marginTop: 30 }} onPress={shareDummyImage}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            textAlign: 'center',
            color: 'red',
          }}>
          {showInstagramStory ? 'Share Instagram Story' : 'Share'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShareableReactImage;


const styles = StyleSheet.create({
  dummy: {
    width: 0,
    height: 0,
    borderTopWidth: 120,
    borderTopColor: 'yellow',
    borderLeftColor: 'black',
    borderLeftWidth: 120,
    borderRightColor: 'black',
    borderRightWidth: 120,
    borderBottomColor: 'yellow',
    borderBottomWidth: 120,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderBottomRightRadius: 120,
    borderBottomLeftRadius: 120,
  },
});