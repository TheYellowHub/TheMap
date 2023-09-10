import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Table as ReactTable } from "react-bootstrap";
import Icon from "./Icon";

interface TableProps<T> {
    // eslint-disable-next-line
    columns: ColumnDef<T, any>[];
    data: T[];
}

export default function Table<T>({ columns, data }: TableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable<T>({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        // TODO: handle pagination ?
        // TODO: filters
        <ReactTable responsive hover>
            <thead>
                {/* TODO: thead style */}
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {header.isPlaceholder ? null : (
                                    <div
                                        {...{
                                            className: header.column.getCanSort()
                                                ? "cursor-pointer select-none"
                                                : "",
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
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
            {/* TODO: Do we want the tfoot? */}
            <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {header.isPlaceholder ? null : (
                                    <div
                                        {...{
                                            className: header.column.getCanSort()
                                                ? "cursor-pointer select-none"
                                                : "",
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
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
