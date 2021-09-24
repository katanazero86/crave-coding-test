import React, { useEffect, useState } from 'react';
import classes from './Pagination.module.scss';

const BLOCK_SIZE = 5;

interface PaginationProps {
  total: number;
  page: number;
  size: number;
  handelPageClick?(targetPage: number): void;
}

const Pagination = ({ total, page, size, handelPageClick }: PaginationProps): React.ReactElement => {
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  const initPagination = () => {
    const targetTotalPage = Math.ceil(total / size);
    const pageBlock = Math.floor((page - 1) / BLOCK_SIZE);
    const startPage = BLOCK_SIZE * pageBlock + 1;
    const endPage = startPage + (BLOCK_SIZE - 1) > targetTotalPage ? targetTotalPage : startPage + (BLOCK_SIZE - 1);
    const targetPageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      targetPageNumbers.push(i);
    }
    setPageNumbers(targetPageNumbers);
    setTotalPage(targetTotalPage);
    if (page > targetTotalPage) {
      if (handelPageClick) handelPageClick(targetTotalPage);
    }
  };

  const handlePrevClick = () => {
    if (page !== 1) {
      if (handelPageClick) handelPageClick(page - 1);
    }
  };

  const handleNextClick = () => {
    if (page < totalPage) {
      if (handelPageClick) handelPageClick(page + 1);
    }
  };

  useEffect(() => {
    if (total > 0) {
      initPagination();
    } else {
      setPageNumbers([]);
      setTotalPage(0);
    }
  }, [page, total, size]);

  return (
    <div className={classes.pagination}>
      {pageNumbers.length > 0 && (
        <>
          <span className={classes.paginationPrev} onClick={handlePrevClick}>
            prev
          </span>
          {pageNumbers.map((pageNumber) => {
            return (
              <span
                key={pageNumber}
                className={`${classes.paginationPage} ${pageNumber === page && classes.paginationPageActive}`}
                onClick={() => handelPageClick && handelPageClick(pageNumber)}>
                {pageNumber}
              </span>
            );
          })}
          <span className={classes.paginationPrev} onClick={handleNextClick}>
            next
          </span>
        </>
      )}
    </div>
  );
};

export default React.memo(Pagination);
