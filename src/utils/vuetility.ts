export module Vuetility{
    export module DataTable{
        
        export function defaultPages(){
            return [5,10,25,50,100,250];
        }
    }
}

export interface DataTableHeader{
    text?:string;
    align?:string;//left|center|right
    sortable?:boolean;
    value?:string;
    class?:string|string[];
    width?:string;
  }
  
 export interface Pagination{
    descending?:boolean;
    page?:number;
    rowsPerPage?:number;
    sortBy?:string;
    totalItems?:number;
  }