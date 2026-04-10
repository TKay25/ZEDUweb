import React, { useState, useEffect } from 'react';
import {
  X, Calendar, SortAsc, SortDesc, SlidersHorizontal, RotateCcw
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'boolean' | 'custom';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface FilterValue {
  [key: string]: any;
}

interface FilterBarProps {
  filters: FilterOption[];
  values: FilterValue;
  onChange: (values: FilterValue) => void;
  onApply?: () => void;
  onReset?: () => void;
  sortOptions?: Array<{ value: string; label: string }>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  resultCount?: number;
  totalCount?: number;
  loading?: boolean;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  values,
  onChange,
  onApply,
  onReset,
  sortOptions,
  sortBy,
  sortOrder = 'asc',
  onSortChange,
  resultCount,
  totalCount,
  loading = false,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);
  const [localValues, setLocalValues] = useState<FilterValue>(values);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Update local values when props change
  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  // Calculate active filter count
  useEffect(() => {
    const count = Object.entries(localValues).filter(([_key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return value;
      return value !== undefined && value !== null && value !== '';
    }).length;
    setActiveFilterCount(count);
  }, [localValues]);

  const handleFilterChange = (filterId: string, value: any) => {
    const newValues = { ...localValues, [filterId]: value };
    setLocalValues(newValues);
    onChange(newValues);
  };

  const handleClearFilter = (filterId: string) => {
    const newValues = { ...localValues };
    delete newValues[filterId];
    setLocalValues(newValues);
    onChange(newValues);
  };

  const handleClearAll = () => {
    setLocalValues({});
    onChange({});
    onReset?.();
  };

  const handleApply = () => {
    onApply?.();
  };

  const getActiveFilterLabel = (filter: FilterOption, value: any): string => {
    if (!value) return '';
    
    if (filter.type === 'select' && filter.options) {
      const option = filter.options.find(opt => opt.value === value);
      return option?.label || value;
    }
    
    if (filter.type === 'range') {
      return `${value.min || filter.min} - ${value.max || filter.max}`;
    }
    
    if (filter.type === 'date') {
      return new Date(value).toLocaleDateString();
    }
    
    return value.toString();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Bar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="relative"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2 bg-primary-600 text-white">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {Object.entries(localValues).map(([key, value]) => {
                const filter = filters.find(f => f.id === key);
                if (!filter || !value) return null;
                
                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center space-x-1 py-1"
                  >
                    <span className="text-xs font-medium">{filter.label}:</span>
                    <span className="text-xs">{getActiveFilterLabel(filter, value)}</span>
                    <button
                      onClick={() => handleClearFilter(key)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Options */}
          {sortOptions && onSortChange && (
            <div className="flex items-center space-x-2">
              <Select
                value={sortBy || ''}
                onChange={(e) => onSortChange(e.target.value, sortOrder)}
                options={sortOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                className="w-40"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSortChange(sortBy || '', sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}

          {/* Results Count */}
          {resultCount !== undefined && totalCount !== undefined && (
            <div className="text-sm text-gray-500">
              Showing {resultCount} of {totalCount} results
              {loading && <span className="ml-2">(updating...)</span>}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {expanded && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filter Options</h3>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>

                {/* Select Filter */}
                {filter.type === 'select' && (
                  <Select
                    value={localValues[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    options={filter.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
                    placeholder={filter.placeholder}
                  />
                )}

                {/* Multi-Select Filter */}
                {filter.type === 'multiselect' && (
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                    {filter.options?.map(opt => (
                      <label key={opt.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={localValues[filter.id]?.includes(opt.value)}
                          onChange={(e) => {
                            const current = localValues[filter.id] || [];
                            const updated = e.target.checked
                              ? [...current, opt.value]
                              : current.filter((v: string) => v !== opt.value);
                            handleFilterChange(filter.id, updated);
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Range Filter */}
                {filter.type === 'range' && (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      min={filter.min}
                      max={filter.max}
                      step={filter.step}
                      value={localValues[filter.id]?.min || ''}
                      onChange={(e) => handleFilterChange(filter.id, {
                        ...localValues[filter.id],
                        min: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      min={filter.min}
                      max={filter.max}
                      step={filter.step}
                      value={localValues[filter.id]?.max || ''}
                      onChange={(e) => handleFilterChange(filter.id, {
                        ...localValues[filter.id],
                        max: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                    />
                  </div>
                )}

                {/* Date Filter */}
                {filter.type === 'date' && (
                  <Input
                    type="date"
                    value={localValues[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                )}

                {/* Boolean Filter */}
                {filter.type === 'boolean' && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localValues[filter.id] || false}
                      onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                )}
              </div>
            ))}
          </div>

          {/* Apply Button */}
          {onApply && (
            <div className="flex justify-end mt-4 pt-4 border-t">
              <Button variant="primary" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};