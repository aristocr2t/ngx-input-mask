import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { InputMaskDirective } from './ngx-input-mask.directive';
import { DEFAULT_MASK_TEMPLATES, MASK_TEMPLATES } from './mask-templates';

@NgModule({
	imports: [ReactiveFormsModule],
	exports: [InputMaskDirective],
	declarations: [InputMaskDirective],
	providers: [{ provide: MASK_TEMPLATES, useValue: DEFAULT_MASK_TEMPLATES }],
})
export class InputMaskModule {
}
