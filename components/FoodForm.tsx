'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FOODS, searchFoods, CATEGORIES } from '@/lib/foods';
import { X, Plus, Utensils } from 'lucide-react';

interface FoodFormProps {
  onAddEntry: (entry: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    quantity: number;
  }) => void;
  existingEntries: Array<{ id: string; name: string; calories: number }> | [];
  onRemoveEntry?: (id: string) => void;
}

export function FoodForm({ onAddEntry, existingEntries = [], onRemoveEntry }: FoodFormProps) {
  const [mode, setMode] = useState<'quick' | 'custom'>('quick');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quantity, setQuantity] = useState(1);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const filteredFoods = searchFoods(searchQuery).filter(food => 
    selectedCategory === 'All' || food.category === food.category
  );

  const handleQuickAdd = (foodId: string) => {
    const food = FOODS.find(f => f.id === foodId);
    if (!food) return;

    onAddEntry({
      name: food.name,
      calories: food.calories * quantity,
      protein: food.protein * quantity,
      carbs: food.carbs * quantity,
      fat: food.fat * quantity,
      quantity,
    });

    setSelectedFood(null);
    setQuantity(1);
  };

  const handleCustomAdd = () => {
    onAddEntry({
      name: customFood.name,
      calories: parseFloat(customFood.calories) || 0,
      protein: parseFloat(customFood.protein) || 0,
      carbs: parseFloat(customFood.carbs) || 0,
      fat: parseFloat(customFood.fat) || 0,
      quantity: 1,
    });

    setCustomFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    });
  };

  return (
    <div className="space-y-5">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-secondary rounded-lg">
        <Button
          variant={mode === 'quick' ? 'default' : 'ghost'}
          onClick={() => setMode('quick')}
          className="flex-1"
        >
          Quick Add
        </Button>
        <Button
          variant={mode === 'custom' ? 'default' : 'ghost'}
          onClick={() => setMode('custom')}
          className="flex-1"
        >
          Custom
        </Button>
      </div>

      {mode === 'quick' ? (
        <div className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Search foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'All' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory('All')}
              className={selectedCategory === 'All' ? 'bg-primary text-primary-foreground' : ''}
            >
              All
            </Button>
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-primary text-primary-foreground' : ''}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <Label className="text-sm text-muted-foreground">Quantity:</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8"
              >
                -
              </Button>
              <span className="w-8 text-center font-mono">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8"
              >
                +
              </Button>
            </div>
          </div>

          {/* Food Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {filteredFoods.map(food => (
              <Card
                key={food.id}
                className={`cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedFood === food.id 
                    ? 'bg-primary/20 border-primary' 
                    : 'bg-card border-border hover:bg-secondary/50'
                }`}
                onClick={() => setSelectedFood(food.id)}
              >
                <CardContent className="p-3">
                  <div className="font-medium text-sm truncate">{food.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {food.calories} kcal
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Button */}
          {selectedFood && (
            <Button 
              className="w-full" 
              onClick={() => handleQuickAdd(selectedFood)}
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add {FOODS.find(f => f.id === selectedFood)?.name} ×{quantity}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Food Name</Label>
            <Input
              placeholder="e.g., Grilled Chicken"
              value={customFood.name}
              onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Calories</Label>
              <Input
                type="number"
                placeholder="0"
                value={customFood.calories}
                onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Protein (g)</Label>
              <Input
                type="number"
                placeholder="0"
                value={customFood.protein}
                onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Carbs (g)</Label>
              <Input
                type="number"
                placeholder="0"
                value={customFood.carbs}
                onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Fat (g)</Label>
              <Input
                type="number"
                placeholder="0"
                value={customFood.fat}
                onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
              />
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={handleCustomAdd}
            size="lg"
            disabled={!customFood.name || !customFood.calories}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Food
          </Button>
        </div>
      )}

      {/* Existing Entries */}
      {existingEntries.length > 0 && onRemoveEntry && (
        <div className="space-y-3 pt-4 border-t border-border">
          <Label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Utensils className="h-4 w-4" />
            Today's Entries ({existingEntries.length})
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {existingEntries.map(entry => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
              >
                <div>
                  <div className="text-sm font-medium">{entry.name}</div>
                  <div className="text-xs text-muted-foreground">{entry.calories} kcal</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveEntry(entry.id)}
                  className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
