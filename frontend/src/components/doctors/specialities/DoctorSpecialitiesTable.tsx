import { createColumnHelper } from "@tanstack/react-table";

import { DoctorSpeciality } from "../../../types/doctors/DoctorSpeciality";
import Button from "../../utils/Button";
import Table, { ColumnFilter } from "../../utils/Table";
import Icon from "../../utils/Icon";
import { ReactNode } from "react";

interface DoctorSpecialitiesTableProps {
    specialities: DoctorSpeciality[];
    setCurrentSpeciality: (doctorSpeciality: DoctorSpeciality | null) => void;
    actionButton?: ReactNode;
}

function DoctorSpecialitiesTable({ specialities, setCurrentSpeciality, actionButton }: DoctorSpecialitiesTableProps) {
    const columnHelper = createColumnHelper<DoctorSpeciality>();

    const columns = [
        columnHelper.accessor("id", {
            header: "ID",
        }),
        columnHelper.accessor("name", {
            header: "Name",
        }),
        columnHelper.accessor("active", {
            header: "Active",
            cell: (props) => <Icon icon={props!.getValue() ? "fa-check" : "fa-xmark"} />,
            filterFn: (row, _columnId, value) => {
                return row.original.active === value;
            },
        }),
        columnHelper.display({
            id: "edit",
            cell: (props: { row: { original: DoctorSpeciality } }) => (
                <Button label="Edit" variant="success" onClick={() => setCurrentSpeciality(props.row.original)} />
            ),
        }),
    ];

    const columnsFilters: ColumnFilter<DoctorSpeciality>[] = [
        {
            id: "active",
            componentProvider: (value, onChange, header) => (
                <input type="checkbox" defaultChecked={value as boolean} onChange={onChange} />
            ),
            initialValue: true,
        },
    ];

    return (
        <Table<DoctorSpeciality>
            data={specialities}
            columns={columns}
            columnsFilters={columnsFilters}
            actionButton={actionButton}
        />
    );
}

export default DoctorSpecialitiesTable;
