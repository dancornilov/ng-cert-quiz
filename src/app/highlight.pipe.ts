import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, search: string | null): unknown {
    if (value && search) {
      const regEx = new RegExp(search, 'ig');
      const matches = value.match(regEx);

      if (matches) {
        matches.forEach(match => {
          value = value.replace(match, `<b>${match}</b>`);
        })
      }

      return value;
    }

    return value;
  }
}
