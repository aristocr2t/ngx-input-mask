import { Directive, ElementRef, Input, HostListener, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { NgControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

const MaskTemplates = [
  { symbol: '0', mask: /[0-9]/ },
  { symbol: '_', mask: /\w/ },
  { symbol: 'A', mask: /[A-Z]/ },
  { symbol: 'a', mask: /[a-z]/ },
  { symbol: 'А', mask: /[А-ЯЁ]/ },
  { symbol: 'а', mask: /[а-яё]/ },
  { symbol: 'Н', mask: /[abcehkmoptxy]/i }
];

@Directive({
  selector: 'input[inputMask][formControlName],input[inputMask][formControl],input[inputMask][ngModel]'
})
export class InputMaskDirective implements OnInit, OnDestroy {
  @Input() public inputMask: string;
  private _valueChangesSubscription: Subscription;
  private _maskTemplates = MaskTemplates;
  private _masks: any[];
  private _pasteMasks: any[];
  private _element: any;
  private _lastValues: string[] = [];

  constructor(private _elementRef: ElementRef,
              private _ngControl: NgControl) { }

  public ngOnInit(): void {
    this._element = this._elementRef.nativeElement;
    this._createMasks();
    this._subscribeValueChanges();
  }

  public ngOnDestroy(): void {
    if (this._valueChangesSubscription) this._valueChangesSubscription.unsubscribe();
  }

  private _subscribeValueChanges(): void {
    const control = this._ngControl.control as AbstractControl;
    this._valueChangesSubscription = control.valueChanges
      .filter((value) => value)
      .subscribe((value: string) => {
        if (value.length > this._masks.length) {
          this._writeValue(value.substring(0, this._masks.length));
          return;
        }
        let i;
        for (i = 0; i < value.length; i++) {
          if ((typeof this._masks[i] === 'string' && this._masks[i] !== value[i]) || (this._masks[i] instanceof RegExp && !this._masks[i].test(value[i]))) {
            this._pasteValue(value);
            break;
          }
        }
        if (value.length && i === value.length) {
          this._lastValues.push(value);
        }
      });
  }

  private _pasteValue(newValue: string): void {
    this._writeValue('');
    if (newValue.length) {
      newValue = newValue.substring(0, this._masks.length);
      for (let i = 0, symbol; i < newValue.length; i++) {
        symbol = newValue[i];
        this._pasteSymbol(symbol);
      }
      this._writeValue(this._element.value);
    }
  }

  @HostListener('keypress', ['$event']) public onKeypress(event: KeyboardEvent): void {
    if (!event.ctrlKey && !event.altKey) {
      event.preventDefault();
      const selection = getSelection(this._element),
        oldValue = this._element.value;
      if (selection.start === oldValue.length) {
        this._pasteSymbol(event.key, true);
      } else {
        this._element.value = oldValue.substring(0, selection.start);
        const substr = event.key + oldValue.substring(selection.end);
        let i;
        for (i = 0; i < substr.length; i++) {
          this._pasteSymbol(substr[i], true);
        }
        for (i = selection.start; typeof this._masks[i] === 'string'; i++);
        setCaretPosition(this._element, i + 1);
      }
      this._writeValue(this._element.value);
    }
  }

  private _writeValue(value: string): void {
    (this._ngControl.control as AbstractControl).setValue(value);
  }

  private _createMasks(): void {
    const output1 = this.inputMask.split('') as any[],
      output2 = this.inputMask.split('') as any[];

    const reservedSymbols = this._maskTemplates.map((value) => value.symbol),
      masks = this._maskTemplates.map((value) => value.mask);

    for (let i = 0, j, symbol, index; i < output1.length; i++) {
      symbol = output1[i];
      if ((index = reservedSymbols.indexOf(symbol)) > -1) {
        output1[i] = masks[index];
        output2[i] = masks[index];
      } else {
        for (j = 0; j < masks.length; j++) {
          if (masks[j].test(symbol)) {
            output2[i] = masks[j];
          }
        }
      }
    }
    this._masks = output1;
    this._pasteMasks = output2;
  }

  private _pasteSymbol(symbol: string, keypress: boolean = false): void {
    const index = this._element.value.length;
    if (index < this._masks.length) {
      const masks = keypress ? this._masks : this._pasteMasks;
      let i, mask;
      for (i = index; typeof (mask = masks[i]) === 'string'; i++) {
        this._element.value += mask;
      }
      if (mask instanceof RegExp && mask.test(symbol)) {
        this._element.value += symbol;
      }
    }
  }
}

function getSelection(target: any): { start: number, end: number } {
  const selection = { start: 0, end: 0 },
    doc = document as any;
  if (typeof target.selectionStart === 'number' && typeof target.selectionEnd === 'number') {
    selection.start = target.selectionStart;
    selection.end = target.selectionEnd;
  } else if (doc.selection && target.createTextRange) {
    const bookmark = doc.selection.createRange().getBookmark(),
      sel = target.createTextRange(),
      bfr = sel.duplicate();
    sel.moveToBookmark(bookmark);
    bfr.setEndPoint('EndToStart', sel);
    selection.start = bfr.text.length;
    selection.end = selection.start + sel.text.length;
  }
  return selection;
}

function setCaretPosition(target: any, pos: number): void {
  if (target.setSelectionRange) {
    target.focus();
    target.setSelectionRange(pos, pos);
  } else if (target.createTextRange) {
    const range = target.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}
