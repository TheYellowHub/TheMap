import { Col, Container, Form, Row } from "react-bootstrap";

import useGoogleMaps, { Location } from "../../../utils/googleMaps/useGoogleMaps";
import AddressInputFormField from "../../utils/form/addressField";

interface DoctorSearchAddressFilterProps {
    address: string | undefined;
    setAddress: (address: string) => void;
    addressLocation: Location | undefined;
    setAddressLocation: (addressLocation: Location | undefined) => void;
    useCurrenetLocation: () => void;
}

export default function DoctorSearchAddressFilter({
    address,
    setAddress,
    useCurrenetLocation,
    addressLocation,
    setAddressLocation,
}: DoctorSearchAddressFilterProps) {
    const { getLocation } = useGoogleMaps();
    return (
        <Container fluid className="p-0">
            <Form.Group as={Row}>
                <Col sm={12} className="p-0">
                    <AddressInputFormField<undefined>
                        field={{
                            type: "address",
                            label: "address",
                            getter: () => address,
                            setter: (_: undefined, newAddress: string) => {
                                setAddress(newAddress);
                                getLocation(newAddress).then((location) => setAddressLocation(location));
                                return undefined;
                            },
                        }}
                        object={undefined}
                    />
                </Col>
            </Form.Group>
            <Row>
                <Col sm={12} className="d-flex overlapPrevRow justify-content-end p-1">
                    <a href="#" onClick={useCurrenetLocation}>
                        Use my location
                    </a>
                </Col>
            </Row>
        </Container>
    );
}
