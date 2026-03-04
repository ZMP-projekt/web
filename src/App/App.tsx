import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { LandingPage } from './LandingPage.tsx';
import { Login } from './Login.tsx';
import { Dashboard } from './Dashboard.tsx';
import {Register} from './Register.tsx';

function App() {
    return (
        <Router>
            <Routes>
                {/* Definiujemy ścieżki i przypisujemy do nich komponenty */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Placeholder dla rejestracji - na razie kieruje do Landing Page */}
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;