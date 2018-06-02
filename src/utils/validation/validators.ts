import { ValidationRule } from './createValidationRules';
import { Toolbox } from '@/utils/toolbox';


export const Validators = {
    required,
    isInteger,
    isNumber,
    maxLength,
    minLength,
    regex
  }

function required(): ValidationRule {
    return (value) => {
        if (typeof(value) === "boolean")
            return true;
        return (!!value) || "required.";
    };
}

function isInteger(): ValidationRule {
    return (value) =>{
        return Toolbox.isInteger(value) ||  "the value must be a integer value.";
    };
}

function isNumber(): ValidationRule {
    return (value) =>{
        return Toolbox.isNumber(value) ||  "the value must be a number.";
    };
}


function maxLength(maxL: number): ValidationRule {
    return (value) => {
        if (!value)
            return true;
        return (value.toString().length <= maxL) || ("the value exceeded " + maxL + " symbols");
    };
};

function minLength(minL: number): ValidationRule {
    return (value) => {
        return (value && value.toString().length >= minL) || ("the entered value' s length must be greater than " + minL);
    };
};

function regex(regex:RegExp) : ValidationRule{
    return (value) => {
        return regex.test(value) || "Your input is not valid.";
    };
}
