import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { LandingPage } from './LandingPage.tsx';
import { Login } from './Login.tsx';
import { Dashboard } from './Dashboard.tsx';
import {Register} from './Register.tsx';
import { AuthProvider} from "../auth/AuthProvider.tsx";
import {ProtectedRoute} from "../components/ProtectedRoute.tsx";
import {Memberships} from "./Memberships.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }/>
                    <Route path="/memberships" element={<ProtectedRoute><Memberships /></ProtectedRoute>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;