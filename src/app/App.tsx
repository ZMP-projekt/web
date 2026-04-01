import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { LandingPage } from './LandingPage.tsx';
import { Login } from './Login.tsx';
import { Dashboard } from './Dashboard.tsx';
import {Register} from './Register.tsx';
import { AuthProvider} from "../auth/AuthProvider.tsx";
import {ProtectedRoute} from "../components/ProtectedRoute.tsx";
import {Memberships} from "./Memberships.tsx";
import {DashboardLayout} from "../components/DashboardLayout.tsx";
import { TrainerLayout } from "../components/TrainerLayout.tsx";
import { TrainerDashboard } from "./TrainerDashboard.tsx";
import {Profile} from "./Profile.tsx";
import {Schedule} from "./Schedule.tsx";
import {PublicSchedule} from "./PublicSchedule.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/public/schedule" element={<PublicSchedule />} />
                    <Route element={<ProtectedRoute roles={['ROLE_USER']}><DashboardLayout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<Dashboard />}/>
                        <Route path="/memberships" element={<Memberships />}/>
                        <Route path="/profile" element={<Profile />}/>
                        <Route path="/schedule" element={<Schedule />}/>
                    </Route>
                    <Route element={<ProtectedRoute roles={['ROLE_TRAINER']}><TrainerLayout /></ProtectedRoute>}>
                        <Route path="/trainer/dashboard" element={<TrainerDashboard />}/>
                        <Route path="/trainer/profile" element={<Profile />}/>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;