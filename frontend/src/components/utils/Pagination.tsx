import { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Icon from "./Icon";

interface PaginationProps {
    rowsCount: number;
    pageIndex: number;
    pageSize: number;
    setPageIndex: (index: number) => void;
    setPageSize?: (size: number) => void;
}

function Pagination({ rowsCount, pageIndex, pageSize, setPageIndex, setPageSize }: PaginationProps) {
    const pagesCount = Math.ceil(rowsCount / pageSize);

    const pagesToSelectSet = new Set<number>();
    pagesToSelectSet.add(0);
    pagesToSelectSet.add(pageIndex - 1);
    pagesToSelectSet.add(pageIndex);
    pagesToSelectSet.add(pageIndex + 1);
    pagesToSelectSet.add(pagesCount - 1);

    const pagesToSelectList = Array.from(pagesToSelectSet)
        .filter((newPageIndex: number) => 0 <= newPageIndex && newPageIndex < pagesCount)
        .sort();

    return (
        <Container fluid>
            <Row>
                <Col className="paginationContainer">
                    <button
                        key={`page-previous`}
                        className="paginationButton"
                        onClick={() => setPageIndex(pageIndex - 1)}
                        disabled={pageIndex - 1 < 0}
                    >
                        <Icon icon="fa-caret-left" />
                    </button>
                    {pagesToSelectList.map((newPageIndex: number, index: number) => (
                        <Fragment key={`page-${newPageIndex}`}>
                            {0 < index && pagesToSelectList[index - 1] + 1 < newPageIndex && (
                                <div
                                    key={`missing-pages-${pagesToSelectList[index - 1] + 1}-${newPageIndex - 1}`}
                                    className="paginationText"
                                >
                                    ...
                                </div>
                            )}
                            <button
                                key={`page-${newPageIndex}`}
                                className={`paginationButton ${pageIndex === newPageIndex ? "selected" : ""}`}
                                onClick={() => setPageIndex(newPageIndex)}
                                disabled={pageIndex === newPageIndex}
                            >
                                {newPageIndex + 1}
                            </button>
                        </Fragment>
                    ))}
                    <button
                        key={`page-next`}
                        className="paginationButton"
                        onClick={() => setPageIndex(pageIndex + 1)}
                        disabled={pageIndex + 1 === pagesCount}
                    >
                        <Icon icon="fa-caret-right" />
                    </button>
                </Col>
                {setPageSize && (
                    <Col className="paginationContainer" sm={4}>
                        <div className="paginationText">
                            In each page
                            <input
                                id="page-size-input"
                                type="number"
                                className="p-0 m-1"
                                min={1}
                                max={pagesCount * pageSize}
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                }}
                            />
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default Pagination;
