import React, { useCallback, useMemo, useState } from 'react';

export type DataTableColumn<T extends Record<string, unknown>> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export type DataTableSortDirection = 'asc' | 'desc';

export type DataTableProps<T extends Record<string, unknown>> = {
  columns: Array<DataTableColumn<T>>;
  data: T[];
  caption?: string;
  emptyMessage?: string;
  className?: string;
  zebra?: boolean;
  stickyHeader?: boolean;
  density?: 'comfortable' | 'compact';
  initialSort?: { key: keyof T; direction: DataTableSortDirection };
  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string | number;
};

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function getAriaSort(dir: DataTableSortDirection | null): 'ascending' | 'descending' | 'none' {
  if (dir === 'asc') return 'ascending';
  if (dir === 'desc') return 'descending';
  return 'none';
}

function HeaderSortIcon({ dir }: { dir: DataTableSortDirection | null }) {
  return (
    <svg
      className={cn('ml-1 h-3.5 w-3.5 opacity-70', dir ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500')}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 7l3-3 3 3H7zM13 13l-3 3-3-3h6z" />
    </svg>
  );
}

function cellAlignClass(align?: 'left' | 'center' | 'right'): string {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
}

function rowHoverClickable(hasOnClick: boolean): string {
  return hasOnClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : '';
}

function headerButtonAlign(align?: 'left' | 'center' | 'right'): string {
  if (align === 'center') return 'justify-center';
  if (align === 'right') return 'justify-end';
  return 'justify-start';
}

function densityRowHeight(density: 'comfortable' | 'compact' = 'comfortable'): string {
  return density === 'compact' ? 'py-2' : 'py-3';
}

function densityCellPadding(density: 'comfortable' | 'compact' = 'comfortable'): string {
  return density === 'compact' ? 'px-3' : 'px-4';
}

function DataTableInner<T extends Record<string, unknown>>(props: DataTableProps<T>) {
  const {
    columns,
    data,
    caption,
    emptyMessage = 'No data available',
    className,
    zebra = true,
    stickyHeader = true,
    density = 'comfortable',
    initialSort,
    onRowClick,
    getRowId,
  } = props;

  const [sortKey, setSortKey] = useState<keyof T | null>(initialSort?.key ?? null);
  const [sortDir, setSortDir] = useState<DataTableSortDirection | null>(initialSort?.direction ?? null);

  const handleSort = useCallback(
    (key: keyof T, sortable?: boolean) => {
      if (!sortable) return;
      setSortKey(prevKey => {
        if (prevKey !== key) {
          setSortDir('asc');
          return key;
        }
        setSortDir(prevDir => (prevDir === 'asc' ? 'desc' : prevDir === 'desc' ? null : 'asc'));
        return key;
      });
    },
    []
  );

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const vA = a[sortKey];
      const vB = b[sortKey];
      const cmp = compareValues(vA, vB);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const colCount = columns.length;

  return (
    <div className={cn('w-full overflow-x-auto rounded-md border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700', className)}>
      <table className="w-full border-collapse text-sm">
        {caption ? (
          <caption className="px-4 py-3 text-left text-sm text-gray-500 dark:text-gray-400">{caption}</caption>
        ) : null}

        <thead className={cn(stickyHeader && 'sticky top-0 z-10', 'bg-gray-50 dark:bg-gray-800')}>
          <tr>
            {columns.map((col) => {
              const isActive = sortKey === col.key && sortDir !== null;
              return (
                <th
                  key={String(col.key)}
                  scope="col"
                  aria-sort={getAriaSort(isActive ? sortDir : null)}
                  className={cn(
                    'font-medium text-gray-900 dark:text-gray-100',
                    densityCellPadding(density),
                    densityRowHeight(density),
                    cellAlignClass(col.align),
                    col.className
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key, col.sortable)}
                      className={cn(
                        'group inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
                        headerButtonAlign(col.align)
                      )}
                    >
                      <span>{col.label}</span>
                      <HeaderSortIcon dir={isActive ? sortDir : null} />
                      <span className="sr-only">
                        {isActive ? (sortDir === 'asc' ? 'Sorted ascending' : 'Sorted descending') : 'Not sorted'}
                      </span>
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className={cn(zebra && 'divide-y divide-gray-100 dark:divide-gray-800')}>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={colCount} className={cn('text-center text-gray-500 dark:text-gray-400', densityCellPadding(density), densityRowHeight(density))}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => {
              const rowId = getRowId ? getRowId(row, rowIndex) : rowIndex;
              return (
                <tr
                  key={rowId}
                  className={cn(
                    zebra && 'odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800',
                    rowHoverClickable(Boolean(onRowClick))
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => {
                    const value = row[col.key];
                    return (
                      <td
                        key={String(col.key)}
                        className={cn('text-gray-900 dark:text-gray-100', densityCellPadding(density), densityRowHeight(density), cellAlignClass(col.align))}
                      >
                        {col.render ? col.render(value, row) : String(value ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function DataTableTyped<T extends Record<string, unknown>>(props: DataTableProps<T>) {
  return <DataTableInner {...props} />;
}

export default DataTableTyped;