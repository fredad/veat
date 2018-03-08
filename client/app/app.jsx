import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import routes from './routes.jsx';

ReactDOM.render(
	<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}><Router history={browserHistory}>{routes}</Router></MuiThemeProvider>,
	document.getElementById('app')
);