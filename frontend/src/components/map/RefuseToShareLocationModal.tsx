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
                <Row>
                    <div>
                        <strong>Allowing location access</strong>
                        <br/><br/>
                        You&apos;ve previously denied access.
                        <br/><br/>
                        Undo this by going to:
                        <ul>
                            <li><strong>Browser menu</strong> on the top right</li>
                            <li>Select <strong>&quot;settings&quot;</strong></li>
                            <li>Scroll down to <strong>&quot;site settings&quot;</strong></li>
                            <li>Then <strong>select &quot;location&quot;</strong> and search for <u><strong>app.theyellowhub.org</strong></u> in the <strong>&quot;denied&quot; list</strong>.</li>
                            <li>Select <strong>&quot;allow&quot;</strong>, and <strong>refresh</strong> this page</li>
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
