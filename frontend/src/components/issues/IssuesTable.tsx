import { createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import Table, { ColumnFilter } from "../utils/Table";
import Message from "../utils/Message";
import Button from "../utils/Button";
import { DoctorIssue, issueStatusToString, issueStatuses } from "../../types/doctors/issue";

interface IssuesTableProps {
    issues: DoctorIssue[];
    setCurrentIssue: (issue: DoctorIssue | null) => void;
    actionButton?: ReactNode;
}

function IssuesTable({ issues, setCurrentIssue, actionButton }: IssuesTableProps) {
    const columnHelper = createColumnHelper<DoctorIssue>();

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
                            status == "PENDING"
                                ? "warning"
                                : status === "PUBLISHED"
                                ? "success"
                                : status === "REJECTED"
                                ? "danger"
                                : ""
                        }
                    >
                        {status && issueStatusToString(status)}
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
            cell: (props: { row: { original: DoctorIssue } }) => (
                <Button label="Edit" variant="primary" onClick={() => setCurrentIssue(props.row.original)} />
            ),
        }),
    ];

    const columnsFilters: ColumnFilter<DoctorIssue>[] = [
        {
            id: "status",
            componentProvider: (value, onChange) => (
                <select id="filterStatus" key="filterStatus" value={value as string} onChange={onChange}>
                    <option value="">Select status</option>
                    {issueStatuses.map((status) => (
                        <option value={status} key={status}>
                            {issueStatusToString(status)}
                        </option>
                    ))}
                </select>
            ),
            initialValue: "PENDING",
        },
        {
            id: "addedAt",
            componentProvider: (value, onChange) => <input type="date" value={value as string} onChange={onChange} />,
        },
    ];

    return (
        <Table<DoctorIssue>
            data={issues}
            columns={columns}
            columnsFilters={columnsFilters}
            actionButton={actionButton}
        />
    );
}

export default IssuesTable;
