import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { InputMaskDirective } from './src/input-mask.directive';

@NgModule({
  declarations: [
    InputMaskDirective
  ],
  imports: [
    ReactiveFormsModule
  ],
  exports: [
    InputMaskDirective
  ]
})
export class InputMaskModule { }
