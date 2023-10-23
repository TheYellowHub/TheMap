import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import ReactSelect, { components } from "react-select";
import Icon from "./Icon";
import { Col } from "react-bootstrap";

interface SingleSelectProps {
    values: string[];
    currentValue: string | undefined;
    isMulti?: false;
    allowEmptySelection?: boolean;
    placeHolder?: string;
    title?: string;
    onChange?: (newValue: string | undefined) => void;
    icon?: string;
}

interface MultiSelectProps {
    values: string[];
    currentValue: string[];
    isMulti?: true;
    allowEmptySelection?: boolean;
    placeHolder?: string;
    title?: string;
    onChange?: (newValue: string[]) => void;
    icon?: string;
}

type SelectOption = { value: string; label: string };

export default function Select({
    values,
    currentValue,
    isMulti = false,
    allowEmptySelection = false,
    placeHolder = "",
    title = "",
    onChange = undefined,
    icon = undefined,
}: SingleSelectProps | MultiSelectProps) {
    const [dropdownOpen, setDropdownOpen] = icon === undefined ? [undefined, undefined] : useState(false);
    const valueToSelectOption = (value: string) => ({ value: value, label: value }) as SelectOption;

    const options: Readonly<SelectOption[]> = values.map((value: string) => ({
        value: value,
        label: value,
    }));

    const value =
        currentValue === undefined
            ? undefined
            : Array.isArray(currentValue)
            ? currentValue.map(valueToSelectOption)
            : valueToSelectOption(currentValue as string);

    const multiValueContainer = (props: any) => {
        const length = props.getValue().length;

        return (
            <components.ValueContainer {...props}>
                {length > 0 ? (
                    <>
                        <Col>{title}</Col>
                        <Col className="multi-select-counter">{length}</Col>
                    </>
                ) : (
                    <>{props.children}</>
                )}
            </components.ValueContainer>
        );
    };

    const iconComponent = setDropdownOpen && icon && (
        <Icon icon={icon} onClick={() => setDropdownOpen(!dropdownOpen)} />
    );

    const selectComponent = isMulti ? (
        <ReactSelect
            options={options}
            value={value}
            placeholder={placeHolder}
            menuIsOpen={dropdownOpen}
            classNamePrefix="react-select"
            className="multi-select"
            onChange={(newValues) => onChange && onChange(newValues.map((newValue) => newValue!.value) as any)}
            isClearable={allowEmptySelection}
            isMulti={true}
            hideSelectedOptions={false}
            components={{ ValueContainer: multiValueContainer }}
        />
    ) : (
        <ReactSelect
            options={options}
            value={value}
            placeholder={placeHolder}
            menuIsOpen={dropdownOpen}
            classNamePrefix="react-select"
            className="single-select"
            onChange={(newValue) => onChange && onChange(newValue === null ? undefined : (newValue!.value as any))}
            isClearable={allowEmptySelection}
        />
    );

    return setDropdownOpen === undefined ? (
        <>{selectComponent}</>
    ) : (
        <OutsideClickHandler onOutsideClick={() => setDropdownOpen(false)}>
            {iconComponent}
            {selectComponent}
        </OutsideClickHandler>
    );
}
