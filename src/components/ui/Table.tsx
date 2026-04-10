// src/components/ui/Table.tsx
import React from 'react';
import type { ReactNode } from 'react';

interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
  onRowClick?: (record: T, index: number) => void;
  emptyText?: string;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
  className = '',
  onRowClick,
  emptyText = 'No data available',
}: TableProps<T>) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const cellPadding = compact ? 'px-3 py-2' : 'px-6 py-4';

  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className={`w-full text-sm ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''}`}>
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  ${cellPadding}
                  ${alignClasses[column.align || 'left']}
                  font-semibold text-gray-700 dark:text-gray-300
                  border-b border-gray-200 dark:border-gray-700
                `}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(record, index)}
                className={`
                  ${striped && index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900'}
                  ${hoverable ? 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer' : ''}
                  transition-colors duration-200
                `}
              >
                {columns.map((column) => {
                  const value = column.dataIndex ? record[column.dataIndex] : record[column.key];
                  const content = column.render ? column.render(value, record, index) : value;

                  return (
                    <td
                      key={column.key}
                      className={`
                        ${cellPadding}
                        ${alignClasses[column.align || 'left']}
                        border-b border-gray-200 dark:border-gray-700
                      `}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '' }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

interface TableFooterProps {
  children: ReactNode;
  className?: string;
}

const TableFooter: React.FC<TableFooterProps> = ({ children, className = '' }) => {
  return <div className={`mt-4 ${className}`}>{children}</div>;
};

Table.Header = TableHeader;
Table.Footer = TableFooter;

export default Table;