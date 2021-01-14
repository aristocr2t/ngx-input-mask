import { InjectionToken } from '@angular/core';

export const MASK_TEMPLATES = new InjectionToken<MaskTemplates>('MaskTemplates');

export const DEFAULT_MASK_TEMPLATES: MaskTemplates = {
	'0': new RegExp('[0-9]'),
	'_': new RegExp('[a-z]', 'i'),
	'A': new RegExp('[A-Z]'),
	'a': new RegExp('[a-z]'),
};

export interface MaskTemplates {
	[symbol: string]: RegExp;
}
