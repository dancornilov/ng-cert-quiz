import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(value: string | null, options: any[] = [], property: string = 'name'): any[] {
    console.log(value);
    return options.filter(item => (item[property].toLowerCase()).includes(value?.toLowerCase()));
  }
}
