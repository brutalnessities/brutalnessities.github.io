export type Config = {
    template: Template;
};

export type Template = {
  template: string;
  buttons: Button[];
};

export type Button = {
  text: string;
  entry: string;
  styles: any;
};