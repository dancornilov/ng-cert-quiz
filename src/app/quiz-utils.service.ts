import { Injectable } from '@angular/core';
import { Category, NestedCategory } from "./data.models";

@Injectable({
  providedIn: 'root'
})
export class QuizUtilsService {

  prepareCategories(items: Category[]): NestedCategory[] {
    return items.reduce((acc: NestedCategory[], item) => {
      const category = { ...item, subcategories: [] };

      if (item.name.includes(':')) {
        const [categoryName, subcategoryName] = item.name.split(':')
        const categoryIndex = acc.findIndex(i => i.name === categoryName);
        const subcategory = { id: category.id, name: subcategoryName.trim() };

        if (categoryIndex !== -1) {
          acc[categoryIndex].subcategories.push(subcategory);
        } else {
          acc.push({ ...category, name: categoryName, subcategories: [subcategory] });
        }
        return acc;
      }

      return [...acc, category];
    }, []);
  }
}
