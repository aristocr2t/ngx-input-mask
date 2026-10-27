# ngx-input-mask

Простая и лёгкая директива маски ввода для Angular. Работает как с реактивными формами, так и с `ngModel`.

![ngx-input-mask npm version](https://img.shields.io/npm/v/ngx-input-mask.svg) ![supported node version for ngx-input-mask](https://img.shields.io/node/v/ngx-input-mask.svg) ![total npm downloads for ngx-input-mask](https://img.shields.io/npm/dt/ngx-input-mask.svg) ![monthly npm downloads for ngx-input-mask](https://img.shields.io/npm/dm/ngx-input-mask.svg) ![npm licence for ngx-input-mask](https://img.shields.io/npm/l/ngx-input-mask.svg)

## Требования

- Angular 22+
- `@angular/forms` (`ReactiveFormsModule` или `FormsModule`)

## Установка

```bash
npm install ngx-input-mask
```

## Использование (standalone, рекомендуется)

Директива `InputMaskDirective` — standalone. Достаточно импортировать её в компонент.

### Реактивные формы

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputMaskDirective } from 'ngx-input-mask';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, InputMaskDirective],
  template: `
    <input [formControl]="phone" inputMask="+7 (000) 000-00-00" />
  `,
})
export class AppComponent {
  phone = new FormControl('');
}
```

### Template-driven формы (`ngModel`)

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskDirective } from 'ngx-input-mask';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, InputMaskDirective],
  template: `
    <input [(ngModel)]="phone" name="phone" inputMask="+7 (000) 000-00-00" />
  `,
})
export class AppComponent {
  phone = '';
}
```

## Использование (NgModule, обратная совместимость)

`InputMaskModule` по-прежнему доступен для проектов на NgModule.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from 'ngx-input-mask';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, InputMaskModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Синтаксис маски

По умолчанию доступны следующие шаблоны:

| Символ | Значение            | RegExp      |
| ------ | ------------------- | ----------- |
| `0`    | цифра               | `/[0-9]/`   |
| `_`    | буква (любой регистр) | `/[a-z]/i` |
| `A`    | заглавная буква     | `/[A-Z]/`   |
| `a`    | строчная буква      | `/[a-z]/`   |

Любой другой символ считается литералом и подставляется как есть.

Например, маска `+7 (000) 000-00-00` при вводе `9991234567` даст `+7 (999) 123-45-67`.

## Пользовательские шаблоны

Чтобы добавить собственный символ, используйте функцию `provideInputMask`. Она мержит переданные шаблоны с шаблонами по умолчанию.

### Standalone

```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputMaskDirective, provideInputMask } from 'ngx-input-mask';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, InputMaskDirective],
  providers: [
    provideInputMask({
      H: /[ABCEHKMOPTXY]/, // российский номер автомобиля
    }),
  ],
  template: `
    <input [formControl]="licensePlate" inputMask="H 000 HH 000" />
  `,
})
export class AppComponent {
  licensePlate = new FormControl('');
}
```

### NgModule

```typescript
import { NgModule } from '@angular/core';
import { InputMaskModule, provideInputMask } from 'ngx-input-mask';

@NgModule({
  imports: [InputMaskModule],
  providers: [
    provideInputMask({
      H: /[ABCEHKMOPTXY]/,
    }),
  ],
})
export class AppModule {}
```

> Для тонкой настройки можно напрямую переопределить токен `MASK_TEMPLATES`, отталкиваясь от `DEFAULT_MASK_TEMPLATES`.

## Экранирование зарезервированных символов

Если символ зарезервирован шаблоном, но нужен как литерал, экранируйте его обратным слэшем `\`:

```html
<input
  type="text"
  inputMask="H 000 H\H 000"
  [(ngModel)]="licensePlate"
  name="licensePlate"
/>
```

Здесь второй `H` — литерал, а не шаблон.

## API

| Экспорт                  | Тип        | Описание                                                              |
| ------------------------ | ---------- | --------------------------------------------------------------------- |
| `InputMaskDirective`     | directive  | Standalone-директива. Селектор: `input[inputMask][formControlName], input[inputMask][formControl], input[inputMask][ngModel]`. Вход: `inputMask: string` (обязательный). |
| `InputMaskModule`        | NgModule   | Обёртка для обратной совместимости.                                   |
| `provideInputMask`       | function   | `(templates?: MaskTemplates) => EnvironmentProviders`. Провайдит `MASK_TEMPLATES`. |
| `MASK_TEMPLATES`         | token      | `InjectionToken<MaskTemplates>` для переопределения шаблонов.         |
| `DEFAULT_MASK_TEMPLATES` | const      | Шаблоны по умолчанию (`0`, `_`, `A`, `a`).                            |
| `MaskTemplates`          | interface  | `{ [symbol: string]: RegExp }` — карта «символ → регулярное выражение». |

## TODO

1. Несколько масок — гибкое переключение между масками при вводе.
2. Маска-функция.

## License

MIT.
