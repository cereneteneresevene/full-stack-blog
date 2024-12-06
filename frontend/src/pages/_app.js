import { Provider } from 'react-redux';
import store from '../../store/index'; 
import styles from '../styles/globals.css';
import { ThemeProvider } from "../context/ThemeContext";
import "react-quill/dist/quill.snow.css";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} />
        </ThemeProvider>
    </Provider>
  );
}
