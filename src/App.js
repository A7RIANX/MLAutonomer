import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

// import logo from "./logo.svg";
import Nav from "./Nav";
import Automation from "./Automation";

function App() {
  //Title
  document.title = "MLAutonomer";

  const Landing = () => (
    <div className="pt-5" >
      <h1 className="mt-5 display-1">MLAutonomer</h1>
      <p className="lead mb-5">
        Gives Label name in the provided field, then just Drop images for create model! &#9749;
      </p>
      <Automation />
    </div>
  );

  const About = () => (
    <div>
      <h1 className="mt-5 display-3">Technologies</h1>
      <p className="lead">ReactJS Framework</p>
      <h1 className="mt-5 display-3">Libraries</h1>
      <p className="lead">NPM</p>
      <p className="lead">Bootstrap 5.0.2</p>
      <h1 className="mt-5 mb-4 display-3">Contributors</h1>
      <p className="lead">Pavarisorn Nakjakhae : Full-Stack dev.</p>
      <p className="lead">Somprasit Koteputhorn : Back-end dev.</p>
      <p className="lead">Nuntipat Nakthong : Technical Specialist/ Co-Advisor</p>
      <p className="lead">Asst.prof.Suraphont Toomnak : Project Advisor</p>
    </div>
  );

  return (
    <Router>
      <div className="App pb-5">
        <Nav />
        <Switch>
          <Route path="/" exact component={Landing} />
          {/* <Route path="/about" component={About} /> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
