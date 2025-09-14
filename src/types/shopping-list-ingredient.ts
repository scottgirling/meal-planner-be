export interface ShoppingListIngredient {
    shopping_list_ingredient_id?: number;
    shopping_list_id: number;
    ingredient_id: number;
    quantity: number;
    unit: string;
    is_checked_off: boolean;
    meal_plan_id?: number;
    ingredient_name?: string
}