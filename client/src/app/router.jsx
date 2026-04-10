import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/landing/page/LandingPage';

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
        </Routes>
    );
}