import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFloatingLabel]'
})
export class FloatingLabelDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('focus', ['$event.target'])
  onFocus() {
    this.renderer.addClass(this.el.nativeElement, 'focused');
  }

  @HostListener('blur', ['$event.target'])
  onBlur() {
    if (!this.el.nativeElement.value) {
      this.renderer.removeClass(this.el.nativeElement, 'focused');
    }
  }
}
