export interface RecipeIngredientBody {
    recipe_id: string;
    ingredient_ids: number[];
    quantity: number[];
    unit: string[]
}