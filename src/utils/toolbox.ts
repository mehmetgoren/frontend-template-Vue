import { Field, SearchSortRequest } from '../models/entities';
import { ServerResponse, SelectItem } from "../models/custom.models"
import { UtilsService } from '../services/utils.service';

declare var Messenger: any;

export module Toolbox {

    // alertify
    export function showAlert(msg){
        alertify.alert(isString(msg) ? msg : JSON.stringify(msg));
    }

    export function showError(msg) {
        alertify.error(isString(msg) ? msg : JSON.stringify(msg));
    }
    export function showSuccess(msg) {
        alertify.success(isString(msg) ? msg : JSON.stringify(msg));
    }
    export function showMessage(msg){
        alertify.message(isString(msg) ? msg : JSON.stringify(msg));
    }
    export function showWarning(msg){
        alertify.warning(isString(msg) ? msg : JSON.stringify(msg));
    }
    export function showConfirm(title, msg) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            alertify.confirm(title, (isString(msg) ? msg : JSON.stringify(msg)), function () {
                resolve(true);
             }, function(){
                reject(false);
            });          
        });
    }

    ///
    export function showSaveMsg(result:number){
        if (result>0)
            Toolbox.showSuccess("Saved");
        else
            Toolbox.showWarning("Saved nothing");
    }
    export function showDeleteMsg(result:number){
        if (result>0)
            Toolbox.showSuccess("Deleted");
        else
            Toolbox.showError("The delete    operation has been failed");
    }
    export function isFormValid(form):boolean{
        if (!form.validate()){
            showWarning("Your inputs are invalid");
            return false;
        } 
        return true;         
    }
    ///
    
    //


    export function isString(o: any): boolean {
        return typeof o === 'string' || o instanceof String;
    }

    export function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    export function isInteger(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }

    export function getParameterByName(name: string, url: string): string {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    export function isUndefinedOrNull(obj){
        return obj === undefined || obj === null;
    }

    export function copyDeep<T>(obj:T) {
        if (obj) {
            return <T>JSON.parse(JSON.stringify(obj));
        }
        return obj;
    }
    export function copyShallow<T>(obj:T, copyProps:T = null){
        if (obj) {
            return <T>Object.assign({}, obj, copyProps);
        }
        return obj;
    }

    export function getAllFunctionNames(obj): string[] {
        let props: string[] = []
    
        do {
            const l = Object.getOwnPropertyNames(obj)
                .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
                .sort()
                .filter((p, i, arr) =>
                    typeof obj[p] === 'function' &&  //only the function
                    p !== 'constructor' &&           //not the constructor
                    (i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
                    props.indexOf(p) === -1          //not overridden in a child
                )
            props = props.concat(l)
        }
        while (
            (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
            Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
        )
    
        return props
    }

    export function guid(): string {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    export function toSelectItemList(ds: any[], valueField: string, labelField: string, emptyItem?: SelectItem) {
        if (ds) {
            var selectItemList: SelectItem[] = [];
            if (emptyItem) {
                selectItemList.push(emptyItem);
            }
            ds.forEach((item) => {
                selectItemList.push({ value: item[valueField] , text: item[labelField]});
            });

            return selectItemList;
        }
        return null;
    }

    export function getFileNameFromFileInput(id: string): string {
        var filename = null;
        if (id) {
            var fullPath = (<any>document.getElementById(id)).value;
            if (fullPath) {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                filename = fullPath.substring(startIndex);
                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                    filename = filename.substring(1);
                }
            }
        }
        return filename;
    }

    export function isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    export function isDesktop() {
        return window.innerWidth > 1024;
    }

    export function isMobile() {
        return window.innerWidth <= 640;
    }
}