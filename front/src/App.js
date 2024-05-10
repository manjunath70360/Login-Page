import {Route, Switch, BrowserRouter} from 'react-router-dom'

import Login from "./components/login"
import SuccessLogin from"./components/SuccessLogin"
import "./App.css"

const App = ()=> {
return(
      <BrowserRouter>
      <Switch>
          <Route exact path="/Home" component={SuccessLogin} />
          <Route exact path="/" component={Login} />
      </Switch>
      </BrowserRouter>
)
}

export default App;
