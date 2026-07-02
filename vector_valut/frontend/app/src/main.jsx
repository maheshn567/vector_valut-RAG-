import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Agentation } from 'agentation';
import { AuthContextProvider } from './context/AuthContextProvider.jsx';

createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
        <BrowserRouter>
            <App />
            <Agentation />
        </BrowserRouter>
    </AuthContextProvider>
)
