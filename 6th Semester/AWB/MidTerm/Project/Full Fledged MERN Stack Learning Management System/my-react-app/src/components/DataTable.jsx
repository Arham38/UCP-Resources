import React from 'react';

const DataTable = ({
  columns = [],
  rows = [],
  getRowId = (row, index) => row.id || row._id || index,
  selectedRowId,
  onRowClick,
  emptyMessage = 'No records found.',
}) => (
  <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-colors duration-300 dark:shadow-card-dark">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-left text-sm">
        <thead className="bg-neutral-100 text-xs uppercase tracking-normal text-text-muted dark:bg-neutral-900/60">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-4 py-3 font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-center text-text-muted" colSpan={columns.length || 1}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const rowId = getRowId(row, index);
              const selected = selectedRowId === rowId;

              return (
                <tr
                  key={rowId}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors duration-300 ${
                    selected
                      ? 'bg-primary-50 dark:bg-primary-900/30'
                      : index % 2 === 0
                        ? 'bg-surface'
                        : 'bg-neutral-50 dark:bg-neutral-900/20'
                  } ${onRowClick ? 'cursor-pointer hover:bg-info-50 dark:hover:bg-info-900/20' : ''}`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-text-secondary">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataTable;
