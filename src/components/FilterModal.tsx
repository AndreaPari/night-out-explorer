import React from 'react';
import { Filter, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category: string;
    cuisine: string;
    zone: string;
    rating: number;
  };
  onFiltersChange: (filters: any) => void;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'dinner', label: '🍽️ Dinner' },
  { value: 'cocktail', label: '🍸 Cocktail Bar' },
  { value: 'bar', label: '🍺 Bar' },
  { value: 'aperitivo', label: '🥂 Aperitivo' },
  { value: 'club', label: '💃 Club' },
  { value: 'other', label: '✨ Other' }
];

const cuisineTypes = [
  { value: 'all', label: 'All Cuisines' },
  { value: 'italian', label: '🇮🇹 Italian' },
  { value: 'asian', label: '🥢 Asian' },
  { value: 'mediterranean', label: '🫒 Mediterranean' },
  { value: 'french', label: '🇫🇷 French' },
  { value: 'american', label: '🇺🇸 American' },
  { value: 'mexican', label: '🌮 Mexican' },
  { value: 'indian', label: '🇮🇳 Indian' },
  { value: 'fusion', label: '🌍 Fusion' },
  { value: 'other', label: '🍴 Other' }
];

export const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}) => {
  const handleFilterChange = (key: string, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: '',
      cuisine: '',
      zone: '',
      rating: 0
    });
  };

  const renderStarFilter = () => {
    return (
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => handleFilterChange('rating', 0)}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            filters.rating === 0 
              ? 'bg-purple-500 text-white' 
              : 'bg-white/10 text-purple-200 hover:bg-white/20'
          }`}
        >
          Any
        </button>
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i + 1}
            type="button"
            onClick={() => handleFilterChange('rating', i + 1)}
            className={`px-2 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
              filters.rating === i + 1 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/10 text-purple-200 hover:bg-white/20'
            }`}
          >
            {i + 1}+
            <Star className="h-3 w-3 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 0
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-900 to-blue-900 border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-400" />
              Filter Spots
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-purple-200 hover:text-white hover:bg-white/10"
              >
                Clear All
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label className="text-purple-200 font-medium">Category</Label>
            <Select 
              value={filters.category || 'all'} 
              onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-purple-900 border-white/20">
                {categories.map((cat) => (
                  <SelectItem 
                    key={cat.value} 
                    value={cat.value} 
                    className="text-white hover:bg-white/10"
                  >
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cuisine Filter */}
          <div className="space-y-2">
            <Label className="text-purple-200 font-medium">Cuisine</Label>
            <Select 
              value={filters.cuisine || 'all'} 
              onValueChange={(value) => handleFilterChange('cuisine', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent className="bg-purple-900 border-white/20">
                {cuisineTypes.map((cuisine) => (
                  <SelectItem 
                    key={cuisine.value} 
                    value={cuisine.value} 
                    className="text-white hover:bg-white/10"
                  >
                    {cuisine.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Zone Filter */}
          <div className="space-y-2">
            <Label htmlFor="zone-filter" className="text-purple-200 font-medium">
              Zone/Neighborhood
            </Label>
            <Input
              id="zone-filter"
              value={filters.zone}
              onChange={(e) => handleFilterChange('zone', e.target.value)}
              placeholder="Filter by zone name"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <Label className="text-purple-200 font-medium">Minimum Rating</Label>
            {renderStarFilter()}
          </div>

          {/* Apply Button */}
          <div className="pt-4">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Apply Filters
              {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
