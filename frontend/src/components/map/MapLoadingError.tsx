import { useContext } from "react";
import { Modal as ReactModal } from "react-bootstrap";

import Message from "../utils/Message";
import { GoogleMapsLoaderContext } from "../../utils/googleMaps/GoogleMapsLoader";

export default function MapLoadingError() {
    const googleMapsIsLoaded = useContext(GoogleMapsLoaderContext);
    return (
        <ReactModal
            className="transparent d-flex justify-content-center"
            show={!googleMapsIsLoaded}
            backdrop="static"
            centered
        >
            <Message variant="danger" className="alert-padding">
                <div className="bold">
                    The map couldn’t load
                    <br />
                    <a onClick={() => window.location.reload()} className="inheritTextStyle">
                        Reload to try again
                    </a>
                </div>
            </Message>
        </ReactModal>
    );
}
