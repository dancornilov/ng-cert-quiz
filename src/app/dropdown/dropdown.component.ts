import { Component, Input, OnInit } from '@angular/core';
import { PerformanceUtils } from "../core/utils/performance.utils";
import { ValueAccessorBase } from "../core/base/value-accessor-base.class";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [ValueAccessorBase.getProviderConfig(DropdownComponent)]
})
export class DropdownComponent extends ValueAccessorBase<string> implements OnInit {
  @Input() options!: any; // <-- this any is put because of linting error, usually I have different linting settings
  @Input() placeholder: string = 'Select';
  @Input() optionValue: string = 'id';
  @Input() optionLabel: string = 'name';

  searchControl: FormControl<string | null> = new FormControl<string | null>('');
  showResults: boolean = false;

  PerformanceUtils = PerformanceUtils;

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe( value => {
      this.showResults = !!value?.length;
    });
  }

  select(value: any): void {
    this.value = value[this.optionValue];
    this.searchControl.setValue(value[this.optionLabel]);
    this.showResults = false;
  }
}
