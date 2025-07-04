
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { NightlifeSpot } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (spots: Omit<NightlifeSpot, 'id' | 'dateAdded'>[]) => void;
}

export const BulkImportModal = ({ isOpen, onClose, onImport }: BulkImportModalProps) => {
  const [jsonText, setJsonText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleImport = async () => {
    if (!jsonText.trim()) {
      setError('Please enter JSON data');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = JSON.parse(jsonText);
      
      // Validate that it's an array
      if (!Array.isArray(data)) {
        throw new Error('JSON must be an array of spots');
      }

      // Validate each spot has required fields
      const validSpots = data.map((spot, index) => {
        if (!spot.name || !spot.city || !spot.category) {
          throw new Error(`Spot at index ${index} is missing required fields (name, city, category)`);
        }
        
        return {
          name: spot.name,
          city: spot.city,
          category: spot.category,
          cuisine: spot.cuisine || '',
          zone: spot.zone || '',
          tags: Array.isArray(spot.tags) ? spot.tags : [],
          comments: spot.comments || '',
          rating: typeof spot.rating === 'number' ? spot.rating : 0,
          latitude: spot.latitude || undefined,
          longitude: spot.longitude || undefined,
        };
      });

      onImport(validSpots);
      toast({
        title: "Import successful",
        description: `Successfully imported ${validSpots.length} spots`,
      });
      
      setJsonText('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setJsonText(text);
        setError('');
      };
      reader.readAsText(file);
    } else {
      setError('Please select a valid JSON file');
    }
  };

  const exampleJson = `[
  {
    "name": "Example Restaurant",
    "city": "Milano",
    "category": "dinner",
    "cuisine": "italian",
    "zone": "Centro",
    "tags": ["pasta", "romantic"],
    "comments": "Great place for dinner",
    "rating": 5
  }
]`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Import Spots
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          <div className="text-center text-gray-400">or</div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paste JSON Data
            </label>
            <Textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste your JSON data here..."
              className="min-h-[200px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Expected JSON Format:</h4>
            <pre className="text-xs text-gray-400 overflow-x-auto">
              {exampleJson}
            </pre>
            <p className="text-xs text-gray-500 mt-2">
              Required fields: name, city, category. Other fields are optional.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleImport}
              disabled={isLoading || !jsonText.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Import Spots
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
