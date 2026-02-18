import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';

export default function DiagnosticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Diagnostics</Text>
     
      {/* THIS IS THE CAR ASSET FROM YOUR SCREENSHOTS */}
      <View style={styles.imageContainer}>
         <Image
           source={require('../../assets/images/splash.png')}
           style={styles.carImage}
           resizeMode="contain"
         />
      </View>

      <Text style={styles.status}>Status: SYSTEM ONLINE</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>SCAN VEHICLE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Dark Mode Background
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#39FF14', // Neon Green
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: '90%',
    height: '100%',
  },
  status: {
    color: '#39FF14',
    marginTop: 20,
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#39FF14',
    paddingHorizontal: 40,
    paddingVertical: 15,
    marginTop: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
