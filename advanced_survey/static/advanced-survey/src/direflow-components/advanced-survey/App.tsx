import React, { FC } from 'react';
import { Styled } from 'direflow-component';
import styles from './App.css';

const App: FC = (props) => {
  return (
    <Styled styles={styles}>
      <div className="row">
        <div className="col-lg-12">
          <h1>Works!</h1>
        </div>
      </div>
    </Styled>
  );
};

export default App;
