import { Recipe } from "./recipe";

export interface AdditionalRecipeInfo extends Recipe {
    username?: string;
    avatar_url?: string;
}