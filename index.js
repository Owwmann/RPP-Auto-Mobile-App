import 'react-native-gesture-handler'; // This must be the very first line
import { registerRootComponent } from 'expo';

// Adjust this path if your App.js is in a different folder,
// but based on your screenshot './src/App' is correct.
import App from './src/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);