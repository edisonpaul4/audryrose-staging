import React, { Component } from 'react';
import { withRouter } from 'react-router';
// import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Grid, Segment, Header, Form, Image, Message } from 'semantic-ui-react';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
			token: null,
			user: null
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const { username, password } = this.state;

    if(!username || !password) {
      // display error to user
      return;
    }

    this.props.login(username, password);
  }

  handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  componentWillReceiveProps(nextProps) {
		// console.log(this.props);
		console.log('componentWillReceiveProps: ' + JSON.stringify(nextProps));
		
		if(nextProps.isLoggedIn) {
			const nextPath = nextProps.location.query.next ? nextProps.location.query.next : '/dashboard';
			console.log('logged in, redirect to ' + nextPath);
			this.props.router.push(nextPath);
		} else if (this.state.token) {
			console.log('not logged in, load session from token ' + nextProps.token);
			this.props.loadSession(nextProps.token);
		}

  }

  render() {
		console.log("render login");
    const { error, isLoggingIn } = this.props;
		const errorMessage = error ? <Message negative>{error}</Message> : null;
    return (
			<Grid.Column className='login-box'>
				<Header size='small' textAlign='center'><Image src='/imgs/logo.png' width='23' height='27' alt='Audry Rose Logo' /></Header>
		    <Form onSubmit={this.handleFormSubmit}>
					<Segment raised loading={isLoggingIn}>
						{errorMessage}
						<Form.Input name='username' type='text' label='Username' icon='user' iconPosition='left' onChange={this.handleTextFieldChange} required />
						<Form.Input name='password' type='password' label='Password' icon='lock' iconPosition='left' onChange={this.handleTextFieldChange} required />
						<Form.Button type='submit' disabled={isLoggingIn} primary fluid>{isLoggingIn ? 'Logging in...' : 'Log in'}</Form.Button>
					</Segment>
		    </Form>
			</Grid.Column>
    );
  }
}

export default withRouter(Login);
