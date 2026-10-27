import { NgModule } from '@angular/core';

import { provideInputMask } from './mask-templates';
import { InputMaskDirective } from './ngx-input-mask.directive';

@NgModule({
  imports: [InputMaskDirective],
  exports: [InputMaskDirective],
  providers: [provideInputMask()],
})
export class InputMaskModule {}
