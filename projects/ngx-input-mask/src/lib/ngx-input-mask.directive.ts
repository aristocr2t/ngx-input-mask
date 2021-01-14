import {
	Directive,
	ElementRef,
	HostListener,
	Inject,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { MASK_TEMPLATES, MaskTemplates } from './mask-templates';

@Directive({
	selector: 'input[inputMask][formControlName],input[inputMask][formControl],input[inputMask][ngModel]',
})
export class InputMaskDirective implements OnInit, OnChanges {
	@Input() inputMask!: string;
	private _element!: HTMLInputElement | HTMLTextAreaElement;
	private _inputMask: (RegExp | string)[] = [];

	constructor(
		private readonly _elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
		private readonly _ngControl: NgControl,
		@Inject(MASK_TEMPLATES) private readonly _templates: MaskTemplates,
	) {
	}

	ngOnInit(): void {
		this._element = this._elementRef.nativeElement;
		this._updateInputMask();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.inputMask) {
			this._updateInputMask();
		}
	}

	@HostListener('keydown', ['$event'])
	@HostListener('paste', ['$event'])
	onKeydown(event: KeyboardEvent | ClipboardEvent): void {
		if (event instanceof KeyboardEvent && (event.ctrlKey || event.altKey || event.key.length > 1)) {
			return;
		}

		const putValue = event instanceof KeyboardEvent ? event.key : event.clipboardData?.getData('text');
		const el = this._element;

		if (!putValue || !el) {
			return;
		}

		event.preventDefault();

		try {
			const currentValue = el.value;
			const startLength = currentValue.length;
			const selectionStart = el.selectionStart ?? startLength;
			// console.log(event, currentValue, startLength, selectionStart, putValue);

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
			alert(err);
		}
	}

	private _put(currentValueStart: string, putValue: string, currentValueEnd: string): number {
		let currentValue = currentValueStart;
		const startLength = currentValue.length;

		if (!this._ngControl.control) {
			return startLength;
		}

		const inputMask = this._inputMask;

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

	private _updateInputMask(): void {
		this._inputMask = this.inputMask
			.split('')
			.reduce((p, n, i, a) => {
				const n1 = a[i + 1];

				if (n === '\\') {
					if (n1) {
						p.push(n + n1);
						a.splice(i + 1, 1);
					}
				} else {
					p.push(n);
				}

				return p;
			}, [] as string[])
			.map((s) => s.length === 2 && s.startsWith('\\') ? s.charAt(1) : this._templates[s] || s);
	}
}
