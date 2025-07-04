import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Star, Tag, Upload, Edit, RefreshCw, ChevronDown, ChevronUp, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddSpotModal } from '@/components/AddSpotModal';
import { FilterModal } from '@/components/FilterModal';
import { BulkImportModal } from '@/components/BulkImportModal';
import { v4 as uuidv4 } from 'uuid';

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
  address: string;
  latitude?: number;
  longitude?: number;
  dateAdded: string;
}

// Funzione per calcolare la distanza tra due coordinate (in km)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type SortableField = keyof NightlifeSpot | 'distance';

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
  const [sortBy, setSortBy] = useState<{
    field: SortableField,
    direction: 'asc' | 'desc'
  }>({
    field: 'rating',
    direction: 'desc'
  });
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Load spots from localStorage on component mount, with initial data fallback
  useEffect(() => {
    const savedSpots = localStorage.getItem('nightlife-spots');
    if (savedSpots) {
      try {
        const parsedSpots = JSON.parse(savedSpots);
        // Assicuriamoci che tutti gli spot abbiano il campo price
        const spotsWithPrice = parsedSpots.map((spot: any) => ({
          ...spot,
          price: typeof spot.price === 'number' && spot.price > 0 ? spot.price : 3,
          address: spot.address || ''
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

    // Ordinamento - Create a new sorted array instead of mutating
    const sorted = [...filtered].sort((a, b) => {
      // Ordinamento per distanza
      if (sortBy.field === 'distance') {
        if (!currentLocation) return 0;
        
        // Debug: log per vedere se le coordinate sono presenti
        if (a.latitude === undefined || a.longitude === undefined) {
          console.log(`Spot ${a.name} non ha coordinate`);
        }
        if (b.latitude === undefined || b.longitude === undefined) {
          console.log(`Spot ${b.name} non ha coordinate`);
        }
        
        const aDist = (a.latitude !== undefined && a.longitude !== undefined)
          ? getDistanceFromLatLonInKm(currentLocation.lat, currentLocation.lng, a.latitude, a.longitude)
          : Infinity;
        const bDist = (b.latitude !== undefined && b.longitude !== undefined)
          ? getDistanceFromLatLonInKm(currentLocation.lat, currentLocation.lng, b.latitude, b.longitude)
          : Infinity;
        
        return sortBy.direction === 'asc' ? aDist - bDist : bDist - aDist;
      }
      let aValue = a[sortBy.field];
      let bValue = b[sortBy.field];
      
      // Gestione speciale per array (tags)
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        aValue = aValue.join(', ');
        bValue = bValue.join(', ');
      }
      
      // Gestione per stringhe
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortBy.direction === 'asc' ? comparison : -comparison;
      }
      
      // Gestione per numeri
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortBy.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Gestione per date
      if (aValue && bValue && typeof aValue === 'string' && typeof bValue === 'string') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortBy.direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      
      return 0;
    });

    setFilteredSpots(sorted);
  }, [spots, searchQuery, activeFilters, sortBy, currentLocation]);

  const addSpot = (newSpot: Omit<NightlifeSpot, 'id' | 'dateAdded'>) => {
    // Evita duplicati per nome+città
    if (spots.some(s => s.name === newSpot.name && s.city === newSpot.city)) return;
    const spot: NightlifeSpot = {
      ...newSpot,
      id: uuidv4(),
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
    const filtered = newSpots.filter(newSpot =>
      !spots.some(s => s.name === newSpot.name && s.city === newSpot.city)
    );
    const spotsWithIds = filtered.map((spot) => ({
      ...spot,
      id: uuidv4(),
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

  const handleSortChange = (field: SortableField) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field: SortableField) => {
    if (sortBy.field !== field) return null;
    return sortBy.direction === 'asc' ? '↑' : '↓';
  };

  const handleAddOrUpdateSpot = (spot: Omit<NightlifeSpot, 'id' | 'dateAdded'>) => {
    if (editingSpot) {
      updateSpot(spot);
    } else {
      addSpot(spot);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalizzazione non supportata dal browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error('Errore geolocalizzazione:', error);
        alert('Impossibile ottenere la posizione corrente');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

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
          
          <div className="flex flex-col gap-3">
            {/* Filters and Clear Button Row */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFilterModalOpen(true)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm text-sm px-3 py-2 h-9"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
              
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-purple-200 hover:text-white hover:bg-white/10 text-sm px-3 py-2 h-9"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            {/* Sort Options - Mobile First */}
            <div className="flex flex-col gap-2">
              <span className="text-purple-200 text-sm font-medium">Ordina per:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1">
                {[
                  { field: 'distance' as SortableField, label: 'Vicini a me' },
                  { field: 'name' as SortableField, label: 'Nome' },
                  { field: 'rating' as SortableField, label: 'Rating' },
                  { field: 'price' as SortableField, label: 'Prezzo' },
                  { field: 'zone' as SortableField, label: 'Zona' },
                  { field: 'category' as SortableField, label: 'Categoria' },
                  { field: 'dateAdded' as SortableField, label: 'Data' }
                ].map(({ field, label }) => (
                  <Button
                    key={field}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSortChange(field)}
                    className={`bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm text-xs px-2 py-1 h-8 ${
                      sortBy.field === field ? 'bg-purple-500/30 border-purple-300' : ''
                    }`}
                  >
                    <span className="truncate">{label}</span> {getSortIcon(field)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current Location Section - Mobile First */}
        <div className="mb-4 p-3 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-purple-200 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-medium text-sm">Posizione</h3>
                {currentLocation ? (
                  <p className="text-purple-200 text-xs truncate">
                    {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs">Non rilevata</p>
                )}
              </div>
            </div>
            <Button
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs px-3 py-1 h-8"
              size="sm"
            >
              {locationLoading ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <Navigation className="h-3 w-3" />
              )}
              <span className="ml-1">{locationLoading ? 'Rilevando...' : 'Rileva'}</span>
            </Button>
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
                        {sortBy.field === 'distance' && currentLocation && spot.latitude !== undefined && spot.longitude !== undefined && (
                          <span className="text-green-300 text-xs">
                            ({getDistanceFromLatLonInKm(currentLocation.lat, currentLocation.lng, spot.latitude, spot.longitude).toFixed(1)}km)
                          </span>
                        )}
                      </div>
                      <div className="text-purple-200 text-xs mt-1">
                        📍 {spot.address ? spot.address : <span className="text-gray-400 italic">Indirizzo non disponibile</span>}
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

        {sortBy.field === 'distance' && !currentLocation && (
          <div className="text-center text-yellow-300 text-sm mt-2">
            Per ordinare per distanza, rileva prima la posizione!
          </div>
        )}
      </main>

      <AddSpotModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSpot(null);
        }}
        onAdd={handleAddOrUpdateSpot}
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
