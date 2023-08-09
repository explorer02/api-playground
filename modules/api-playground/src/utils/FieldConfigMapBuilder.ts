import { FieldConfig, FieldConfigMap } from '@/types';

export class FieldConfigMapBuilder {
  private fieldConfigMap: FieldConfigMap;
  constructor() {
    this.fieldConfigMap = {};
  }
  addField(field: FieldConfig) {
    this.fieldConfigMap[field.id] = field;
    return this;
  }
  build(): FieldConfigMap {
    return this.fieldConfigMap;
  }
}
