import { Col, Container, Form, Row } from "react-bootstrap";

import useGoogleMaps, { Location } from "../../../utils/googleMaps/useGoogleMaps";
import AddressInputFormField from "../../utils/form/addressField";

interface DoctorSearchAddressFilterProps {
    address: string | undefined;
    setAddress: (address: string) => void;
    addressLocation: Location | undefined;
    setAddressLocation: (addressLocation: Location | undefined) => void;
    useCurrenetLocation: () => void;
    setValueChange?: (valueChange: boolean) => void;
}

export default function DoctorSearchAddressFilter({
    address,
    setAddress,
    useCurrenetLocation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addressLocation,
    setAddressLocation,
    setValueChange,
}: DoctorSearchAddressFilterProps) {
    const { getLocation } = useGoogleMaps();
    return (
        <Container className="px-0" fluid>
            <Form.Group as={Row}>
                <Col className="px-0 mx-0">
                    <AddressInputFormField<undefined>
                        field={{
                            type: "address",
                            label: "address",
                            getter: () => address,
                            setter: (_: undefined, newAddress: string) => {
                                setAddress(newAddress);
                                getLocation(newAddress).then((location) => setAddressLocation(location));
                                setValueChange !== undefined && setValueChange(true);
                                return undefined;
                            },
                        }}
                        object={undefined}
                    />
                </Col>
                <Col className="d-flex use-my-location unselectable">
                    <a onClick={useCurrenetLocation} className="sm-font">
                        Use my location
                    </a>
                </Col>
            </Form.Group>
        </Container>
    );
}
