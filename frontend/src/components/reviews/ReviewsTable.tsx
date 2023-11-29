import { createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import Table, { ColumnFilter } from "../utils/Table";
import Message from "../utils/Message";
import Button from "../utils/Button";
import { DoctorReview, reviewStatusToString, reviewStatuses } from "../../types/doctors/review";

interface ReviewsTableProps {
    reviews: DoctorReview[];
    setCurrentReview: (review: DoctorReview | null) => void;
    actionButton?: ReactNode;
}

function ReviewsTable({ reviews, setCurrentReview, actionButton }: ReviewsTableProps) {
    const columnHelper = createColumnHelper<DoctorReview>();

    const columns = [
        columnHelper.accessor("id", {
            header: "ID",
        }),
        columnHelper.accessor("doctor", {
            header: "Doctor name",
            cell: (props) => {
                return props!.getValue().fullName;
            },
        }),
        columnHelper.accessor("addedBy", {
            header: "Added by",
            cell: (props) => {
                return props!.getValue().remoteId;
            },
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
                            status == "PENDING_APPROVAL"
                                ? "warning"
                                : status === "APPROVED"
                                ? "success"
                                : status === "REJECTED"
                                ? "danger"
                                : ""
                        }
                    >
                        {status && reviewStatusToString(status)}
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
            cell: (props: { row: { original: DoctorReview } }) => (
                <Button label="Edit" variant="primary" onClick={() => setCurrentReview(props.row.original)} />
            ),
        }),
    ];

    const columnsFilters: ColumnFilter<DoctorReview>[] = [
        {
            id: "status",
            componentProvider: (value, onChange) => (
                <select id="filterStatus" key="filterStatus" value={value as string} onChange={onChange}>
                    <option value="">Select status</option>
                    {reviewStatuses.map((status) => (
                        <option value={status} key={status}>
                            {reviewStatusToString(status)}
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
        <Table<DoctorReview>
            data={reviews}
            columns={columns}
            columnsFilters={columnsFilters}
            actionButton={actionButton}
        />
    );
}

export default ReviewsTable;
