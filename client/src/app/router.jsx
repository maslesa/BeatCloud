import { Routes, Route } from "react-router-dom";
import LandingPage from "../features/landing/page/LandingPage";
import MainLayout from "../layouts/MainLayout";
import Home from "../features/home/page/Home";
import Profile from "../features/profile/page/Profile";
import UploadTrackPage from "../features/track/page/UploadTrackPage";

export default function Router() {
  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/upload" element={<UploadTrackPage />} />
        <Route path="/track/:trackID/update" element={<UploadTrackPage />} />
      </Route>

    </Routes>
  );
}