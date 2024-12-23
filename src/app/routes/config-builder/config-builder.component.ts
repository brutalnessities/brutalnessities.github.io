import { AfterViewInit, Component, OnInit } from '@angular/core';
import mock from './mock.json';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { pairwise, startWith } from 'rxjs';
import { debounce, debounceTime, filter } from 'rxjs/operators';
import { Button, Template } from './types';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-config-builder',
  templateUrl: './config-builder.component.html',
  styleUrl: './config-builder.component.sass',
})
export class ConfigBuilderComponent implements OnInit, AfterViewInit {
  config = new FormGroup({
    templates: new FormArray([
      new FormGroup({
        template: new FormControl<string>('', []),
        style: new FormControl<string>('stacked', []),
        buttons: new FormArray([
          new FormGroup({
            text: new FormControl<string>('', []),
            entry: new FormControl<string>('', []),
            styles: new FormControl<any>({}, []),
          }),
        ]),
      }),
    ]),
  });

  default = mock;
  defaultTemplate = mock[0];
  defaultButton = mock[0].buttons[0];

  constructor(private formBuilder: FormBuilder) {}

  get json() {
    const value = this.config.controls.templates.value.map((one) => {
      return {
        template: one.template,
        style: one.style,
        buttons: !one.buttons
          ? []
          : one.buttons.map((two) => {
              return {
                text: two.text,
                entry: two.entry,
                styles: two.styles,
              };
            }),
      };
    });
    return JSON.stringify(value, null, 2);
  }

  stringify(value: any) {
    return JSON.stringify(value, null, 2);
  }

  get parsed() {
    return JSON.parse(this.json);
  }

  parse(value: string) {
    return JSON.parse(value);
  }

  ngOnInit() {
    this.config = this.formBuilder.group({
      templates: this.formBuilder.array(
        this.default.map((one) => {
          return this.formBuilder.group({
            template: one.template,
            style: one.style,
            buttons: this.formBuilder.array(
              one.buttons.map((two) => {
                return this.formBuilder.group({
                  text: two.text,
                  entry: two.entry ?? '/',
                  styles: two.styles,
                });
              })
            ),
          });
        })
      ),
    });
    this.config.valueChanges.pipe(
      startWith(this.config.value),
      pairwise(),
      debounceTime(1000),
      filter(([prev, curr]: [any, any]) => prev !== curr)
    ).subscribe(([prev, curr]: [any, any]) => {
      console.log({prev}, {curr});

      // patchvalue of all button.styles by parsing them to JSON
      curr.templates.forEach((template: Template, i: number) => {
        template.buttons.forEach((button: Button, j: number) => {
          if (typeof button.styles === 'string') {
          this.config.controls.templates.controls[i].controls.buttons.controls[j].controls.styles.patchValue(JSON.parse(button.styles));
          }
        });
      });
    });
  }

  ngAfterViewInit() {
    const current = this.config.value;
    this.config.patchValue(current);
  }

  removeButton(i: number, j: number) {
    console.log('delete button');
    console.log(i);
    this.config.controls.templates.controls[i].controls.buttons.removeAt(j);
    this.ngAfterViewInit();
  }

  value(event: any) {
    console.log(event);
    console.log(this.config.value);
  }

  addButton(i: number, j: number) {
    console.log(i, 'add button', j);
    this.config.controls.templates.controls[i].controls.buttons.push(
      new FormGroup({
        text: new FormControl<string>('NEW BUTTON', []),
        entry: new FormControl<string>('/', []),
        styles: new FormControl<any>({ button: {} }, []),
      })
    );

    this.ngAfterViewInit();
  }

  log(e: any) {
    console.log(e);
    const value = e.target.value;
    console.log(value);

    
    this.config.patchValue(JSON.parse(value));
  }

  addTemplate() {
    this.config.controls.templates.push(
      new FormGroup({
        template: new FormControl<string>('New Template', []),
        style: new FormControl<string>('stacked', []),
        buttons: new FormArray([
          new FormGroup({
            text: new FormControl<string>('', []),
            entry: new FormControl<string>('/', []),
            styles: new FormControl<any>({ button: {} }, []),
          }),
        ]),
      })
    );
    this.ngAfterViewInit();
  }

  removeTemplate(i: number) {
    this.config.controls.templates.removeAt(i);
    this.ngAfterViewInit();
  }

  drop(event: any) {
    console.log(event); 
    moveItemInArray(this.config.controls.templates.controls, event.previousIndex, event.currentIndex);
  }
}
