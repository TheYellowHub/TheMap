import { Col, Form, Row } from "react-bootstrap";

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
        <Form.Group as={Row}>
            <Col sm={9}>
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
            <Col sm={3} className="p-1">
                <a href="#" onClick={useCurrenetLocation}>
                    Use my location
                </a>
            </Col>
        </Form.Group>
    );
}
