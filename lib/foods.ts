export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  category: string;
}

export const FOODS: Food[] = [
  // Staples
  { id: 'banana', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, servingSize: '1 medium', category: 'Fruits' },
  { id: 'peanut_butter', name: 'Peanut Butter', calories: 188, protein: 8, carbs: 6, fat: 16, servingSize: '2 tbsp', category: 'Proteins' },
  { id: 'almonds', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, servingSize: '1 oz (23 nuts)', category: 'Nuts' },
  { id: 'dates', name: 'Dates', calories: 66, protein: 0.4, carbs: 18, fat: 0, servingSize: '1 date', category: 'Fruits' },
  { id: 'milk_whole', name: 'Whole Milk', calories: 149, protein: 8, carbs: 12, fat: 8, servingSize: '1 cup', category: 'Dairy' },
  
  // Pakistani Foods
  { id: 'roti', name: 'Roti (Chapati)', calories: 120, protein: 3, carbs: 24, fat: 1, servingSize: '1 medium', category: 'Grains' },
  { id: 'naan', name: 'Naan', calories: 262, protein: 7, carbs: 48, fat: 4, servingSize: '1 piece', category: 'Grains' },
  { id: 'daal', name: 'Daal (Lentils)', calories: 180, protein: 12, carbs: 28, fat: 2, servingSize: '1 cup', category: 'Proteins' },
  { id: 'chicken_curry', name: 'Chicken Curry', calories: 280, protein: 25, carbs: 8, fat: 16, servingSize: '1 cup', category: 'Proteins' },
  { id: 'biryani', name: 'Chicken Biryani', calories: 450, protein: 18, carbs: 55, fat: 18, servingSize: '1 plate', category: 'Rice' },
  { id: 'kebab', name: 'Seekh Kebab', calories: 170, protein: 16, carbs: 2, fat: 11, servingSize: '1 skewer', category: 'Proteins' },
  { id: 'raita', name: 'Raita', calories: 80, protein: 4, carbs: 8, fat: 3, servingSize: '1/2 cup', category: 'Dairy' },
  
  // Common Foods
  { id: 'rice_white', name: 'White Rice', calories: 205, protein: 4, carbs: 45, fat: 0.5, servingSize: '1 cup cooked', category: 'Grains' },
  { id: 'egg', name: 'Egg', calories: 78, protein: 6, carbs: 0.6, fat: 5, servingSize: '1 large', category: 'Proteins' },
  { id: 'oats', name: 'Oats', calories: 150, protein: 5, carbs: 27, fat: 3, servingSize: '1/2 cup dry', category: 'Grains' },
];

export const CATEGORIES = Array.from(new Set(FOODS.map(f => f.category)));

export function searchFoods(query: string): Food[] {
  const lowerQuery = query.toLowerCase();
  return FOODS.filter(food => 
    food.name.toLowerCase().includes(lowerQuery) ||
    food.category.toLowerCase().includes(lowerQuery)
  );
}

export function getFoodById(id: string): Food | undefined {
  return FOODS.find(f => f.id === id);
}
