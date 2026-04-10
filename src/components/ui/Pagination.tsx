// src/components/ui/Pagination.tsx
import React from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  size = 'md',
  className = '',
}) => {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    // Remove unused variables - we don't need firstPageIndex and lastPageIndex
    // const firstPageIndex = 1;
    // const lastPageIndex = totalPages;

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 3 + 2 * siblingCount);
      return [...leftRange, '...', totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - (3 + 2 * siblingCount) + 1, totalPages);
      return [1, '...', ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    }

    return [];
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const buttonSizeClasses = {
    sm: 'px-2 py-1 text-sm min-w-[32px]',
    md: 'px-3 py-2 text-sm min-w-[40px]',
    lg: 'px-4 py-3 text-base min-w-[48px]',
  };

  return (
    <nav
      className={`flex items-center justify-center space-x-1 ${className}`}
      aria-label="Pagination"
    >
      {showFirstLast && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="!px-2"
          aria-label="First page"
        >
          <span className="sr-only">First page</span>
          <span aria-hidden="true">«</span>
        </Button>
      )}

      {showPrevNext && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="!px-2"
          aria-label="Previous page"
        >
          <span className="sr-only">Previous</span>
          <span aria-hidden="true">‹</span>
        </Button>
      )}

      {getPageNumbers().map((pageNumber, index) => {
        if (pageNumber === '...') {
          return (
            <span
              key={`dots-${index}`}
              className={`
                ${buttonSizeClasses[size]} inline-flex items-center justify-center
                text-gray-500 dark:text-gray-400
              `}
            >
              ⋯
            </span>
          );
        }

        const page = pageNumber as number;
        const isActive = page === currentPage;

        return (
          <Button
            key={page}
            variant={isActive ? 'primary' : 'outline'}
            size={size}
            onClick={() => handlePageChange(page)}
            className={`${buttonSizeClasses[size]} ${
              isActive ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </Button>
        );
      })}

      {showPrevNext && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="!px-2"
          aria-label="Next page"
        >
          <span className="sr-only">Next</span>
          <span aria-hidden="true">›</span>
        </Button>
      )}

      {showFirstLast && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="!px-2"
          aria-label="Last page"
        >
          <span className="sr-only">Last page</span>
          <span aria-hidden="true">»</span>
        </Button>
      )}
    </nav>
  );
};

export default Pagination;