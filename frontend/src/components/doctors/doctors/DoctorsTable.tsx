import { createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import { Doctor, doctorStatusToString, doctorStatuses } from "../../../types/doctors/doctor";
import Button from "../../utils/Button";
import Table, { ColumnFilter } from "../../utils/Table";
import Message from "../../utils/Message";

interface DoctorsTableProps {
    doctors: Doctor[];
    setCurrentDoctor: (doctor: Doctor | null) => void;
    actionButton?: ReactNode;
}

function DoctorsTable({ doctors, setCurrentDoctor, actionButton }: DoctorsTableProps) {
    const columnHelper = createColumnHelper<Doctor>();

    const columns = [
        columnHelper.accessor("id", {
            header: "ID",
        }),
        columnHelper.accessor("fullName", {
            header: "Name",
        }),
        columnHelper.accessor("addedAt", {
            header: "Added at",
            cell: (props) => {
                return new Date(props!.getValue() as string).toLocaleDateString("en-US");
            },
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (props) => {
                const status = props!.getValue();
                return (
                    <Message
                        variant={
                            status == "PENDING_APPROVAL" ? "warning" : status === "APPROVED" ? "success" : "danger"
                        }
                    >
                        {status && doctorStatusToString(status)}
                    </Message>
                );
            },
            filterFn: (row, _columnId, value) => {
                return (
                    row.original.status !== undefined && row.original.status.toLowerCase().includes(value.toLowerCase())
                );
            },
        }),
        columnHelper.display({
            id: "edit",
            cell: (props: { row: { original: Doctor } }) => (
                <Button label="Edit" variant="primary" onClick={() => setCurrentDoctor(props.row.original)} />
            ),
        }),
    ];

    const columnsFilters: ColumnFilter<Doctor>[] = [
        {
            id: "status",
            componentProvider: (value, onChange) => (
                <select id="filterStatus" key="filterStatus" value={value as string} onChange={onChange}>
                    <option value="">Select status</option>
                    {doctorStatuses.map((status) => (
                        <option value={status} key={status}>
                            {doctorStatusToString(status)}
                        </option>
                    ))}
                </select>
            ),
            initialValue: "PENDING_APPROVAL",
        },
        {
            id: "addedAt",
            componentProvider: (value, onChange) => <input type="date" value={value as string} onChange={onChange} />,
        },
    ];

    return (
        <Table<Doctor> data={doctors} columns={columns} columnsFilters={columnsFilters} actionButton={actionButton} />
    );
}

export default DoctorsTable;
