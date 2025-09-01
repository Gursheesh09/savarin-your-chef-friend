import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Plus, X, Download, Share, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  isChecked: boolean;
  estimatedPrice?: number;
}

const initialItems: ShoppingItem[] = [
  { id: "1", name: "Olive Oil", quantity: "1 bottle", category: "Oils & Condiments", isChecked: false, estimatedPrice: 8.99 },
  { id: "2", name: "Yellow Onions", quantity: "2 lbs", category: "Produce", isChecked: false, estimatedPrice: 3.49 },
  { id: "3", name: "Garlic", quantity: "1 head", category: "Produce", isChecked: false, estimatedPrice: 1.29 },
  { id: "4", name: "Crushed Tomatoes", quantity: "2 cans", category: "Canned Goods", isChecked: false, estimatedPrice: 4.98 },
  { id: "5", name: "Fresh Basil", quantity: "1 package", category: "Herbs", isChecked: false, estimatedPrice: 2.99 },
];

export const SmartShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const { toast } = useToast();

  const categories = ["Produce", "Dairy", "Meat", "Canned Goods", "Oils & Condiments", "Herbs", "Spices", "Other"];

  const addItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName,
      quantity: newItemQuantity || "1",
      category: "Other",
      isChecked: false,
    };
    
    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemQuantity("");
    
    toast({
      title: "Item Added!",
      description: `${newItem.name} added to your shopping list`,
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    ));
  };

  const generateFromRecipe = () => {
    const recipeItems: ShoppingItem[] = [
      { id: "r1", name: "Pasta", quantity: "1 lb", category: "Pantry", isChecked: false, estimatedPrice: 2.49 },
      { id: "r2", name: "Parmesan Cheese", quantity: "8 oz", category: "Dairy", isChecked: false, estimatedPrice: 6.99 },
      { id: "r3", name: "Heavy Cream", quantity: "1 pint", category: "Dairy", isChecked: false, estimatedPrice: 3.29 },
    ];
    
    setItems([...items, ...recipeItems]);
    toast({
      title: "Recipe Ingredients Added!",
      description: "Added ingredients for Creamy Pasta recipe",
    });
  };

  const exportList = () => {
    const listText = items.map(item => 
      `${item.isChecked ? '✓' : '○'} ${item.name} - ${item.quantity}`
    ).join('\n');
    
    navigator.clipboard.writeText(listText).then(() => {
      toast({
        title: "List Copied!",
        description: "Shopping list copied to clipboard",
      });
    });
  };

  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = items.filter(item => item.category === category);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const totalEstimatedCost = items.reduce((sum, item) => 
    sum + (item.estimatedPrice || 0), 0
  );

  const checkedCount = items.filter(item => item.isChecked).length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <ShoppingCart className="w-6 h-6 text-primary" />
          Smart Shopping List
        </CardTitle>
        <p className="text-muted-foreground">
          AI-powered shopping lists with price estimates and smart organization
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Add item name..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
            />
            <Input
              placeholder="Quantity (optional)"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={addItem} className="whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button onClick={generateFromRecipe} variant="outline" className="whitespace-nowrap">
              Generate from Recipe
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-4">
            <Badge variant="secondary">
              {items.length} items total
            </Badge>
            <Badge variant={checkedCount === items.length ? "default" : "outline"}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {checkedCount} completed
            </Badge>
            <Badge variant="outline">
              Est. ${totalEstimatedCost.toFixed(2)}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={exportList} variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share List
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {categories.map(category => {
            const categoryItems = groupedItems[category];
            if (categoryItems.length === 0) return null;
            
            return (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wide">
                  {category}
                </h3>
                <div className="grid gap-2">
                  {categoryItems.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        item.isChecked 
                          ? 'bg-muted/50 text-muted-foreground' 
                          : 'bg-background hover:bg-muted/25'
                      } transition-colors`}
                    >
                      <Checkbox
                        checked={item.isChecked}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${item.isChecked ? 'line-through' : ''}`}>
                          {item.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity}
                          {item.estimatedPrice && (
                            <span className="ml-2">• ~${item.estimatedPrice}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => removeItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your shopping list is empty. Add some items to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};