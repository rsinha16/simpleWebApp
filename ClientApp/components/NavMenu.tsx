import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as AuthState from '../store/Auth';


export class NavMenu extends React.Component<any, any> {
    public render() {
        const { isAuthenticated } = this.props;
        return ( 
        <div className='main-nav'>
                <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={ '/' }>CarIntaker</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <Link to={ '/' } activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </Link>
                        </li>
                        <li>
                            <Link to={ '/counter' } activeClassName='active'>
                                <span className='glyphicon glyphicon-education'></span> Counter
                            </Link>
                        </li>
                        <li>
                            <Link to={ '/fetchdata' } activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Fetch data
                            </Link>
                        </li>
                        {isAuthenticated ? this.renderLogout() : this.renderLogin()}
                    </ul>
                </div>
            </div>
        </div>
        );
    }

    private renderLogin(){
        return (
            <li>
                <Link to={ '/Login'} activeClassName='active'>
                    <span className='glyphicon glyphicon-lock'></span> Login
                </Link>
            </li>
        )
    }

    private renderLogout() {
        return (
            <li>
                <a href='#' onClick={this.props.logoutUser}>
                    <span className='glyphicon glyphicon-pencil'></span> Logout
                </a>
            </li>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.auth, // Selects which state properties are merged into the component's props
    AuthState.actionCreators                 // Selects which action creators are merged into the component's props
)(NavMenu);


