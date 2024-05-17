import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    Header,
} from "@tanstack/react-table";
import { ChangeEvent, ReactNode, useState } from "react";
import { Col, Container, Table as ReactTable, Row } from "react-bootstrap";

import Icon from "./Icon";
import Pagination from "./Pagination";

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
    actionButton?: ReactNode;
    data: T[];
}

export default function Table<T>({ columns, columnsFilters, actionButton, data }: TableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        columnsFilters
            ?.filter((columnFilter) => columnFilter.initialValue !== undefined)
            .map((columnFilter) => {
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
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    const defaultColumnFilterComponentProvider: ColumnFilterComponentProvider<T> = (value, onChange, header) => (
        <input
            id={`filter-${header.column.columnDef.header}`}
            key={`filter-${header.column.columnDef.header}`}
            value={value as string}
            onChange={onChange}
            placeholder={`Search ${header.column.columnDef.header}`}
        />
    );

    return (
        <Container fluid>
            <Row>
                <ReactTable responsive hover>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="align-top">
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
                                                                        ? (e as ChangeEvent<HTMLInputElement>).target
                                                                              .checked
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
                                    <td key={cell.id} className="align-middle">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </ReactTable>
            </Row>

            <Row className="align-items-center my-3 gap-3">
                <Col className="flex-grow-0 text-nowrap">{actionButton}</Col>
                <Col>
                    <Pagination
                        rowsCount={table.getFilteredRowModel().rows.length}
                        pageIndex={table.getState().pagination.pageIndex}
                        pageSize={table.getState().pagination.pageSize}
                        setPageIndex={table.setPageIndex}
                        setPageSize={table.setPageSize}
                    />
                </Col>
            </Row>
        </Container>
    );
}
