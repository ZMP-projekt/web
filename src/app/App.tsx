import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { LandingPage } from './LandingPage.tsx';
import { Login } from './Login.tsx';
import { Dashboard } from './Dashboard.tsx';
import {Register} from './Register.tsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;