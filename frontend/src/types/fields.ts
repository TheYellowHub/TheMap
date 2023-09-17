import { DateTime } from "./doctors/doctor";
import { Url } from "./url";

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

export interface UrlField<T> extends Field<T, Url | undefined> {
    type: "url";
    setter?: (t: T, newValue: Url) => T;
}

export interface DateTimeField<T> extends Field<T, DateTime | undefined> {
    type: "datetime";
    setter?: (t: T, newValue: DateTime) => T;
}

export interface NumberField<T> extends Field<T, number | undefined> {
    type: "number";
    setter?: (t: T, newValue: number) => T;
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
    setter?: (t: T, newValue: string) => T;
}

export interface CheckboxesGroupField<T> extends Field<T, string[]> {
    type: "checkboxesGroup";
    options: ReadonlyArray<SelectOption>;
    setter?: (t: T, newValue: string[]) => T;
}

export interface FileField<T> extends Field<T, File | undefined> {
    type: "file";
    setter?: (t: T, newValue: File) => T;
}

export type ModalField<T> =
    | TextField<T>
    | UrlField<T>
    | DateTimeField<T>
    | NumberField<T>
    | BooleanField<T>
    | ComboboxField<T>
    | CheckboxesGroupField<T>
    | FileField<T>;

export interface ListField<T, L> extends Field<T, L[]> {
    type: "list";
    setter?: (t: T, newValue: L[]) => T;
    newRecordProvider?: () => L;
    fields: (TextField<L> | UrlField<L> | DateTimeField<L> | NumberField<L> | BooleanField<L>)[];
}
