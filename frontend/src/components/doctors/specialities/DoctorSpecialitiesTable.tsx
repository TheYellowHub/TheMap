import { createColumnHelper } from "@tanstack/react-table";

import { DoctorSpeciality } from "../../../types/doctors/DoctorSpeciality";
import Button from "../../utils/Button";
import Table from "../../utils/Table";
import Icon from "../../utils/Icon";

interface DoctorSpecialitiesTableProps {
    specialities: DoctorSpeciality[];
    setCurrentSpeciality: (doctorSpeciality: DoctorSpeciality | null) => void;
}

function DoctorSpecialitiesTable({ specialities, setCurrentSpeciality }: DoctorSpecialitiesTableProps) {
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
            // TODO: filter (default: only active records)
        }),
        columnHelper.display({
            id: "edit",
            cell: (props: { row: { original: DoctorSpeciality } }) => (
                <Button label="Edit" variant="success" onClick={() => setCurrentSpeciality(props.row.original)} />
            ),
        }),
    ];

    return <Table<DoctorSpeciality> data={specialities} columns={columns} />;
}

export default DoctorSpecialitiesTable;
