"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, X, Search, Filter, Clock, Tag, ChevronDown, Star, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  AdvancedSearchFilters, 
  TaskStatus, 
  TaskPriority, 
  DateRange,
  SavedSearchPreset,
  SearchHistoryItem
} from '@/types';
import { format } from 'date-fns';

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedSearchFilters;
  onFiltersChange: (filters: AdvancedSearchFilters) => void;
  savedPresets: SavedSearchPreset[];
  searchHistory: SearchHistoryItem[];
  availableTags: string[];
  onSavePreset?: (preset: Omit<SavedSearchPreset, 'id'>) => void;
  onApplyPreset?: (preset: SavedSearchPreset) => void;
  onDeletePreset?: (presetId: string) => void;
  onClearHistory?: () => void;
  onClearAllFilters?: () => void;
}

export function AdvancedSearch({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  savedPresets,
  searchHistory,
  availableTags,
  onSavePreset,
  onApplyPreset,
  onDeletePreset,
  onClearHistory,
  onClearAllFilters,
}: AdvancedSearchProps) {
  const [localFilters, setLocalFilters] = useState<AdvancedSearchFilters>(filters);
  const [presetName, setPresetName] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = (key: keyof AdvancedSearchFilters, value: any) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearAllFilters = () => {
    const emptyFilters: AdvancedSearchFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onClearAllFilters?.();
  };

  const saveCurrentPreset = () => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset({
        name: presetName.trim(),
        filters: localFilters,
      });
      setPresetName('');
      setShowPresetInput(false);
    }
  };

  const toggleStatus = (status: TaskStatus) => {
    const currentStatuses = localFilters.status || [];
    const updated = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    updateFilter('status', updated.length > 0 ? updated : undefined);
  };

  const togglePriority = (priority: TaskPriority) => {
    const currentPriorities = localFilters.priority || [];
    const updated = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    updateFilter('priority', updated.length > 0 ? updated : undefined);
  };

  const toggleTag = (tag: string) => {
    const currentTags = localFilters.tags || [];
    const updated = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateFilter('tags', updated.length > 0 ? updated : undefined);
  };

  const updateDateRange = (type: 'createdDateRange' | 'dueDateRange', range: DateRange) => {
    updateFilter(type, range.from || range.to ? range : undefined);
  };

  const formatDateRange = (range?: DateRange) => {
    if (!range?.from && !range?.to) return 'Select date range';
    if (range.from && range.to) {
      return `${format(range.from, 'MMM dd, yyyy')} - ${format(range.to, 'MMM dd, yyyy')}`;
    }
    if (range.from) return `From ${format(range.from, 'MMM dd, yyyy')}`;
    if (range.to) return `Until ${format(range.to, 'MMM dd, yyyy')}`;
    return 'Select date range';
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.text) count++;
    if (localFilters.status?.length) count++;
    if (localFilters.priority?.length) count++;
    if (localFilters.tags?.length) count++;
    if (localFilters.createdDateRange) count++;
    if (localFilters.dueDateRange) count++;
    if (localFilters.isOverdue) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search & Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {/* Saved Presets */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Star className="mr-2 h-4 w-4" />
                    Saved Searches
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Saved Search Presets</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {savedPresets.map(preset => (
                    <DropdownMenuItem
                      key={preset.id}
                      onClick={() => {
                        setLocalFilters(preset.filters);
                        onApplyPreset?.(preset);
                      }}
                      className="flex items-center justify-between"
                    >
                      <span>{preset.name}</span>
                      {preset.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                  {savedPresets.length === 0 && (
                    <DropdownMenuItem disabled>No saved searches</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search History */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <History className="mr-2 h-4 w-4" />
                    Recent
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Search History
                    {searchHistory.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onClearHistory}
                        className="h-auto p-1 text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {searchHistory.slice(0, 5).map(item => (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => setLocalFilters(item.filters)}
                      className="flex flex-col items-start py-2"
                    >
                      <span className="font-medium">{item.query || 'Advanced Search'}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(item.timestamp), 'MMM dd, HH:mm')}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  {searchHistory.length === 0 && (
                    <DropdownMenuItem disabled>No recent searches</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPresetInput(!showPresetInput)}
              >
                Save Search
              </Button>
            </div>
          </div>

          {/* Save Preset Input */}
          {showPresetInput && (
            <div className="flex gap-2 p-3 bg-muted rounded-lg">
              <Input
                placeholder="Enter preset name..."
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={saveCurrentPreset} disabled={!presetName.trim()}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowPresetInput(false)}>
                Cancel
              </Button>
            </div>
          )}

          {/* Text Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Text Search</label>
            <Input
              placeholder="Search in title, description, and tags..."
              value={localFilters.text || ''}
              onChange={(e) => updateFilter('text', e.target.value || undefined)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Status</label>
              <div className="space-y-2">
                {Object.values(TaskStatus).map(status => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={localFilters.status?.includes(status) || false}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                    <label htmlFor={`status-${status}`} className="text-sm capitalize">
                      {status.replace('-', ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Priority</label>
              <div className="space-y-2">
                {Object.values(TaskPriority).map(priority => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={localFilters.priority?.includes(priority) || false}
                      onCheckedChange={() => togglePriority(priority)}
                    />
                    <label htmlFor={`priority-${priority}`} className="text-sm capitalize">
                      {priority}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Button
                  key={tag}
                  variant={localFilters.tags?.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className="h-8"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Ranges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Created Date Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Created Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDateRange(localFilters.createdDateRange)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: localFilters.createdDateRange?.from,
                      to: localFilters.createdDateRange?.to,
                    }}
                    onSelect={(range) => updateDateRange('createdDateRange', range || {})}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Due Date Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDateRange(localFilters.dueDateRange)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: localFilters.dueDateRange?.from,
                      to: localFilters.dueDateRange?.to,
                    }}
                    onSelect={(range) => updateDateRange('dueDateRange', range || {})}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Special Filters */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Special Filters</label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="overdue"
                checked={localFilters.isOverdue || false}
                onCheckedChange={(checked) => updateFilter('isOverdue', checked || undefined)}
              />
              <label htmlFor="overdue" className="text-sm">
                <Clock className="mr-1 h-3 w-3 inline" />
                Show only overdue tasks
              </label>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={applyFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}