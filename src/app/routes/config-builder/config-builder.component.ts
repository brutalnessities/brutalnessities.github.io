import { AfterViewInit, Component, OnInit } from '@angular/core';
import mock from './mock.json';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
            styles: new FormControl<string | any>('', []),
          }),
        ]),
      }),
    ]),
  });

  default = mock;
  defaultTemplate = mock[0];
  defaultButton = mock[0].buttons[0];

  constructor(private formBuilder: FormBuilder) {
    console.log(this.default);
  }

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
                styles: JSON.parse(two.styles),
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
                  styles: JSON.stringify(two.styles, null, 2),
                });
              })
            ),
          });
        })
      ),
    });

    console.log(this.config);

    this.config.valueChanges.subscribe((value) => {
      console.log(value);
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
        styles: new FormControl<string | any>('{"button": {}}', []),
      })
    );
    this.config.touched;

    this.ngAfterViewInit();
  }

  log(e: any) {
    console.log(e);
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
            styles: new FormControl<string | any>('{"button": {}}', []),
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
}
