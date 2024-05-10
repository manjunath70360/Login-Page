import {Route, Switch, BrowserRouter} from 'react-router-dom'

import Login from "./components/login"
import SuccessLogin "./components/SuccessLogin"
import "./App.css"

const App = ()=> {
return(
      <BrowserRouter/>
      <Switch>
          <Route exact path="/" component={SuccessLogin} />
          <Route exact path="/login" component={LoginForm} />
      </Switch>
      </BrowserRouter>
)
}

export default App;
