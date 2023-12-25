import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import ReactSelect, { components } from "react-select";
import Icon from "./Icon";
import { Col, Row } from "react-bootstrap";

export type SelectOption = { value: string; label: string };

interface SingleSelectProps {
    id?: string;
    values: Readonly<string[]> | Readonly<SelectOption[]>;
    currentValue: string | undefined;
    isMulti?: false;
    allowEmptySelection?: boolean;
    placeHolder?: string;
    title?: string;
    onChange?: (newValue: string | undefined) => void;
    icon?: string;
    disabled?: boolean;
    className?: string;
}

interface MultiSelectProps {
    id?: string;
    values: Readonly<string[]> | Readonly<SelectOption[]>;
    currentValue: string[];
    isMulti?: true;
    allowEmptySelection?: boolean;
    placeHolder?: string;
    title?: string;
    onChange?: (newValue: string[]) => void;
    icon?: string;
    disabled?: boolean;
    className?: string;
}

export default function Select({
    id,
    values,
    currentValue,
    isMulti = false,
    allowEmptySelection = false,
    placeHolder = "",
    title = "",
    onChange = undefined,
    icon = undefined,
    disabled = false,
    className = "",
}: SingleSelectProps | MultiSelectProps) {
    const [dropdownOpen, setDropdownOpen] = icon === undefined ? [undefined, undefined] : useState(false);
    const valueToSelectOption = (value: string) => ({ value: value, label: value }) as SelectOption;

    const options: Readonly<SelectOption[]> = (
        0 < values.length && typeof values[0] === "string"
            ? values.map((value) => ({
                  value: value,
                  label: value,
              }))
            : values
    ) as Readonly<SelectOption[]>;

    const value =
        currentValue === undefined
            ? null
            : Array.isArray(currentValue)
            ? currentValue.map(valueToSelectOption)
            : valueToSelectOption(currentValue as string);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const multiValueContainer = (props: any) => {
        const length = props.getValue().length;

        return (
            <components.ValueContainer {...props}>
                {length > 0 ? (
                    <Row className="flex-nowrap">
                        <Col>{title}</Col>
                        <Col className="multi-select-counter">{length}</Col>
                    </Row>
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
            id={id}
            options={options}
            value={value}
            placeholder={placeHolder}
            menuIsOpen={dropdownOpen}
            classNamePrefix="react-select"
            className={`multi-select ${className}`}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(newValues) => onChange && onChange(newValues.map((newValue) => newValue!.value) as any)}
            isClearable={allowEmptySelection}
            isDisabled={disabled}
            isMulti={true}
            hideSelectedOptions={false}
            components={{ ValueContainer: multiValueContainer }}
            menuPosition={iconComponent ? "absolute" : "fixed"}
        />
    ) : (
        <ReactSelect
            id={id}
            options={options}
            value={value}
            placeholder={placeHolder}
            menuIsOpen={dropdownOpen}
            classNamePrefix="react-select"
            className={`single-select ${className}`}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(newValue) => onChange && onChange(newValue === null ? undefined : (newValue!.value as any))}
            isClearable={allowEmptySelection}
            isDisabled={disabled}
            menuPosition={ "fixed"}
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
