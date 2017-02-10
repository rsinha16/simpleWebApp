import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as AuthState from '../store/Auth';

type LoginProps =
    AuthState.AuthState     // ... state we've requested from the Redux store
    & typeof AuthState.actionCreators   // ... plus action creators we've requested
;  

export class Login extends React.Component<any, any> {
    constructor(props){
        super(props);
        const redirectRoute = this.props.location.query.next || '/login';
        this.state = { username: '', password: '', redirectRoute: redirectRoute };
    }

    private onChange(inputName, e){
        this.setState({
            [`${inputName}`]: e.target.value,
        });
    }

    private login(e:any){
        e.preventDefault();
        try{
            this.props.loginUser(this.state.username, this.state.password, this.state.redirectRoute);
        }catch(err){
            console.log(err);
        }
    }


    public render(){
        return (
            <div className='col-xs-12 col-md-6 col-md-offset-3'>
            <h3>Log in to view protected content!</h3>
            {this.props.statusText ? <div className='alert alert-info'>{this.props.statusText}</div> : ''}
                <form className="form-signin"
                    onSubmit={(e)=>this.login(e)}
                >
                    <input type="text" className="form-control input-lg" placeholder="Username" onChange={(e)=>this.onChange('username', e)}/>
                    <input type="password" className="form-control input-lg" placeholder="Password" onChange={(e)=>this.onChange('password', e)}/>
                    <button type="submit" className="btn btn-lg btn-primary btn-block">Login</button>
                </form>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.auth, // Selects which state properties are merged into the component's props
    AuthState.actionCreators                 // Selects which action creators are merged into the component's props
)(Login);