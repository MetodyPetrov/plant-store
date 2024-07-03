import bushes from "../utils/bushLove";

export default function AboutBushes() {
    return (
        <div>
            <div className="page-bg about-bushes-bg"></div>
            <div className="about-bushes">
                <h1>Bushes are life!</h1>
                <p>
                    {bushes}
                </p>
            </div>
        </div>
    );
}