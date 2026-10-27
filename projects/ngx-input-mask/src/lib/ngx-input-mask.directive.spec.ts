import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { InputMaskModule } from './ngx-input-mask.module';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputMaskModule],
  template: '<input [formControl]="control" inputMask="+7 (000) 000-00-00" />',
})
class TestHostComponent {
  control = new FormControl('');
}

describe('InputMaskDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should create the host component', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
  });

  it('should apply the mask to the control value', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: '9', bubbles: true, cancelable: true }),
    );

    expect(fixture.componentInstance.control.value).toBe('+7 (9');
  });
});
