export interface PatchRecipeBody {
    recipe_name: string;
    instructions: string;
    prep_time: number;
    cook_time: number;
    servings: number;
    recipe_img_url: string;
    difficulty: number;
    is_recipe_public: boolean;
    ingredientsToRemove: number[];
    ingredientsToAdd: number[];
    quantitiesToAdd: number[];
    unitsToAdd: string[]
}