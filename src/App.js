import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss';
import api from './services/api/api';
import mockCats from './__mock__/cats.json';

const Welcome = lazy(() => import('./views/Welcome/Welcome'));
const Scores = lazy(() => import('./views/Scores/Scores'));
const Vote = lazy(() => import('./views/Vote/Vote'));


function App() {
  const [state, setState] = useState({
    cats: [],
    roundNumber: 1,
    leftIndex: null,
    rightIndex: null
  });

  useEffect(() => {
    async function init() {
      const {images} = await api.getCats();
      const cats = format(images);
      const leftIndex = 0;
      const rightIndex = cats.length - 1;
      setState({
        ...state,
        cats,
        leftIndex,
        rightIndex
      });
    }
    init();
  }, []);
  
  function format(list) {
    return list.map(element => ({
      ...element,
      url: element.url.replace('http', 'https'),
      score: 0,
      view: 0
    }));
  }

  function updateVoteView(catId) {
    const { leftIndex, rightIndex, cats: oldCats } = state;

    const index = oldCats.findIndex((cat) => cat.id === catId);
    
    const roundNumber =  state.roundNumber + 1;
    
    const cats = [...oldCats];
    cats[index].score = oldCats[index].score + 1;
    cats[leftIndex].view = oldCats[leftIndex].view + 1;
    cats[rightIndex].view = oldCats[rightIndex].view + 1;
    
    const candidatesIndex = isFirstRound() 
      ? linearSelectionOfCandidatesIn({leftIndex, rightIndex})
      : randomSelectionOfCandidates();
    setState({
      cats,
      roundNumber,
      ...candidatesIndex
    });
  }

  function linearSelectionOfCandidatesIn({ leftIndex, rightIndex }) {
    return {
      leftIndex: leftIndex + 1,
      rightIndex: rightIndex - 1
    };
  }

  function randomSelectionOfCandidates() {
    const leftIndex = Math.round(state.cats.length * Math.random());
    const rightIndex = Math.round(state.cats.length * Math.random());

    if (leftIndex === rightIndex
      || leftIndex === state.leftIndex
      || rightIndex === state.rightIndex) {
      return randomSelectionOfCandidates();
    }
    return { 
      leftIndex,
      rightIndex
    };
  }

  function isFirstRound() {
    const halfOfCatList = Math.round(state.cats.length / 2);
    const { leftIndex, rightIndex } = state;
    if (leftIndex >= halfOfCatList || rightIndex <= halfOfCatList) {
      return false;
    }
    return true;
  }
 
  const { cats, leftIndex, rightIndex, roundNumber } = state;
  return (
    <Router>
      <main className="App-main">
        <Switch>
          <Route exact path="/">
            <Suspense fallback={<h1>Loading Cutty App ♥...</h1>}>
              <Welcome />
            </Suspense>
          </Route>
          <Route exact path="/scores">
            <Suspense fallback={<h1>Let‘s see actual scores <span role="img" aria-label="Nerd face emoji">🤓</span></h1>}>
              {
                cats.length && <Scores cats={cats} />
              }
            </Suspense>
          </Route>
          <Route exact path="/vote">
            <Suspense fallback={<h1>Now let‘s vote for THE ONE !</h1>}>
              {
                cats.length &&
                <Vote
                  leftCat={cats[leftIndex]}
                  rightCat={cats[rightIndex]}
                  updateVoteView={updateVoteView}
                  roundNumber={roundNumber} />
              }
            </Suspense>
          </Route>
        </Switch>
      </main>
      <footer className="App-footer">
        <nav>
          <NavLink to="/scores">Scores</NavLink>
          <NavLink to="/vote">Vote</NavLink>
        </nav>
      </footer>
    </Router>
  );
}

export default App;
