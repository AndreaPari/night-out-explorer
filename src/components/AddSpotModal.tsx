
import React, { useState } from 'react';
import { X, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NightlifeSpot } from '@/pages/Index';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (spot: Omit<NightlifeSpot, 'id' | 'dateAdded'>) => void;
}

const categories = [
  { value: 'dinner', label: '🍽️ Dinner' },
  { value: 'cocktail', label: '🍸 Cocktail Bar' },
  { value: 'bar', label: '🍺 Bar' },
  { value: 'aperitivo', label: '🥂 Aperitivo' },
  { value: 'club', label: '💃 Club' },
  { value: 'other', label: '✨ Other' }
];

const cuisineTypes = [
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

export const AddSpotModal: React.FC<AddSpotModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    category: '',
    cuisine: '',
    zone: '',
    tags: '',
    comments: '',
    rating: 0,
    latitude: '',
    longitude: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.city || !formData.category) {
      return;
    }

    const spotData = {
      name: formData.name,
      city: formData.city,
      category: formData.category,
      cuisine: formData.cuisine,
      zone: formData.zone,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      comments: formData.comments,
      rating: formData.rating,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
    };

    onAdd(spotData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      category: '',
      cuisine: '',
      zone: '',
      tags: '',
      comments: '',
      rating: 0,
      latitude: '',
      longitude: ''
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStarRating = () => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleInputChange('rating', i + 1)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`h-6 w-6 ${
                i < formData.rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-400 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-900 to-blue-900 border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="h-6 w-6 text-purple-400" />
            Add New Spot
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-purple-200">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter spot name"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-purple-200">
                City *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Category and Cuisine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-purple-200">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-purple-900 border-white/20">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-purple-200">Cuisine Type</Label>
              <Select value={formData.cuisine} onValueChange={(value) => handleInputChange('cuisine', value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent className="bg-purple-900 border-white/20">
                  {cuisineTypes.map((cuisine) => (
                    <SelectItem key={cuisine.value} value={cuisine.value} className="text-white hover:bg-white/10">
                      {cuisine.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Zone and Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zone" className="text-purple-200">
                Zone/Neighborhood
              </Label>
              <Input
                id="zone"
                value={formData.zone}
                onChange={(e) => handleInputChange('zone', e.target.value)}
                placeholder="e.g., Isola, Boulevard, Downtown"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-purple-200">Rating</Label>
              <div className="flex items-center gap-2">
                {renderStarRating()}
                <span className="text-sm text-purple-200 ml-2">
                  {formData.rating === 0 ? 'No rating' : `${formData.rating} star${formData.rating > 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-purple-200">
              Tags
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas (e.g., rooftop, live music, romantic)"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <p className="text-xs text-purple-300">Separate multiple tags with commas</p>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-purple-200">
                Latitude (Optional)
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
                placeholder="e.g., 45.4642"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-purple-200">
                Longitude (Optional)
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                placeholder="e.g., 9.1900"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-purple-200">
              Comments
            </Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              placeholder="Add your personal notes about this spot..."
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              disabled={!formData.name || !formData.city || !formData.category}
            >
              Add Spot
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
