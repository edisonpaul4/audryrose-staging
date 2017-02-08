import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Message } from 'semantic-ui-react';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
			isLoggedIn: null,
			token: null
    };
  }
  
	componentDidMount() {
		// console.log(this.props);
		console.log('componentDidMount: ' + JSON.stringify(this.props));
		// this.props.logout(this.state.token);
		
		if (this.props.isLoggedIn || this.props.token) {
			console.log('logged in, sending logout request');
			this.props.logout(this.props.token);
		} else {
			console.log('logged out, redirect to /login');
			this.props.router.push('/login');
		}
  }
	
	componentWillUpdate() {
		console.log('componentWillUpdate: ' + JSON.stringify(this.state));
		if (!this.state.isLoggedIn) {
			this.props.router.push('/login');
		}
	}
	
  render() {
		console.log("render logout");
    return (
			<Grid centered>
				<Grid.Row>
					<p>&nbsp;</p>
				</Grid.Row>
				<Grid.Row>
					<Message>
		        <Message.Header>Logging out...</Message.Header>
					</Message>
				</Grid.Row>
			</Grid>
    );
  }
}

export default withRouter(Login);
