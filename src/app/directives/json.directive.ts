import { Input, Directive, ElementRef, OnInit, SimpleChange, OnChanges, SimpleChanges, AfterContentInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { debounce, debounceTime, filter } from 'rxjs';

@Directive({
    selector: '[pretty-json]',
})
export class JsonDirective implements OnInit, OnChanges {
    constructor(private control: NgControl, private elementRef: ElementRef) {
        console.log(control);
        console.log(elementRef);
    }

    ngOnInit() {
        if (!this.control.control) {
          return;
        }
        this.control.control.valueChanges
          .pipe(filter((e) => typeof e !== 'string'))
          .subscribe((value: SimpleChange) => {
            console.log(value, typeof value);

            this.elementRef.nativeElement.value = JSON.stringify(value, null, 2);
            // this.control?.control?.setValue(value);
          });
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
    }


    
}

