import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    Header,
} from "@tanstack/react-table";
import { ChangeEvent, ReactNode, useState } from "react";
import { Table as ReactTable } from "react-bootstrap";
import Icon from "./Icon";

export type ColumnFilterComponentProvider<T> = (
    value: unknown,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    header: Header<T, unknown>
) => ReactNode;

export type ColumnFilter<T> = {
    id: string;
    componentProvider?: ColumnFilterComponentProvider<T>;
    initialValue?: unknown;
};

interface TableProps<T> {
    // eslint-disable-next-line
    columns: ColumnDef<T, any>[];
    columnsFilters?: ColumnFilter<T>[];
    data: T[];
}

export default function Table<T>({ columns, columnsFilters, data }: TableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        columnsFilters?.map((columnFilter) => {
            return { id: columnFilter.id, value: columnFilter.initialValue };
        }) || []
    );

    const table = useReactTable<T>({
        data,
        columns,
        state: {
            columnFilters,
            sorting,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    const defaultColumnFilterComponentProvider: ColumnFilterComponentProvider<T> = (value, onChange, header) => (
        <input value={value as string} onChange={onChange} placeholder={`Search ${header.column.columnDef.header}`} />
    );

    return (
        // TODO: handle pagination ?
        <ReactTable responsive hover>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {header.isPlaceholder ? null : (
                                    <>
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? "cursor-pointer select-none"
                                                    : "",
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            <Icon
                                                icon={
                                                    {
                                                        asc: "fa-arrow-up",
                                                        desc: "fa-arrow-down",
                                                    }[header.column.getIsSorted() as string] ?? null
                                                }
                                            />
                                        </div>
                                        <div>
                                            {header.column.getCanFilter() &&
                                                (
                                                    columnsFilters?.find(
                                                        (columnFilter) => columnFilter.id === header.column.id
                                                    )?.componentProvider || defaultColumnFilterComponentProvider
                                                )(
                                                    header.column.getFilterValue(),
                                                    (e) => {
                                                        header.column.setFilterValue(
                                                            e.target.type === "checkbox"
                                                                ? (e as ChangeEvent<HTMLInputElement>).target.checked
                                                                : e.target.value
                                                        );
                                                    },
                                                    header
                                                )}
                                        </div>
                                    </>
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="jus">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {header.isPlaceholder ? null : (
                                    <div
                                        {...{
                                            className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        <Icon
                                            icon={
                                                {
                                                    asc: "fa-arrow-up",
                                                    desc: "fa-arrow-down",
                                                }[header.column.getIsSorted() as string] ?? null
                                            }
                                        />
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </ReactTable>
    );
}
