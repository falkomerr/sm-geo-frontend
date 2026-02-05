import { format } from 'date-fns';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from '@tanstack/react-table';
import type { Location } from '../model/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { ArrowUpDown, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface LocationsTableProps {
  data: Location[];
  total: number;
  pages: number;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState | ((prev: SortingState) => SortingState)) => void;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  onDelete: (id: string) => void;
}

export function LocationsTable({
  data,
  total,
  pages,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  onDelete,
}: LocationsTableProps) {
  const columns: ColumnDef<Location>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => {
        const id = row.getValue('id') as string;
        return <span className="font-mono text-xs">{id.slice(-8)}</span>;
      },
    },
    {
      accessorKey: 'userId',
      header: 'ID пользователя',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue('userId')}</span>
      ),
    },
    {
      accessorKey: 'fullName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Полное имя
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.getValue('fullName'),
    },
    {
      accessorKey: 'latitude',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Широта
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const lat = row.getValue('latitude') as number | string;
        return <span className="font-mono">{Number(lat).toFixed(6)}</span>;
      },
    },
    {
      accessorKey: 'longitude',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Долгота
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const lng = row.getValue('longitude') as number | string;
        return <span className="font-mono">{Number(lng).toFixed(6)}</span>;
      },
    },
    {
      accessorKey: 'timestamp',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Время
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const timestamp = row.getValue('timestamp') as string;
        return <span className="text-sm">{format(new Date(timestamp), 'PPp')}</span>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Создано
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string | undefined;
        return createdAt ? <span className="text-sm">{format(new Date(createdAt), 'PPp')}</span> : null;
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => {
        const location = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(location.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    onSortingChange: onSortingChange,
    onPaginationChange: onPaginationChange,
    state: {
      sorting,
      pagination,
    },
    pageCount: pages,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Локации не найдены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Всего: {total} локаций
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange({ ...pagination, pageIndex: 0 })}
            disabled={pagination.pageIndex === 0}
          >
            Первая
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPaginationChange({ ...pagination, pageIndex: pagination.pageIndex - 1 })
            }
            disabled={pagination.pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Предыдущая
          </Button>
          <div className="flex items-center justify-center text-sm font-medium">
            Страница {pagination.pageIndex + 1} из {pages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPaginationChange({ ...pagination, pageIndex: pagination.pageIndex + 1 })
            }
            disabled={pagination.pageIndex >= pages - 1}
          >
            Следующая
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange({ ...pagination, pageIndex: pages - 1 })}
            disabled={pagination.pageIndex >= pages - 1}
          >
            Последняя
          </Button>
        </div>
      </div>
    </div>
  );
}
