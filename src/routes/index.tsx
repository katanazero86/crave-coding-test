import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// components
import Index from '../pages/Index';
import PassApplicants from '../pages/PassApplicants/PassApplicants';

export default function RouteWithLayout(): React.ReactElement {
  return (
    <Router>
      <Switch>
        <Route path='/' component={Index} exact />
        <Route path='/pass-applicants' component={PassApplicants} exact />
        <Route>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Router>
  );
}
