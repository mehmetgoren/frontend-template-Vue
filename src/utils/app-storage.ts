import { UserLocal } from '@/models/entities';

export module AppStorage{

    export const host = "http://192.168.0.21:50";
    const server = "";//"/Server.REST";
    export const serverAddress = host + server;
    

    //Bunlar redux store da tutulacak, burası zaten yanlış buyrada tutulması.
    export function getUser(): UserLocal {
        // const currentStore = store.getState();
        // if (currentStore&&currentStore.reducerLogin){
        //     return currentStore.reducerLogin.userLocal;
        // }
        // return null;
        let localData: string = sessionStorage.getItem(serverAddress + "_user");
        if (localData) {
            return JSON.parse(atob(localData));
        }
        return null;
    }
    export function setUser(userLocal: UserLocal) {
        if (userLocal) {
            sessionStorage.setItem(serverAddress + "_user", btoa(JSON.stringify(userLocal)));
        }
    }
    export function removeUser() {
        //clearTokenFromStorage();
        sessionStorage.removeItem(serverAddress + "_user");
       // BrowserHistory.push("/login");
        //window.location.href = "";
    }
    export function getUserIfNotAuthenticatedThenLogOut(): UserLocal {
        let u = getUser();
        if (!u) {
            alertify.error("Access Denied");
            removeUser();
            throw new Error("access denied")
        }
        return u;
    }

    export function getToken(): string{
        const userLocal = getUser();
        if (userLocal)
            return userLocal.Token;
        
        return null;    
    }

    export function logout(){
        removeUser();
        window.location.href = "";
        //history.push("/");
    }
    //
}