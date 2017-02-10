export class Auth {
    constructor(){
        const secret = {
            clientID: '123123',
            domain: 'carsontheweb.com',
            responseType: 'token id_token',
            redirectUri: '/login'
        };
    }


    login(username:string, password:string){
        return this._doActualLogin(username, password);
    }

    _doActualLogin(username:string, password:string){
        return new Promise((resolve)=> {
            console.log(username, password);
            setTimeout(()=>{
                resolve({
                    token:"1234567",
                    expires: new Date()
                });
            }, 1000);
        });
    }
}