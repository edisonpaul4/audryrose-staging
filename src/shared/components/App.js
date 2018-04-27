import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import './App.css';
import NavigationContainer from '../containers/NavigationContainer.js';

class App extends Component {
  render() {
		let isBasic = false;
		this.props.routes.map(function(route) {
			if (route.isBasic) isBasic = true;
			return isBasic;
		});
		const navigation = !isBasic ? <NavigationContainer path={this.props.location.pathname} /> : null;
		const isCenteredBox = isBasic; // Give this more logic later if need other basic page types
    return (
      <Grid className={isCenteredBox ? 'centered-layout' : 'fluid-layout'} verticalAlign={isCenteredBox ? 'middle' : undefined} centered={isCenteredBox} padded>
				{navigation}
        {this.props.children}
      </Grid>
    );
  }
}

export default App;
