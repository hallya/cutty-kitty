import React from 'react';
import PropTypes from 'prop-types';
import './Vote.scss';
import Cat from '../../components/Cat/Cat';
import Picture from '../../components/Picture/Picture';

function Vote(props) {
  const { 
    leftCat,
    rightCat,
    updateVoteView,
    roundNumber
  } = props;

  return (
    <>
      <div className="candidates-container">
        {
          leftCat &&
          <Cat className="cat-candidate">
            <figure>
              <Picture url={leftCat.url} />
              <figcaption><span role="img" aria-label="Already see this it">👀</span> {leftCat.view}</figcaption>
            </figure>
            <button onClick={() => updateVoteView(leftCat.id)}>
              <span role="img" aria-label="love this one">❤️</span>
            </button>
          </Cat>
        }
        {
          rightCat &&
          <Cat className="cat-candidate">
            <figure>
              <Picture url={rightCat.url} />
              <figcaption><span role="img" aria-label="Already see this it">👀</span> {rightCat.view}</figcaption>
            </figure>
            <button onClick={() => updateVoteView(rightCat.id)}>
              <span role="img" aria-label="love this one">❤️</span>
            </button>
          </Cat>
        }
      </div>
      <h1>Battle n°{roundNumber}</h1>
    </>
  );
}

Vote.propTypes = {
  leftCat: PropTypes.object,
  rightCat: PropTypes.object,
  updateVoteView: PropTypes.func,
  roundNumber: PropTypes.number
};
Vote.displayName = 'Vote';
export default Vote;
