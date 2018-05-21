import React, { Component } from 'react';
import { withRouter } from 'react-router';
// import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Grid, Segment, Header, Form, Image, Message } from 'semantic-ui-react';

class EmailVerification extends Component {
    constructor(props) {
        super(props);
       
    }

   

    render() {
        return (
            <Grid.Column className='login-box'>
                <Header size='small' textAlign='center'><Image src='/imgs/logo.png' width='23' height='27' alt='Audry Rose Logo' /></Header>
            </Grid.Column>
        );
    }
}

export default withRouter(EmailVerification);
