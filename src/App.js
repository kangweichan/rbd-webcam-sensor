import React from "react";
import DragAndDrop from "./DragAndDrop";

export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1 style={{ padding: "20px" }}>Hand-controlled rbd</h1>
        <div style={{ display: "flex" }}>
          <div>
            <div>
              <video width="600" height="320" id="videoInput" />
            </div>
            <div>
              <canvas width="600" height="320" id="canvasOutput" />
            </div>
          </div>
          <DragAndDrop />
        </div>
      </div>
    );
  }
}
