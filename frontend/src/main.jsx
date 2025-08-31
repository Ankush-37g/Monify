
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "927803505011-49g4hm2h167tr318up70qmbh06qif4m0.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(

   <GoogleOAuthProvider clientId={clientId}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
)
