import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, X, Plus } from 'lucide-react';
import { NightlifeSpot } from '@/pages/Index';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (spot: Omit<NightlifeSpot, 'id' | 'dateAdded'>) => void;
  editingSpot?: NightlifeSpot | null;
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
  { value: 'not-specified', label: 'Not specified' },
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

export const AddSpotModal: React.FC<AddSpotModalProps> = ({ 
  isOpen, 
  onClose, 
  onAdd,
  editingSpot 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    city: 'Milano',
    category: '',
    cuisine: 'not-specified',
    zone: '',
    comments: '',
    rating: 0,
    price: 3,
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Load editing spot data when modal opens
  useEffect(() => {
    if (editingSpot) {
      setFormData({
        name: editingSpot.name,
        city: editingSpot.city,
        category: editingSpot.category,
        cuisine: editingSpot.cuisine || 'not-specified',
        zone: editingSpot.zone,
        comments: editingSpot.comments,
        rating: editingSpot.rating,
        price: editingSpot.price,
        latitude: editingSpot.latitude,
        longitude: editingSpot.longitude,
      });
      setTags(editingSpot.tags);
    } else {
      // Reset form for new spot
      setFormData({
        name: '',
        city: 'Milano',
        category: '',
        cuisine: 'not-specified',
        zone: '',
        comments: '',
        rating: 0,
        price: 3,
        latitude: undefined,
        longitude: undefined,
      });
      setTags([]);
    }
  }, [editingSpot, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    const spotData = {
      ...formData,
      cuisine: formData.cuisine === 'not-specified' ? '' : formData.cuisine,
      tags: tags
    };
    onAdd(spotData);
    onClose();
  };

  const renderStarRating = () => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
            className={`p-1 rounded transition-colors ${
              i < formData.rating 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <Star className="h-4 w-4 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const renderPriceRating = () => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, price: i + 1 }))}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              i < formData.price 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            €
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-900 to-blue-900 border-white/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
            {editingSpot ? 'Edit Spot' : 'Add New Spot'}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Spot name"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              disabled
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-purple-900 border-white/20">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="text-white hover:bg-white/10">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Cuisine</Label>
            <Select value={formData.cuisine} onValueChange={(value) => handleSelectChange('cuisine', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a cuisine (optional)" />
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

          <div>
            <Label htmlFor="zone">Zone/Neighborhood</Label>
            <Input
              type="text"
              id="zone"
              name="zone"
              value={formData.zone}
              onChange={handleInputChange}
              placeholder="Zone or neighborhood"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                id="tags"
                placeholder="Add a tag"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <Button type="button" onClick={addTag} size="sm" className="bg-purple-500 hover:bg-purple-400 text-white">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} className="bg-purple-700 text-white rounded-full px-2 py-1 text-xs flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-purple-100">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              placeholder="Additional comments"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[80px]"
            />
          </div>

          <div>
            <Label>Rating</Label>
            {renderStarRating()}
          </div>

          <div>
            <Label>Price Range</Label>
            {renderPriceRating()}
          </div>

          <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            {editingSpot ? 'Update Spot' : 'Add Spot'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
