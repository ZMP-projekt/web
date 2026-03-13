import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { LandingPage } from './LandingPage.tsx';
import { Login } from './Login.tsx';
import { Dashboard } from './Dashboard.tsx';
import {Register} from './Register.tsx';
import { AuthProvider} from "../auth/AuthProvider.tsx";
import {ProtectedRoute} from "../components/ProtectedRoute.tsx";
import {Memberships} from "./Memberships.tsx";
import {DashboardLayout} from "../components/DashboardLayout.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<ProtectedRoute roles={['ROLE_USER']}><DashboardLayout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<Dashboard />}/>
                        <Route path="/memberships" element={<Memberships />}/>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;