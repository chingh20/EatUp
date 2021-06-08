import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {View} from 'react-native';

const GooglePlacesInput = () => {

  return (
    <GooglePlacesAutocomplete
      placeholder='Location'
      minLength={2}
      autoFocus={false}
      returnKeyType={'default'}
      FetchDetails={true}
      disableScroll = {false}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyCuBd4aOGbI64hGvZmvoIRU6YRBkmNjuIw',
        language: 'en',
        components: 'country:asia-southeast1',

      }}
      styles={{
          textInputContainer: {
            backgroundColor: '#fffbf1',
            borderWidth: 1,
            borderColor: '#3e1f0d',
            width: 350,
            height: 40,
            marginBottom: 15
          },
          textInput: {
          backgroundColor: '#fffbf1',
            color: '#3e1f0d',
            fontSize: 20,
            height: 35
          },
          predefinedPlacesDescription: {
            color: '#bc1824',
          },
        }}
    />

  );
};



export default GooglePlacesInput;