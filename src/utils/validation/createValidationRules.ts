import store from "@/store";
import { Metadata } from "@/store/metadata";
import { Field } from '@/models/entities';
import { Toolbox } from "@/utils/toolbox";
import { Validators } from './validators';


enum ValidationType
{
    string = "string",
    integer = "integer",
    float = "float",
    date = "date",
    number = "number",
    boolean = "boolean",
    any = "any",
}

export type ValidationRule = (value) => boolean | string;// or  ((value, field:Field) => boolean) | string; ???


export type ValidationRules = { [field: string]: ValidationRule[] };


export function createValidationRules(typefullName: string, fields?: string[]): ValidationRules {
    if (!typefullName)
      throw new Error("typefullName is undefined or null");
  
    const metadata: Metadata = store.getters.metadata;
    if (!metadata)
      throw new Error("Metadata cannot be pulled");
    let props = metadata[typefullName];
    if (!props)
      throw new Error(typefullName + " can not be found");
  
    let dic: ValidationRules = {};
  
    const hasFileds = fields && fields.length > 0;
    props.forEach(i => {
      let found = false;
      if (hasFileds) {
        found = fields.filter(field => field == i.PropertyName).length > 0;
      }
      if (!hasFileds || found) {
        let list: ValidationRule[] = [];
  
        if (!i.IsNullable){
            list.push(Validators.required());
        }


        switch(i.ValidationType){
            case ValidationType.integer:
                list.push(Validators.isInteger());
                break;
            case ValidationType.float:
            case ValidationType.number:
                list.push(Validators.isNumber());
                break;
        }

        if (i.MaxLength > 0) {
            list.push(Validators.maxLength(i.MaxLength));
        }
        if (i.MinLength > 0){
            list.push(Validators.minLength(i.MinLength));
        }
        if (i.Pattern) {
            const regex = new RegExp(i.Pattern);
            list.push(Validators.regex(regex));
        }
        //min max ı gerektiğin de yap
        dic[i.PropertyName] = list;
      }
    });
  
    return dic;
  }

  export function isValid(models:any[], rules:ValidationRules): boolean{
    if (!models)
        throw new Error("model is null"); 
    if (!rules)
        throw new Error("rules is null");

    for(const model of models){
        for(const field in rules){
            const ruleArray:ValidationRule[] = rules[field];
            if (!ruleArray)
                throw new Error("Rule is not foudn for '" + field + "' field");
            const value = model[field];//it can be undefined or null to validate requred rule.
            for(const rule of ruleArray){
                if (rule(value) !== true){
                    return false;
                }
            }
        }
    }
    
    return true;
  }