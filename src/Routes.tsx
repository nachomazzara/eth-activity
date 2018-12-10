import * as React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { locations } from 'locations'

import Page from 'components/Page'
import ActivityPage from 'components/ActivityPage'
// import Homepage from 'components/HomePage'
import AuctionPage from 'components/AuctionPage'

export default class Routes extends React.Component {
  renderRoutes() {
    return (
      <Switch>
        <Route
          exact={true}
          path={locations.auction()}
          component={AuctionPage}
        />
        {/* <Route exact={true} path={locations.root()} component={Homepage} /> */}
        <Route
          exact={true}
          path={locations.activityPage()}
          component={ActivityPage}
        />
        <Redirect to={locations.root()} />
      </Switch>
    )
  }

  render() {
    return <Page>{this.renderRoutes()}</Page>
  }
}
