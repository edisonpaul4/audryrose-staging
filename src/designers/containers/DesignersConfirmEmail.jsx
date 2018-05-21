import { connect } from 'react-redux';
import { confirmVendorOrderEmail } from '../actions';
import React from 'react';
import { withRouter } from 'react-router';
// import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Grid, Segment, Header, Form, Image, Message } from 'semantic-ui-react';

const select = state => ({
    emailConfirmed: state.designers.emailConfirmed
});

const actions = {
    confirmVendorOrderEmail
};

class EmailVerification extends React.Component {
    componentWillMount() {
        this.props.confirmVendorOrderEmail(this.props.params.order);       
        
    }
    render() {
        return (
            <Grid.Column className='login-box'>
                <Header size='small' textAlign='center'><Image src='/imgs/logo.png' width='23' height='27' alt='Audry Rose Logo' /></Header>
                <Message positive>Email has been confirmed! Order: {this.props.params.order}</Message>
            </Grid.Column>
        );
    }
}
export default connect(select, actions)(EmailVerification);