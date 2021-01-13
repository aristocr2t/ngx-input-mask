import {
	Directive,
	ElementRef,
	HostListener,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	SimpleChanges,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MASK_TEMPLATES, MaskTemplates } from './mask-templates';

type PlatformId = 'browser' | 'server';

@Directive({
	selector: 'input[inputMask][formControlName],input[inputMask][formControl],input[inputMask][ngModel]',
})
export class InputMaskDirective implements OnInit, OnChanges, OnDestroy {
	@Input() inputMask!: string ;
	private readonly subscriptions: Subscription[] = [];
	private readonly _element!: HTMLInputElement | HTMLTextAreaElement;
	private _inputMask: (RegExp | string)[] = [];
	private readonly isNotBrowser: boolean;

	constructor(
		private readonly _elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
		private readonly _ngControl: NgControl,
		@Inject(MASK_TEMPLATES) private readonly _templates: MaskTemplates,
		@Inject(PLATFORM_ID) platformId: PlatformId,
	) {
		this.isNotBrowser = platformId !== 'browser';

		if (!this.isNotBrowser) {
			return;
		}

		this._element = this._elementRef.nativeElement;
	}

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!this.isNotBrowser) {
			return;
		}

		if (changes.inputMask) {
			this._inputMask = this.inputMask
				.split(/(?<!\\)/)
				.map((s) => s.length === 2 && s.startsWith('\\') ? s.charAt(1) : this._templates[s] || s);
		}
	}

	ngOnDestroy(): void {
		for (const s of this.subscriptions) {
			if (s.closed) {
				continue;
			}

			s.unsubscribe();
		}
	}

	@HostListener('keydown', ['$event'])
	@HostListener('paste', ['$event'])
	onKeydown(event: KeyboardEvent | ClipboardEvent): void {
		if (event instanceof KeyboardEvent && (event.ctrlKey || event.altKey)) {
			return;
		}

		const putValue = event instanceof KeyboardEvent ? event.key : event.clipboardData?.getData('text');

		if (!putValue) {
			return;
		}

		event.preventDefault();

		const el = this._element;
		const currentValue = el.value;
		const startLength = currentValue.length;
		const selectionStart = el.selectionStart || startLength;

		if (selectionStart === currentValue.length) {
			this._put(currentValue, putValue);
		} else {
			const selectionEnd = el.selectionEnd || startLength;
			const currentValueBeforeStart = currentValue.substring(0, selectionStart);
			const currentValueAfterEnd = currentValue.substring(selectionEnd);

			const symbols = putValue + currentValueAfterEnd;
			const finishLength = this._put(currentValueBeforeStart, symbols);

			try {
				el.focus();
				el.setSelectionRange(finishLength, finishLength);
			} catch (err) {
				console.error(err);
			}
		}
	}

	private _put(currentValue: string, symbols: string): number {
		const startLength = currentValue.length;

		if (!this._ngControl.control) {
			return startLength;
		}

		const inputMask = this._inputMask;

		for (let i = 0, a = symbols, s = a[i], l = a.length; i < l; s = a[++i]) {
			const startIndex = currentValue.length;

			if (startIndex > inputMask.length) {
				break;
			}

			let j = startIndex,
				m = inputMask[i];

			while (typeof m === 'string') {
				currentValue += m;
				m = inputMask[++j];
			}

			if (m && m.test(s)) {
				currentValue += s;
			}
		}

		if (startLength < currentValue.length) {
			this._ngControl.control.setValue(currentValue);

			return currentValue.length;
		}

		return startLength;
	}
}
