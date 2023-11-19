import React from 'react';
import styles from "./App.module.scss"
import ShapeGroup from "./components/routes/ShapeGroup/ShapeGroup";

function App() {
  return (
    <div className={styles.app}>
      <ShapeGroup/>
    </div>
  );
}

export default App;
