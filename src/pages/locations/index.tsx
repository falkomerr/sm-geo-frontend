import { useState, useCallback, useEffect } from 'react';
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
import { useShortPolling } from '../../shared/hooks/useShortPolling';

export function LocationsPage() {
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

  const fetchLocationsData = useCallback(async () => {
    console.log('[LocationsPage] Fetching locations...');

    const [paginatedResponse, allLocationsData] = await Promise.all([
      getLocations({
        userId: currentFilters.userId || undefined,
        fullName: currentFilters.fullName || undefined,
        startDate: currentFilters.startDate?.toISOString(),
        endDate: currentFilters.endDate?.toISOString(),
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
      getAllLocations({
        userId: currentFilters.userId || undefined,
        fullName: currentFilters.fullName || undefined,
        startDate: currentFilters.startDate?.toISOString(),
        endDate: currentFilters.endDate?.toISOString(),
      }),
    ]);

    console.log('[LocationsPage] Response received:', paginatedResponse);
    console.log('[LocationsPage] All locations loaded:', allLocationsData.length);

    return {
      items: paginatedResponse.items,
      total: paginatedResponse.total,
      pages: paginatedResponse.pages,
      allLocations: allLocationsData,
    };
  }, [currentFilters, pagination]);

  const { data: locationsData, error, isLoading, refetch } = useShortPolling({
    fetchFn: fetchLocationsData,
    interval: 5000,
    enabled: true,
    deps: [fetchLocationsData],
  });

  const locations = locationsData?.items || [];
  const allLocations = locationsData?.allLocations || [];
  const total = locationsData?.total || 0;
  const pages = locationsData?.pages || 0;
  const isLoadingMap = isLoading;

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
    try {
      await deleteLocation(locationToDelete);
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete location:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Локации</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error.message}</p>
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
