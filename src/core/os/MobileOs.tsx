import AppContainer from "../../layouts/AppContainer";
import WindowManager from "../windowManager/WindowManager";
import HomeScreen from "./components/HomeScreen";

const MobileOS = () => {
    return (
        <>
            <AppContainer>
                <WindowManager />
                <HomeScreen />
            </AppContainer>
        </>
    );
};

export default MobileOS;
