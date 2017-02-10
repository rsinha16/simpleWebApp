import * as React from 'react';
import { NavMenu } from './NavMenu';

export interface LayoutProps {
    body: React.ReactElement<any>,
    nav: React.ReactElement<NavMenu>
}

export class Layout extends React.Component<LayoutProps, void> {
    
    public render() {
        return (<div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-3'>
                    { this.props.nav }
                </div>
                <div className='col-sm-9'>
                    { this.props.body }
                </div>
            </div>
        </div>
        );
    }
}
