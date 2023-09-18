import { createColumnHelper } from "@tanstack/react-table";

import { DoctorCategory } from "../../../types/doctors/doctorCategory";
import Button from "../../utils/Button";
import Table from "../../utils/Table";
import Icon from "../../utils/Icon";

interface DoctorCategoriesTableProps {
    categories: DoctorCategory[];
    setCurrentCategory: (doctorCategory: DoctorCategory | null) => void;
}

function DoctorCategoriesTable({ categories, setCurrentCategory }: DoctorCategoriesTableProps) {
    const columnHelper = createColumnHelper<DoctorCategory>();

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
            cell: (props: { row: { original: DoctorCategory } }) => (
                <Button label="Edit" variant="success" onClick={() => setCurrentCategory(props.row.original)} />
            ),
        }),
    ];

    return <Table<DoctorCategory> data={categories} columns={columns} />;
}

export default DoctorCategoriesTable;
