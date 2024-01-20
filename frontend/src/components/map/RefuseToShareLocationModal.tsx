import { Col, Modal, Row } from "react-bootstrap";

import Button from "../utils/Button";
import UserModal from "../utils/UserModal";

interface RefuseToShareLocationModalProps {
    show: boolean;
    onHide: () => void;
}

function RefuseToShareLocationModal({ show, onHide }: RefuseToShareLocationModalProps) {
    return (
        <UserModal show={show} onHide={onHide}>
            <Modal.Body>
                <Row className="justify-content-center">
                    <div className="w-fit-content">
                        <p className="text-center text-left-mobile">
                            <strong>Allowing location access</strong>
                            <br/><br/>
                            You&apos;ve previously denied access.
                        </p>
                        <img src="/images/browser/siteSettingsMobile.png" className="only-mobile" />
                        <img src="/images/browser/siteSettingsDesktop.png" className="only-tablets-and-desktop" />
                        <br/><br/>
                        Undo this by going to:
                        <ul>
                            <li><strong>Settings menu</strong> left to the url</li>
                            <li>Select <strong>&quot;Permissions&quot;</strong>
                            <br/>and <strong>toggle location access</strong> on</li>
                            <li>Then <strong>refresh</strong> this page</li>
                        </ul>
                    </div>
                </Row>
                <Row className="justify-content-end">
                    <Col className="m-0 p-0 d-flex flex-grow-0 justify-content-center">
                        <Button
                            variant="primary"
                            label="Close"
                            type="button"
                            onClick={onHide}
                            className="w-max-content"
                        />
                    </Col>
                </Row>
            </Modal.Body>
        </UserModal>
    );
}

export default RefuseToShareLocationModal;
