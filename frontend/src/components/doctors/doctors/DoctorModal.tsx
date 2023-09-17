import useDoctorCategories from "../../../hooks/doctors/useDoctorCategories";
import useDoctorSpecialities from "../../../hooks/doctors/useDoctorSpecialities";
import { DoctorSpeciality } from "../../../types/doctors/DoctorSpeciality";
import {
    Doctor,
    type DoctorStatus,
    doctorStatuses,
    doctorStatusToString,
    DoctorLocation,
    newDoctorLocation,
} from "../../../types/doctors/doctor";
import { DoctorCategory } from "../../../types/doctors/doctorCategory";
import { Url } from "../../../types/url";
import Modal from "../../utils/Modal";
import { ListField, ModalField } from "../../../types/fields";

interface DoctorModalProps {
    doctor: Doctor;
    showModal: boolean;
    onCancel: () => void;
    onSave: (Doctor: Doctor) => void;
    isSaving: boolean;
    isSavingError: boolean;
    savingError: any; // TODO: change unknown ?
}

function DoctorModal({ doctor, showModal, onCancel, onSave, isSaving, isSavingError, savingError }: DoctorModalProps) {
    const { data: categories } = useDoctorCategories();
    const { data: specialities } = useDoctorSpecialities();

    const fields: (ModalField<Doctor> | ListField<Doctor, any>)[] = [
        {
            type: "number",
            label: "ID",
            getter: (doctor) => doctor.id,
            setter: undefined,
        },
        {
            type: "text",
            label: "Name",
            required: true,
            getter: (doctor) => doctor.fullName,
            setter: (doctor, newName) => {
                return { ...doctor, fullName: newName };
            },
        },
        {
            type: "list",
            label: "Locations",
            getter: (doctor) => doctor.locations,
            setter: (doctor, locationsList) => {
                return { ...doctor, locations: locationsList };
            },
            newRecordProvider: newDoctorLocation,
            fields: [
                {
                    type: "text",
                    label: "Hospital name",
                    getter: (location) => location.hospitalName,
                    setter: (location, newHospitalName) => {
                        return { ...location, hospitalName: newHospitalName };
                    },
                },
                {
                    type: "text",
                    label: "Address",
                    getter: (location) => location.address,
                    setter: (location, newAddress) => {
                        return { ...location, address: newAddress };
                    },
                },
                {
                    type: "text", // TODO: "phone" type w/ validation?
                    label: "Phones",
                    getter: (location) => location.phone,
                    setter: (location, newPhone) => {
                        return { ...location, phone: newPhone };
                    },
                },
                {
                    type: "boolean",
                    label: "Private only",
                    getter: (location) => location.privateOnly,
                    setter: (location, newPrivateOnly) => {
                        return { ...location, privateOnly: newPrivateOnly };
                    },
                },
            ],
        } as ListField<Doctor, DoctorLocation>,
        {
            type: "checkboxesGroup",
            label: "Categories",
            getter: (doctor) => doctor.categories,
            setter: (doctor, newCategories) => {
                return { ...doctor, categories: newCategories };
            },
            options: categories.map((category: DoctorCategory) => {
                return { key: category.name, value: category.name };
            }),
        },
        {
            type: "checkboxesGroup",
            label: "Specialities",
            getter: (doctor) => doctor.specialities,
            setter: (doctor, newSpecialities) => {
                return { ...doctor, specialities: newSpecialities };
            },
            options: specialities.map((speciality: DoctorSpeciality) => {
                return { key: speciality.name, value: speciality.name };
            }),
        },
        {
            type: "list",
            label: "Websites",
            getter: (doctor) => doctor.websites,
            setter: (doctor, websitesList) => {
                return { ...doctor, websites: websitesList };
            },
            newRecordProvider: () => "",
            fields: [
                {
                    type: "url",
                    label: "Website",
                    getter: (website) => website,
                    setter: (_, website) => {
                        return website;
                    },
                },
            ],
        } as ListField<Doctor, Url>,
        {
            type: "url",
            label: "iCareBetter profile",
            getter: (doctor) => doctor.iCareBetter,
            setter: (doctor, newValue) => {
                return { ...doctor, iCareBetter: newValue };
            },
        },
        {
            type: "boolean",
            label: "NancyNook XX", // TODO: rephrase
            getter: (doctor) => doctor.nancysNook,
            setter: (doctor, newValue) => {
                return { ...doctor, nancysNook: newValue };
            },
        },
        {
            type: "file",
            label: "Image",
            getter: (doctor) => doctor.image,
            setter: (doctor, newValue) => {
                return { ...doctor, image: newValue };
                // TODO: - file upload from the frontend still doesn't work + present current image (download link)
            },
        },
        // TODO: replace status with action buttons ?
        {
            type: "combobox",
            label: "Status",
            getter: (doctor) => doctor.status,
            setter: (doctor, newValue) => {
                return { ...doctor, status: newValue as DoctorStatus };
            },
            options: doctorStatuses.map((status) => {
                return {
                    key: status,
                    value: doctorStatusToString(status),
                };
            }),
        },
        {
            type: "datetime",
            label: "Added at",
            getter: (doctor) => doctor.addedAt,
        },
        {
            type: "datetime",
            label: "Approved at",
            getter: (doctor) => doctor.approvedAt,
        },
        {
            type: "datetime",
            label: "Rejected at",
            getter: (doctor) => doctor.rejectedAt,
        },
        {
            type: "datetime",
            label: "Updated at",
            getter: (doctor) => doctor.updatedAt,
        },
    ];

    return (
        <Modal<Doctor>
            t={doctor}
            fields={fields}
            getTitle={(doctor: Doctor) => {
                return "Doctor Card - " + (doctor.id !== null ? `${doctor.id} ${doctor.fullName}` : "New");
            }}
            showModal={showModal}
            onCancel={onCancel}
            onSave={onSave}
            isSaving={isSaving}
            isSavingError={isSavingError}
            savingError={savingError}
        />
    );
}

export default DoctorModal;
