export interface Recipe {
  recipe_id?: number,
  recipe_name: string;
  recipe_slug: string;
  instructions: string;
  prep_time: number;
  cook_time: number;
  votes: number;
  servings: number;
  recipe_created_by: string;
  recipe_created_at: string;
  recipe_last_updated_at: string;
  recipe_img_url: string;
  difficulty: number;
  is_recipe_public: boolean;
}