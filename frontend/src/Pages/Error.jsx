import { useRouteError } from "react-router-dom";
import NavigationBar from "../Navigation/NavigationBar";

export default function Error() {
    const error = useRouteError();
    console.log(error.data);
    return (
        <>
            <NavigationBar />
            <div className="page-bg authpage-bg"></div>
            <div className="error-page">
                <h1>An error has occured!</h1>
                <p>{error.data || ""}</p>
            </div>
        </>
    );
}