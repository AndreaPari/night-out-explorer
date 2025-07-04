import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Star, Tag, Upload, Edit, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddSpotModal } from '@/components/AddSpotModal';
import { FilterModal } from '@/components/FilterModal';
import { BulkImportModal } from '@/components/BulkImportModal';

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
  price: number;
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
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<NightlifeSpot | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    cuisine: '',
    zone: '',
    rating: 0
  });

  // Load spots from localStorage on component mount, with initial data fallback
  useEffect(() => {
    const savedSpots = localStorage.getItem('nightlife-spots');
    if (savedSpots) {
      try {
        const parsedSpots = JSON.parse(savedSpots);
        // Assicuriamoci che tutti gli spot abbiano il campo price
        const spotsWithPrice = parsedSpots.map((spot: any) => ({
          ...spot,
          price: typeof spot.price === 'number' && spot.price > 0 ? spot.price : 3
        }));
        setSpots(spotsWithPrice);
        setFilteredSpots(spotsWithPrice);
      } catch (error) {
        console.error('Error parsing saved spots:', error);
        // Carico i dati dal JSON
        fetch('/spots.json')
          .then(res => res.json())
          .then(data => {
            setSpots(data);
            setFilteredSpots(data);
            localStorage.setItem('nightlife-spots', JSON.stringify(data));
          });
      }
    } else {
      // Carico i dati dal JSON
      fetch('/spots.json')
        .then(res => res.json())
        .then(data => {
          setSpots(data);
          setFilteredSpots(data);
          localStorage.setItem('nightlife-spots', JSON.stringify(data));
        });
    }
  }, []);

  // Save spots to localStorage whenever spots change
  useEffect(() => {
    localStorage.setItem('nightlife-spots', JSON.stringify(spots));
  }, [spots]);

  useEffect(() => {
    let filtered = [...spots];

    if (searchQuery) {
      filtered = filtered.filter(spot => 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        spot.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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

  const updateSpot = (updatedSpot: Omit<NightlifeSpot, 'id' | 'dateAdded'>) => {
    if (editingSpot) {
      setSpots(prev => prev.map(spot => 
        spot.id === editingSpot.id 
          ? { ...spot, ...updatedSpot }
          : spot
      ));
      setEditingSpot(null);
    }
  };

  const handleEditSpot = (spot: NightlifeSpot) => {
    setEditingSpot(spot);
    setIsAddModalOpen(true);
  };

  const bulkImportSpots = (newSpots: Omit<NightlifeSpot, 'id' | 'dateAdded'>[]) => {
    const spotsWithIds = newSpots.map((spot, index) => ({
      ...spot,
      id: (Date.now() + index).toString(),
      dateAdded: new Date().toISOString()
    }));
    setSpots(prev => [...prev, ...spotsWithIds]);
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

  const renderPrice = (price: number) => {
    // Assicuriamoci che price sia un numero valido
    const validPrice = typeof price === 'number' && price > 0 ? price : 3;
    
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < validPrice ? 'text-green-400' : 'text-gray-400'
        }`}
      >
        €
      </span>
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
                              <h1 className="text-2xl font-bold text-white">PCC - Spots</h1>
              <p className="text-purple-200 text-sm">Your nightlife companion</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  localStorage.removeItem('nightlife-spots');
                  window.location.reload();
                }}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-full h-12 w-12 p-0"
                title="Reset Data"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setIsBulkImportModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full h-12 w-12 p-0"
                title="Bulk Import"
              >
                <Upload className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full h-12 w-12 p-0"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
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

        <div className="mb-6 text-center">
          <p className="text-purple-200">
            {filteredSpots.length} {filteredSpots.length === 1 ? 'spot' : 'spots'} 
            {searchQuery || activeFiltersCount > 0 ? ` found` : ` saved`}
          </p>
        </div>

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
              <Card key={spot.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-1">{spot.name}</CardTitle>
                      <div className="flex items-center gap-2 text-purple-200 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{spot.zone}{spot.zone && ', '}{spot.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(spot.rating)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-purple-200 text-sm mr-1">Prezzo:</span>
                    {renderPrice(spot.price)}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
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

                    {spot.comments && (
                      <p className="text-purple-100 text-sm italic line-clamp-2">
                        "{spot.comments}"
                      </p>
                    )}
                  </div>
                </CardContent>

                {/* Edit Button */}
                <Button
                  onClick={() => handleEditSpot(spot)}
                  className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full"
                  variant="ghost"
                >
                  <Edit className="h-4 w-4 text-white" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AddSpotModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSpot(null);
        }}
        onAdd={editingSpot ? updateSpot : addSpot}
        editingSpot={editingSpot}
      />
      
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={activeFilters}
        onFiltersChange={setActiveFilters}
      />

      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onImport={bulkImportSpots}
      />
    </div>
  );
};

export default Index;
