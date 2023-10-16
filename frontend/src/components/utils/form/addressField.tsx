import { Autocomplete } from "@react-google-maps/api";
import { AddressField } from "../../../utils/fields";
import InputFormField, { TextInputFormFieldProps } from "./inputField";
import useGoogleMaps from "../../../utils/googleMaps/useGoogleMaps";
import { useEffect, useState } from "react";

interface AddressInputFormFieldProps<T> extends TextInputFormFieldProps<T> {
    field: AddressField<T>;
}

export default function AddressInputFormField<T>({
    field,
    object,
    onChange = undefined,
}: AddressInputFormFieldProps<T>) {
    const { getLocation } = useGoogleMaps();

    const [valid, setValid] = useState(true);

    useEffect(() => {
        const address = field.getter(object);
        if (address === undefined || address === "") {
            setValid(true);
        } else {
            getLocation(address).then((location) => {
                setValid(location !== undefined);
            });
        }
    }, [field.getter(object)]);

    return (
        <Autocomplete
            options={{
                types: ["geocode", "establishment"],
                fields: ["formatted_address"],
            }}
        >
            <InputFormField
                field={field}
                object={object}
                onChange={onChange}
                isInvalid={!valid}
                placeHolder="Search by city, country or ZIP code"
            />
        </Autocomplete>
    );
}
