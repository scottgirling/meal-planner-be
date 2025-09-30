export interface RecipeBody {
    recipe_name: string;
    recipe_slug: string;
    instructions: string;
    prep_time: number;
    cook_time: number;
    servings: number;
    recipe_created_by: string;
    recipe_img_url: string;
    difficulty: number;
    is_recipe_public: boolean
}