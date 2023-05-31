import { Spinner } from "react-bootstrap";
import logoIcon from "../../assets/logo-black.png";


export function Splash() {
    return (
                <div className="mt-5 d-flex justify-content-center text-center">
                    <div>
                        <img src={logoIcon} className="rounded" alt="logo Icon"></img>
                        <h1><i><b>SoulHub</b></i></h1>
                        <h2>O seu espaço de tecnologia e desenvolvimento</h2>
                            <button type="button" className="btn btn-dark mw-11">
                                <Spinner variant="secondary"></Spinner>
                            </button>
                    </div>
                </div>
    );
}