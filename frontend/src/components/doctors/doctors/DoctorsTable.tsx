import { createColumnHelper } from "@tanstack/react-table";

import { Doctor } from "../../../types/doctors/doctor";
import Button from "../../utils/Button";
import Table from "../../utils/Table";
import Message from "../../utils/Message";

interface DoctorsTableProps {
    doctors: Doctor[];
    setCurrentDoctor: (doctor: Doctor | null) => void;
}

function DoctorsTable({ doctors, setCurrentDoctor }: DoctorsTableProps) {
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
            // TODO: hideable & hidden by default
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
                        {status}
                    </Message>
                );
            },
            // TODO: filter (default: only PENDING_APPROVAL & APPROVED)
        }),
        // TODO: additional fields ?
        columnHelper.display({
            id: "edit",
            cell: (props) => (
                <Button label="Edit" variant="success" onClick={() => setCurrentDoctor(props!.row!.original)} />
            ), // TODO: fix types and git rid of the !!
        }),
    ];

    return <Table<Doctor> data={doctors} columns={columns} />;
}

export default DoctorsTable;
