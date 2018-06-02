export interface Action { 
    ActionId?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    ControllerId?: number;
    Name?: string;
}

export interface AppSetting { 
    Name?: string;
    Value?: string;
    DefaultValue?: string;
    Description?: string;
    Module?: string;
    Enabled?: boolean;
}

export interface AppUser { 
    AppUserId?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    IpAddress?: string;
    RoleId?: number;
    Username?: string;
    Password?: string;
    LoginCount?: number;
    Title?: string;
}



export interface ChartModel { 
    labels?: string[];
    datasets?: ChartModelDataSet[];
}

export interface ChartModelDataSet { 
    data?: any[];
    backgroundColor?: string[];
    hoverBackgroundColor?: string[];
    label?: string;
    borderColor?: string;
}

export interface Controller { 
    ControllerId?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    Name?: string;
}

export interface CustomFilter { 
    Field?: string;
    Operator?: any;
    Values?: any[];
    DataType?: any;
}

export interface Field { 
    PropertyName?: string;
    IsKey?: boolean;
    IsNullable?: boolean;
    MaxLength?: number;
    MinLength?: number;
    ReadOnly?: boolean;
    Pattern?: string;
    MinValue?: number;
    MaxValue?: number;
    ValidationType?: any;
}





export interface IsoDateTimeConverterTR { 
    DateTimeStyles?: any;
    DateTimeFormat?: string;
    Culture?: any;
    CanRead?: boolean;
    CanWrite?: boolean;
}

export interface ITreeObject { 
    Id?: number;
    ParentId?: number;
}

export interface ITreeObject { 
    Children?: any[];
}



export interface Menu { 
    MenuId?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    Name?: string;
    Route?: string;
    Description?: string;
    OrderNum?: number;
    ParentId?: number;
    Visible?: boolean;
    Icon?: string;
    Childs?: Menu[];
}

export interface Migration100 { 
    Version?: any;
    Description?: string;
}

export interface Migration101 { 
    Version?: any;
    Description?: string;
}

export interface Role { 
    RoleId?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    Name?: string;
    IsAdmin?: boolean;
    CanUseWebSockets?: boolean;
}

export interface RoleAction { 
    RoleActionId?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    RoleId?: number;
    ActionId?: number;
    Enabled?: boolean;
}

export interface RoleMenu { 
    RoleMenuId?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    RoleId?: number;
    MenuId?: number;
    HasAccess?: boolean;
}

export interface SaveRoleActionsModel { 
    RoleName?: string;
    Data?: TreeNode[];
}

export interface SearchParams { 
    Request?: SearchRequest;
    Take?: number;
    Page?: number;
    Sort?: any[];
}

export interface SearchRequest { 
    TypeFullName?: string;
    EntityJson?: string;
    CustomFilters?: CustomFilter[];
}

export interface SearchSortRequest { 
    field?: string;
    dir?: number;
}

export interface ServerInfo { 
    OsVersion?: string;
    ProcessorCount?: number;
    CpuUsage?: number;
    MemoryUsage?: number;
    DiskUsage?: number;
    ActiveUserCount?: number;
}

export interface SimpleDateTimeConverter { 
    CanRead?: boolean;
    CanWrite?: boolean;
}

export interface SimpleDateTimeConverter2 { 
    CanRead?: boolean;
    CanWrite?: boolean;
}

export interface TreeNode { 
    Label?: string;
    Data?: any;
    Children?: TreeNode[];
    Expanded?: boolean;
    Parent?: TreeNode;
    Checked?: boolean;
}



export interface UserLocal { 
    Name?: string;
    Token?: string;
}

export interface V_AppUser { 
    RoleName?: string;
    IsAdmin?: boolean;
    AppUserId?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    IpAddress?: string;
    RoleId?: number;
    Username?: string;
    Password?: string;
    LoginCount?: number;
    Title?: string;
}

export interface V_Menu { 
    ParentName?: string;
    MenuId?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    Name?: string;
    Route?: string;
    Description?: string;
    OrderNum?: number;
    ParentId?: number;
    Visible?: boolean;
    Icon?: string;
    Childs?: Menu[];
}

export interface V_RoleAppUser { 
    RoleId?: number;
    RoleName?: string;
    IsAdmin?: boolean;
    AppUserId?: number;
    Username?: string;
    Password?: string;
    LoginCount?: number;
}

export interface V_RoleControllerAction { 
    RoleId?: number;
    RoleActionId?: number;
    ActionId?: number;
    ControllerId?: number;
    RoleName?: string;
    ControllerName?: string;
    ActionName?: string;
    Enabled?: boolean;
    IsAdmin?: boolean;
}

export interface V_RoleMenu { 
    MenuId?: number;
    Name?: string;
    Route?: string;
    Description?: string;
    OrderNum?: number;
    ParentId?: number;
    Visible?: boolean;
    Icon?: string;
    RoleMenuId?: number;
    RoleId?: number;
    HasAccess?: boolean;
    ParentName?: string;
}




