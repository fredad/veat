import React from "react";
import { Route } from "react-router";

// Parent
import Application from "./components/Application";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import UserHome from "./components/UserHome";
import Setup from "./components/setup";
import Recipient from "./components/recipient";
import Response from "./components/response";

import PageNotFound from "./components/PageNotFound";

export default (
  	<Route component={Application}>
    	<Route path="/" component={SignIn} />

    	<Route path="/signup" component={SignUp} />
    	<Route path="/home" component={UserHome} />
    	<Route path="/setup" component={Setup} />
    	<Route path="/invite/:id" component={Recipient} />
    	<Route path="/response/:id" component={Response} />
    	<Route path="*" component={PageNotFound} />
    </Route>
);