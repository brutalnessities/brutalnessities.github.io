import { Component, OnInit } from '@angular/core';
import mock from './mock.json';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-config-builder',
  templateUrl: './config-builder.component.html',
  styleUrl: './config-builder.component.sass',
})
export class ConfigBuilderComponent implements OnInit {
  test = new FormGroup({
    templates: new FormArray([
      new FormGroup({
        template: new FormControl<string>('', []),
        style: new FormControl<string>('stacked', []),
        buttons: new FormArray([
          new FormGroup({
            text: new FormControl<string>('', []),
            entry: new FormControl<string>('', []),
            styles: new FormControl<string>('', []),
          }),
        ]),
      }),
    ]),
  });
  
  config = mock;

  constructor(private formBuilder: FormBuilder) {
    console.log(this.config);
  }

  get json() {
    const value = this.test.value;
    return JSON.stringify(value, null, 2);
    // return JSON.stringify(this.config, null, 2);
  }

  stringify(value: any) {
    return JSON.stringify(value, null, 2);
  }

  ngOnInit() {
    this.test = this.formBuilder.group({
      templates: this.formBuilder.array(
        this.config.map((one) => {
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

    console.log(this.test);

    this.test.valueChanges.subscribe((value) => {
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
