import { createColumnHelper } from "@tanstack/react-table";

import { DoctorCategoty } from "../../../types/doctors/doctorCategory";
import Button from "../../utils/Button";
import Table from "../../utils/Table";
import Icon from "../../utils/Icon";

interface DoctorCategoriesTableProps {
    categories: DoctorCategoty[];
    setCurrentCategory: (doctorCategory: DoctorCategoty | null) => void;
}

function DoctorCategoriesTable({ categories, setCurrentCategory }: DoctorCategoriesTableProps) {
    const columnHelper = createColumnHelper<DoctorCategoty>();

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
            cell: (props) => (
                <Button
                    label="Edit"
                    variant="success"
                    onClick={() => setCurrentCategory(props!.row!.original)}
                />
            ), // TODO: fix types and git rid of the !!
        }),
    ];

    return <Table<DoctorCategoty> data={categories} columns={columns} />;
}

export default DoctorCategoriesTable;
