import { ImageFileOrUrl } from "../types/Image";
import { DateTime } from "../types/utils/dateTime";
import { Email } from "../types/utils/email";
import { Phone } from "../types/utils/phone";
import { Url } from "../types/utils/url";

export type ModalFieldType = string | number | undefined | boolean;

interface Field<T, F> {
    type: string;
    label: string;
    required?: boolean;
    getter: (t: T) => F;
}

export interface TextField<T> extends Field<T, string | undefined> {
    type: "text";
    setter?: (t: T, newValue: string) => T;
}

export interface AddressField<T> extends Field<T, string | undefined> {
    type: "address";
    setter?: (t: T, newValue: string) => T;
}

export interface UrlField<T> extends Field<T, Url | undefined> {
    type: "url";
    setter?: (t: T, newValue: Url) => T;
}

export interface PhoneField<T> extends Field<T, Phone | undefined> {
    type: "tel";
    setter?: (t: T, newValue: Phone) => T;
}

export interface EmailField<T> extends Field<T, Email | undefined> {
    type: "email";
    setter?: (t: T, newValue: Email) => T;
}

export interface NumberField<T> extends Field<T, number | undefined> {
    type: "number";
    setter?: (t: T, newValue: number) => T;
}

export interface DateTimeField<T> extends Field<T, DateTime | undefined> {
    type: "datetime";
    setter?: (t: T, newValue: DateTime) => T;
}

export interface BooleanField<T> extends Field<T, boolean | undefined> {
    type: "boolean";
    setter?: (t: T, newValue: boolean) => T;
}

export interface SelectOption {
    key: string;
    value: string;
}

export interface ComboboxField<T> extends Field<T, string | undefined> {
    type: "combobox";
    options: SelectOption[];
    setter?: (t: T, newValue: string | undefined) => T;
}

export interface MultiSelectField<T> extends Field<T, string[]> {
    type: "multiSelect";
    options: ReadonlyArray<SelectOption>;
    setter?: (t: T, newValue: string[]) => T;
}

export interface ImageField<T> extends Field<T, ImageFileOrUrl | undefined> {
    type: "image";
    setter?: (t: T, newValue: ImageFileOrUrl) => T;
}

export type ModalField<T> =
    | TextField<T>
    | AddressField<T>
    | UrlField<T>
    | EmailField<T>
    | PhoneField<T>
    | NumberField<T>
    | DateTimeField<T>
    | BooleanField<T>
    | ComboboxField<T>
    | MultiSelectField<T>
    | ImageField<T>;

export interface ListField<T, L> extends Field<T, L[]> {
    type: "list";
    setter?: (t: T, newValue: L[]) => T;
    newRecordProvider?: () => L;
    fields: (TextField<L> | AddressField<L> | UrlField<L> | DateTimeField<L> | NumberField<L> | BooleanField<L>)[];
}
