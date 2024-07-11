import "./App.css";
import styled from "styled-components";
import { ObjectDetector } from "./components/objectDetector";
import TextContainer from "./components/TextContainer";
import { useState } from "react";

const AppContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 50%;
  background-color: #1c2127;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

function App() {
  const [predictions, setPredictions] = useState([]);
  const [list, setList] = useState([]);

  return (
    <>
      <AppContainer>
        <ObjectDetector
          predictions={predictions}
          setPredictions={setPredictions}
        />
        <button
          onClick={() => {
            if (predictions.length !== 0)
              setList((list) => {
                const temp = [];
                for (let value of predictions) {
                  if (
                    !list.includes(value.class) &&
                    !temp.includes(value.class)
                  )
                    temp.push(value.class);
                }
                return [...list, ...temp];
              });
          }}
          style={{
            marginTop: "20px",
          }}
        >
          Сохранить
        </button>
      </AppContainer>
      <TextContainer text={list} />
    </>
  );
}

export default App;
