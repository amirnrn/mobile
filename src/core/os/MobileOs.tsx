import AppContainer from "../../layouts/AppContainer";
import WindowManager from "../windowManager/WindowManager";
import HomeScreen from "./components/HomeScreen";
import LockScreen from "./components/LockScreen";

const MobileOS = () => {
    return (
        <>
            <AppContainer>
                <WindowManager />
                <HomeScreen />
                <LockScreen />
            </AppContainer>
        </>
    );
};

export default MobileOS;
