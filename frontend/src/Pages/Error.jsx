import NavigationBar from "../Navigation/NavigationBar";

export default function Error() {
    return (
        <>
            <NavigationBar />
            <div className="page-bg authpage-bg"></div>
            <h1 className="error-title">An error has occured!</h1>
        </>
    );
}