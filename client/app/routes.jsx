import React from "react";
import { Route } from "react-router";

// Parent
import Application from "./components/Application";
// Children
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import UserHome from "./components/UserHome";
import Setup from "./components/setup";
import Recipient from "./components/recipient";

import PageNotFound from "./components/PageNotFound";

export default (
  	<Route component={Application}>
    	<Route path="/" component={SignIn} />

    	<Route path="/sign-up" component={SignUp} />
    	<Route path="/home" component={UserHome} />
    	<Route path="/setup" component={Setup} />
    	<Route path="/invite/:id" component={Recipient} />
    	<Route path="*" component={PageNotFound} />
    </Route>
);