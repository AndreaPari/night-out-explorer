
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Star, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddSpotModal } from '@/components/AddSpotModal';
import { FilterModal } from '@/components/FilterModal';

export interface NightlifeSpot {
  id: string;
  name: string;
  city: string;
  category: string;
  cuisine: string;
  zone: string;
  tags: string[];
  comments: string;
  rating: number;
  latitude?: number;
  longitude?: number;
  dateAdded: string;
}

const Index = () => {
  const [spots, setSpots] = useState<NightlifeSpot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<NightlifeSpot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    cuisine: '',
    zone: '',
    rating: 0
  });

  // Load spots from localStorage on component mount
  useEffect(() => {
    const savedSpots = localStorage.getItem('nightlife-spots');
    if (savedSpots) {
      const parsedSpots = JSON.parse(savedSpots);
      setSpots(parsedSpots);
      setFilteredSpots(parsedSpots);
    }
  }, []);

  // Save spots to localStorage whenever spots change
  useEffect(() => {
    localStorage.setItem('nightlife-spots', JSON.stringify(spots));
  }, [spots]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...spots];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(spot => 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        spot.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (activeFilters.category) {
      filtered = filtered.filter(spot => spot.category === activeFilters.category);
    }
    if (activeFilters.cuisine) {
      filtered = filtered.filter(spot => spot.cuisine === activeFilters.cuisine);
    }
    if (activeFilters.zone) {
      filtered = filtered.filter(spot => spot.zone.toLowerCase().includes(activeFilters.zone.toLowerCase()));
    }
    if (activeFilters.rating > 0) {
      filtered = filtered.filter(spot => spot.rating >= activeFilters.rating);
    }

    // Sort by rating (highest first) then by name
    filtered.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return a.name.localeCompare(b.name);
    });

    setFilteredSpots(filtered);
  }, [spots, searchQuery, activeFilters]);

  const addSpot = (newSpot: Omit<NightlifeSpot, 'id' | 'dateAdded'>) => {
    const spot: NightlifeSpot = {
      ...newSpot,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    };
    setSpots(prev => [...prev, spot]);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      dinner: 'bg-orange-500',
      cocktail: 'bg-purple-500',
      bar: 'bg-blue-500',
      aperitivo: 'bg-pink-500',
      club: 'bg-red-500',
      other: 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const clearFilters = () => {
    setActiveFilters({
      category: '',
      cuisine: '',
      zone: '',
      rating: 0
    });
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(activeFilters).filter(value => 
    value !== '' && value !== 0
  ).length + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">NightSpots</h1>
              <p className="text-purple-200 text-sm">Your nightlife companion</p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full h-12 w-12 p-0"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search spots, tags, or neighborhoods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-purple-200 hover:text-white hover:bg-white/10"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 text-center">
          <p className="text-purple-200">
            {filteredSpots.length} {filteredSpots.length === 1 ? 'spot' : 'spots'} 
            {searchQuery || activeFiltersCount > 0 ? ` found` : ` saved`}
          </p>
        </div>

        {/* Spots Grid */}
        {filteredSpots.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌃</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {spots.length === 0 ? "No spots saved yet" : "No spots match your search"}
            </h3>
            <p className="text-purple-200 mb-6">
              {spots.length === 0 
                ? "Start building your nightlife collection!" 
                : "Try adjusting your search or filters"
              }
            </p>
            {spots.length === 0 && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Spot
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredSpots.map((spot) => (
              <Card key={spot.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-200 hover:scale-[1.02]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-1">{spot.name}</CardTitle>
                      <div className="flex items-center gap-2 text-purple-200 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{spot.zone}, {spot.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(spot.rating)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Category and Cuisine */}
                    <div className="flex gap-2">
                      <Badge className={`${getCategoryColor(spot.category)} text-white border-0`}>
                        {spot.category}
                      </Badge>
                      {spot.cuisine && (
                        <Badge variant="outline" className="border-white/30 text-purple-200">
                          {spot.cuisine}
                        </Badge>
                      )}
                    </div>

                    {/* Tags */}
                    {spot.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {spot.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-white/20 text-white text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {spot.tags.length > 3 && (
                          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                            +{spot.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Comments */}
                    {spot.comments && (
                      <p className="text-purple-100 text-sm italic line-clamp-2">
                        "{spot.comments}"
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddSpotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addSpot}
      />
      
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={activeFilters}
        onFiltersChange={setActiveFilters}
      />
    </div>
  );
};

export default Index;
