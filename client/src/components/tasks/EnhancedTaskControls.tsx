"use client"

import React, { useState, useCallback } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setSearchQuery,
  setAdvancedSearchFilters,
  updateAdvancedSearchFilter,
  clearAdvancedSearchFilters,
  addSavedSearchPreset,
  removeSavedSearchPreset,
  addSearchHistoryItem,
  clearSearchHistory,
} from '@/store/slices/tasksSlice';
import {
  selectSearchQuery,
  selectAdvancedSearchFilters,
  selectSavedSearchPresets,
  selectSearchHistory,
  selectActiveFiltersCount,
  selectAvailableTags,
} from '@/store/selectors/tasksSelectors';
import { AdvancedSearch } from './AdvancedSearch';
import { FilterPills } from './FilterPills';
import { TaskControls, ViewMode, FilterType, SortType } from './TaskControls';
import { AdvancedSearchFilters, SavedSearchPreset } from '@/types';

interface EnhancedTaskControlsProps {
  // Legacy TaskControls props
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  bulkSelectMode: boolean;
  onBulkSelectModeToggle: () => void;
  selectedTasks: Set<string>;
  onBulkDelete?: () => void;
  onBulkComplete?: () => void;
  onBulkPriorityChange?: (priority: any) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  totalTasks: number;
  // Project filtering
  projectFilter: string;
  onProjectFilterChange: (projectId: string) => void;
  // Group by project toggle
  groupByProject: boolean;
  onGroupByProjectToggle: () => void;
}

export function EnhancedTaskControls(props: EnhancedTaskControlsProps) {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const advancedFilters = useAppSelector(selectAdvancedSearchFilters);
  const savedPresets = useAppSelector(selectSavedSearchPresets);
  const searchHistory = useAppSelector(selectSearchHistory);
  const activeFiltersCount = useAppSelector(selectActiveFiltersCount);
  const availableTags = useAppSelector(selectAvailableTags);

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const handleSearchChange = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const handleAdvancedFiltersChange = useCallback((filters: AdvancedSearchFilters) => {
    dispatch(setAdvancedSearchFilters(filters));
    
    // Add to search history if filters are not empty
    if (Object.keys(filters).length > 0) {
      const historyItem = {
        id: Date.now().toString(),
        query: searchQuery,
        filters,
        timestamp: Date.now(),
      };
      dispatch(addSearchHistoryItem(historyItem));
    }
  }, [dispatch, searchQuery]);

  const handleRemoveFilter = useCallback((filterType: keyof AdvancedSearchFilters, value?: any) => {
    dispatch(updateAdvancedSearchFilter({ key: filterType, value }));
  }, [dispatch]);

  const handleClearAllFilters = useCallback(() => {
    dispatch(clearAdvancedSearchFilters());
    dispatch(setSearchQuery(''));
  }, [dispatch]);

  const handleSavePreset = useCallback((preset: Omit<SavedSearchPreset, 'id'>) => {
    const newPreset: SavedSearchPreset = {
      ...preset,
      id: Date.now().toString(),
    };
    dispatch(addSavedSearchPreset(newPreset));
  }, [dispatch]);

  const handleApplyPreset = useCallback((preset: SavedSearchPreset) => {
    dispatch(setAdvancedSearchFilters(preset.filters));
  }, [dispatch]);

  const handleDeletePreset = useCallback((presetId: string) => {
    dispatch(removeSavedSearchPreset(presetId));
  }, [dispatch]);

  const handleClearHistory = useCallback(() => {
    dispatch(clearSearchHistory());
  }, [dispatch]);

  const hasActiveAdvancedFilters = Object.keys(advancedFilters).length > 0;

  return (
    <div className="space-y-4">
      {/* Enhanced Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex flex-1 gap-2 items-center w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {(searchQuery || hasActiveAdvancedFilters) && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-6 w-6 p-0 -translate-y-1/2"
                onClick={handleClearAllFilters}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Advanced Search Button */}
          <Button
            variant={hasActiveAdvancedFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAdvancedSearch(true)}
            className="shrink-0"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advanced
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-background text-foreground rounded-full px-1.5 py-0.5 text-xs">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Pills */}
      {hasActiveAdvancedFilters && (
        <FilterPills
          filters={advancedFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
          className="mb-4"
        />
      )}

      {/* Legacy Task Controls */}
      <TaskControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        {...props}
      />

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        filters={advancedFilters}
        onFiltersChange={handleAdvancedFiltersChange}
        savedPresets={savedPresets}
        searchHistory={searchHistory}
        availableTags={availableTags}
        onSavePreset={handleSavePreset}
        onApplyPreset={handleApplyPreset}
        onDeletePreset={handleDeletePreset}
        onClearHistory={handleClearHistory}
        onClearAllFilters={handleClearAllFilters}
      />
    </div>
  );
}