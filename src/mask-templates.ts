import { InjectionToken } from "@angular/core";

export const MASK_TEMPLATES = new InjectionToken<MaskTemplates>('MaskTemplates');

export const DEFAULT_MASK_TEMPLATES: MaskTemplates = {
	'0': /[0-9]/,
	'_': /[a-z]/i,
	'A': /[A-Z]/,
	'a': /[a-z]/,
};

export interface MaskTemplates {
	[symbol: string]: RegExp;
}
