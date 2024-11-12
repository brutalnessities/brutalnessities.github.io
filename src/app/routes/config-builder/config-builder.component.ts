import { Component, OnInit } from '@angular/core';
import mock from './mock.json';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-config-builder',
  templateUrl: './config-builder.component.html',
  styleUrl: './config-builder.component.sass',
})
export class ConfigBuilderComponent implements OnInit {
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

  constructor(private formBuilder: FormBuilder) {
    console.log(this.default);
  }

  get json() {
    const value = this.config.controls.templates.value.map((one) => {
      return {
        template: one.template,
        style: one.style,
        buttons: !one.buttons ? [] : one.buttons.map((two) => {
          return {
            text: two.text,
            entry: two.entry,
            styles: JSON.parse(two.styles),
            };
          }
        ),
      }
    });
    return JSON.stringify(value, null, 2);
    // return JSON.stringify(this.config, null, 2);
  }

  stringify(value: any) {
    return JSON.stringify(value, null, 2);
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

  addTemplate() {
    console.log('add template');
  }

  addButton() {
    console.log('add button');
  }

  log(e: any) {
    console.log(e);
  }
}
