import { Directive, ElementRef, computed, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

import { DEFAULT_MASK_TEMPLATES, MASK_TEMPLATES } from './mask-templates';

@Directive({
  selector:
    'input[inputMask][formControlName],input[inputMask][formControl],input[inputMask][ngModel]',
  standalone: true,
  host: {
    '(keydown)': 'onKeydown($event)',
    '(paste)': 'onKeydown($event)',
  },
})
export class InputMaskDirective {
  readonly inputMask = input.required<string>();

  private readonly _element = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>)
    .nativeElement;

  private readonly _ngControl = inject(NgControl);
  private readonly _templates =
    inject(MASK_TEMPLATES, { optional: true }) ?? DEFAULT_MASK_TEMPLATES;

  private readonly _inputMask = computed(() => this._parseMask(this.inputMask()));

  onKeydown(event: KeyboardEvent | ClipboardEvent): void {
    if (event instanceof KeyboardEvent && (event.ctrlKey || event.altKey || event.key.length > 1)) {
      return;
    }

    const putValue =
      event instanceof KeyboardEvent ? event.key : event.clipboardData?.getData('text');
    const el = this._element;

    if (!putValue || !el) {
      return;
    }

    event.preventDefault();

    try {
      const currentValue = el.value;
      const startLength = currentValue.length;
      const selectionStart = el.selectionStart ?? startLength;

      if (selectionStart === currentValue.length) {
        this._put(currentValue, putValue, '');
      } else {
        const selectionEnd = el.selectionEnd ?? startLength;
        const currentValueStart = currentValue.substring(0, selectionStart);
        const currentValueEnd = currentValue.substring(selectionEnd);

        const pos = this._put(currentValueStart, putValue, currentValueEnd);

        try {
          el.focus();
          el.setSelectionRange(pos, pos);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  private _put(currentValueStart: string, putValue: string, currentValueEnd: string): number {
    let currentValue = currentValueStart;
    const startLength = currentValue.length;

    if (!this._ngControl.control) {
      return startLength;
    }

    const inputMask = this._inputMask();

    let j = startLength;

    for (let i = 0, a = putValue, s = a[i], l = a.length; i < l; s = a[++i]) {
      const startIndex = currentValue.length;

      if (startIndex > inputMask.length) {
        break;
      }

      j = startIndex;

      let m = inputMask[j];

      while (typeof m === 'string') {
        currentValue += m;

        if (m === s) {
          break;
        }

        m = inputMask[++j];
      }

      if (typeof m === 'string') {
        continue;
      }

      if (m?.test(s)) {
        currentValue += s;
      }
    }

    const pos = j + 1;

    if (currentValueEnd) {
      for (let i = 0, a = currentValueEnd, s = a[i], l = a.length; i < l; s = a[++i]) {
        const startIndex = currentValue.length;

        if (startIndex > inputMask.length) {
          break;
        }

        j = startIndex;

        let m = inputMask[j];

        while (typeof m === 'string') {
          currentValue += m;

          if (m === s) {
            break;
          }

          m = inputMask[++j];
        }

        if (typeof m === 'string') {
          continue;
        }

        if (m?.test(s)) {
          currentValue += s;
        }
      }
    }

    if (startLength < currentValue.length) {
      this._ngControl.control.setValue(currentValue);
    }

    return pos;
  }

  private _parseMask(mask: string): (RegExp | string)[] {
    return (mask.match(/\\.|./g) ?? []).map((token) =>
      token.length === 2 ? token.charAt(1) : this._templates[token] ?? token);
  }
}
