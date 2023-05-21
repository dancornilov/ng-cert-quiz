import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, } from '@angular/forms';
import { AfterViewInit, Directive, forwardRef, Injector, Provider, } from '@angular/core';

@Directive()
export abstract class ValueAccessorBase<T>
  implements ControlValueAccessor, AfterViewInit {
  get value(): T {
    return this.innerValue;
  }

  set value(value: T) {
    if (this.innerValue !== value) {
      this.innerValue = value;
    }

    this.changed.forEach((f) => f(this.getValueTransform ? this.getValueTransform(value) : value));
  }

  public disabled!: boolean;

  public changed = new Array<(value: T) => void>();
  public touched = new Array<() => void>();

  public innerValue!: T;
  public getValueTransform!: (value: T) => any;
  public setValueTransform!: (value: any) => any;

  public control!: FormControl;

  constructor(protected readonly injector: Injector) {
  }

  /**
   * Returns provider configuration that should be defined for every component
   * that extends ValueAccessorBase.
   * @param useExisting: Existing token to return. (equivalent to injector.get(useExisting))
   * @returns Provider
   */
  public static getProviderConfig(useExisting: any): Provider {
    return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => useExisting),
      multi: true,
    };
  }

  /**
   * Returns control from
   * @returns FormControl
   */
  public static extractFormControl(ngControl: NgControl): FormControl | null {
    if (ngControl) {
      return ngControl.control as FormControl;
    }

    return null;
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      // @ts-ignore
      const ngControl: NgControl = this.injector.get(NgControl, null);
      // @ts-ignore
      this.control = ValueAccessorBase.extractFormControl(ngControl);
    });
  }

  public writeValue(value: T): void {
    this.innerValue = this.setValueTransform
      ? this.setValueTransform(value)
      : value;
  }

  public registerOnChange(fn: (value: T) => void): void {
    this.changed.push(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.touched.push(fn);
  }

  public touch(): void {
    this.touched.forEach((f) => f());
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
