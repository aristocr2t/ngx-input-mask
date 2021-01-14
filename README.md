# ngx-input-mask

Simple input mask directive for angular.

![ngx-input-mask npm version](https://img.shields.io/npm/v/ngx-input-mask.svg) ![supported node version for ngx-input-mask](https://img.shields.io/node/v/ngx-input-mask.svg) ![total npm downloads for ngx-input-mask](https://img.shields.io/npm/dt/ngx-input-mask.svg) ![monthly npm downloads for ngx-input-mask](https://img.shields.io/npm/dm/ngx-input-mask.svg) ![npm licence for ngx-input-mask](https://img.shields.io/npm/l/ngx-input-mask.svg)

## Simple usage

Just import in AppModule:

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputMaskModule } from "ngx-input-mask";

import { AppComponent } from "./app.component";

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, InputMaskModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

In HTML:

```html
<input
  type="text"
  inputMask="+7 (000) 000-00-00"
  [(ngModel)]="phone"
  name="phone"
/>
```

## Advanced options

To create custom templates override MASK_TEMPLATES value:

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  InputMaskModule,
  MaskTemplates,
  MASK_TEMPLATES,
  DEFAULT_MASK_TEMPLATES,
} from "ngx-input-mask";

import { AppComponent } from "./app.component";

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, InputMaskModule],
  declarations: [AppComponent],
  providers: [
    {
      provide: MASK_TEMPLATES,
      useValue: {
        ...DEFAULT_MASK_TEMPLATES,
        H: /[ABCEHKMOPTXY]/, // Russian car license plate
        // Put your templates here (NOTICE: There allows keys 1 letter only!)
      } as MaskTemplates,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Then you can use it:

```html
<input
  type="text"
  inputMask="H 000 HH 000"
  [(ngModel)]="licensePlate"
  name="licensePlate"
/>
```

If you need to use symbol but it reserved by template, just use it:

```html
<input
  type="text"
  inputMask="H 000 H\H 000"
  [(ngModel)]="licensePlate"
  name="licensePlate"
/>
```

## TODOS

1. Multiple masks - it will allow to flexibly switch between masks when writing
2. Function mask

## License

Licensed under MIT license.
