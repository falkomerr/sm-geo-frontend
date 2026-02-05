import { useState, useEffect, useCallback } from 'react';
import type { SortingState, PaginationState } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../app/components/ui/tabs';
import { LocationsTable } from '../../app/features/locations/ui/locations-table';
import { FiltersPanel, type FilterValues } from '../../app/features/locations/ui/filters-panel';
import { DeleteDialog } from '../../app/features/locations/ui/delete-dialog';
import { MapWrapper } from '../../app/features/locations/ui/map-wrapper';
import { getLocations } from '../../app/features/locations/api/get-locations';
import { getAllLocations } from '../../app/features/locations/api/get-all-locations';
import { deleteLocation } from '../../app/features/locations/api/delete-location';
import type { Location } from '../../app/features/locations/model/types';

export function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    userId: '',
    fullName: '',
    startDate: undefined,
    endDate: undefined,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLocations = useCallback(async () => {
    console.log('[LocationsPage] Fetching locations...');
    setIsLoading(true);
    setError(null);
    try {
      const response = await getLocations({
        userId: currentFilters.userId || undefined,
        fullName: currentFilters.fullName || undefined,
        startDate: currentFilters.startDate?.toISOString(),
        endDate: currentFilters.endDate?.toISOString(),
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });

      console.log('[LocationsPage] Response received:', response);

      setLocations(response.items);
      setTotal(response.total);
      setPages(response.pages);

      console.log('[LocationsPage] State updated:', {
        itemsCount: response.items.length,
        total: response.total,
        pages: response.pages
      });
    } catch (error) {
      console.error('[LocationsPage] Failed to fetch:', error);
      setError('Не удалось загрузить локации');
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters, pagination]);

  const fetchAllLocations = useCallback(async () => {
    console.log('[LocationsPage] Fetching all locations for map...');
    setIsLoadingMap(true);
    try {
      const all = await getAllLocations({
        userId: currentFilters.userId || undefined,
        fullName: currentFilters.fullName || undefined,
        startDate: currentFilters.startDate?.toISOString(),
        endDate: currentFilters.endDate?.toISOString(),
      });
      setAllLocations(all);
      console.log('[LocationsPage] All locations loaded:', all.length);
    } catch (error) {
      console.error('[LocationsPage] Failed to fetch all locations:', error);
    } finally {
      setIsLoadingMap(false);
    }
  }, [currentFilters]);

  useEffect(() => {
    console.log('[LocationsPage] Component mounted, fetching...');
    fetchLocations();
    fetchAllLocations();
  }, [fetchLocations, fetchAllLocations]);

  const handleFilterChange = (filters: FilterValues) => {
    setCurrentFilters(filters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleDelete = (id: string) => {
    setLocationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!locationToDelete) return;

    setIsDeleting(true);
    setError(null);
    try {
      await deleteLocation(locationToDelete);
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
      fetchLocations();
    } catch (error) {
      console.error('Failed to delete location:', error);
      setError('Не удалось удалить локацию');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Локации</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <FiltersPanel
          onFilterChange={handleFilterChange}
          isLoading={isLoading || isDeleting}
        />

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Таблица</TabsTrigger>
            <TabsTrigger value="map">Карта</TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <LocationsTable
              data={locations}
              total={total}
              pages={pages}
              sorting={sorting}
              onSortingChange={setSorting}
              pagination={pagination}
              onPaginationChange={setPagination}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="map">
            <MapWrapper locations={allLocations} isLoading={isLoadingMap} />
          </TabsContent>
        </Tabs>

        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
