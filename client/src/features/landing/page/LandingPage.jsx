import AuthButtons from "../components/AuthButtons";
import HeroSlider from "../components/HeroSlider";

export default function LandingPage() {
    return (
        <div className="w-screen min-h-screen flex flex-col items-center py-15 bg-mybg noise">
            <HeroSlider>
                <AuthButtons />
            </HeroSlider>
        </div>
    );
}