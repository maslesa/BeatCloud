import AuthButtons from "../components/AuthButtons";
import HeroSlider from "../components/HeroSlider";
import Home from '../../home/page/Home';

export default function LandingPage() {
    return (
        <div className="w-screen min-h-screen flex flex-col gap-5 justify-center items-center py-15 bg-mybg">
            <div className="flex justify-center items-center">
                <p className="text-mylight font-semibold text-xl ">BeatCloud</p>
                <img className="w-15" src="/icons/logo.png" alt="" />
            </div>
            <HeroSlider>
                <AuthButtons />
            </HeroSlider>
        </div>
    );
}