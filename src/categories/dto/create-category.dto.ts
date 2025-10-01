import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    categoryName : string;


    @IsOptional()
    categorySlug?: string;

    @IsNotEmpty()
    description : string;
    
}
