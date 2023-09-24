import { Col, Container, Row } from "react-bootstrap";

import Button from "./Button";

interface PaginationProps {
    rowsCount: number;
    pageIndex: number;
    pageSize: number;
    setPageIndex: (index: number) => void;
    setPageSize: (size: number) => void;
}

function Pagination({ rowsCount, pageIndex, pageSize, setPageIndex, setPageSize }: PaginationProps) {
    const pagesCount = Math.ceil(rowsCount / pageSize);

    return (
        <Container>
            <Row>
                <Col className="align-items-center text-center col-6">
                    <Button
                        className="border rounded p-1 m-1"
                        onClick={() => setPageIndex(0)}
                        disabled={pageIndex === 0}
                        label="<<"
                    />
                    <Button
                        className="border rounded p-1  m-1"
                        onClick={() => setPageIndex(pageIndex - 1)}
                        disabled={pageIndex === 0}
                        label="<"
                    />
                    <span className="m-1">
                        Page {pageIndex + 1} of {pagesCount}
                    </span>
                    <Button
                        className="border rounded p-1  m-1"
                        onClick={() => setPageIndex(pageIndex + 1)}
                        disabled={pageIndex === pagesCount}
                        label=">"
                    />
                    <Button
                        className="border rounded p-1  m-1"
                        onClick={() => setPageIndex(pagesCount - 1)}
                        disabled={pageIndex === pagesCount - 1}
                        label=">>"
                    />
                </Col>
                <Col className="align-items-center text-center">
                    Go to
                    <input
                        type="number"
                        className="p-1  m-1"
                        min={1}
                        max={pagesCount}
                        value={pageIndex + 1}
                        onChange={(e) => {
                            const newPageIndex = e.target.value ? Number(e.target.value) - 1 : 0;
                            setPageIndex(newPageIndex);
                        }}
                    />
                </Col>
                <Col className="align-items-center text-center">
                    Show
                    <input
                        type="number"
                        className="p-1  m-1"
                        min={1}
                        max={pagesCount * pageSize}
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                    />
                </Col>
                <Col className="row justify-content-end">Total: {rowsCount} Rows</Col>
            </Row>
        </Container>
    );
}

export default Pagination;
