import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
const words = ["test", "word", "apple", "orange", "calculator", "animal", "earth", "hangman"];

export default function App() {
  const [word, setWord] = useState({ original: "", hidden: [] });
  const [attempts, setAttempts] = useState(0);
  const [triedCharacters, setTriedCharacters] = useState([]);
  const generateRandomWord = (words) => {
    let wordFromArray = words[Math.floor(Math.random() * words.length)];
    let hiddenWord = new Array(wordFromArray.length).fill("_");
    setWord({ original: wordFromArray, hidden: hiddenWord });
  };
  const restart = () => {
    generateRandomWord(words);
    setAttempts(0);
    setTriedCharacters([]);
  };
  let wordRef = useRef();
  let triedCharactersRef = useRef();
  let attemptsRef = useRef();
  attemptsRef.current = attempts;
  triedCharactersRef.current = triedCharacters;
  wordRef.current = word;
  useEffect(() => {
    generateRandomWord(words);

    window.addEventListener("keypress", (event) => {
      let letter = String.fromCharCode(event.keyCode);
      let indexes = [];
      if (
        wordRef.current.hidden.includes(letter) ||
        triedCharactersRef.current.includes(letter) ||
        (attemptsRef.current === 5 && wordRef.current.hidden.join("") !== wordRef.current.original)
      )
        return;
      for (let i = 0; i < wordRef.current.original.length; i++) {
        if (wordRef.current.original[i] === letter) {
          indexes.push(i);
        }
      }
      if (indexes.length > 0) {
        let array = [...wordRef.current.hidden];
        indexes.forEach((i) => {
          array[i] = letter;
        });

        setWord((prevWord) => {
          return {
            ...prevWord,
            hidden: array,
          };
        });
      } else {
        let triedchars = [...triedCharactersRef.current];
        triedchars.push(letter);
        setTriedCharacters(triedchars);
        setAttempts((prevAttemp) => prevAttemp + 1);
      }
    });
  }, []);

  useEffect(() => {
    if (word.original === word.hidden.join("") && word.original !== "") {
      console.log("Victory");
    }
  }, [word.hidden, word.original]);

  return (
    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", minHeight: "100vh" }}>
      <h1>You have {5 - attempts} attempts left.</h1>

      <img width={800} src={require(`../src/assets/${attempts}.png`)}></img>
      <h2 style={{ letterSpacing: "5.5px" }}>{word.hidden.join("")}</h2>

      <h4 style={{ color: "red" }}>
        Incorrect characters: <span style={{ letterSpacing: "5px" }}>{triedCharacters.join(",")}</span>
      </h4>

      {attempts === 5 && word.original !== word.hidden.join("") ? (
        <>
          <h1 style={{ color: "red" }}>Congrats, you have lost</h1>
          <button onClick={restart}>Restart</button>
        </>
      ) : null}
      {attempts <= 5 && word.original === word.hidden.join("") ? (
        <>
          <h1 style={{ color: "green" }}>Congrats, you have won</h1>
          <button onClick={restart}>Restart</button>
        </>
      ) : null}
    </div>
  );
}

// import React, { Component } from "react";

// export default class App extends Component {
//   state = {
//     original: "",
//     hidden: [],
//   };

//   words = ["apple", "orange", "kidney", "longbow", "astral", "heavenly", "celestial", "earth", "ground", "correct"];
//   componentDidMount() {
//     this.generateWord(this.words);
//     window.addEventListener("keypress", (event) => {
//       let letter = String.fromCharCode(event.keyCode);
//       let indexes = [];
//       for (let i = 0; i < this.state.original.length; i++) {
//         if (this.state.original[i] === letter) indexes.push(i);
//       }
//       if (indexes.length > 0) {
//         let array = [...this.state.hidden];
//         indexes.forEach((i) => {
//           array[i] = letter;
//         });

//         this.setState({ hidden: array }, () => {
//           if (this.state.original === this.state.hidden.join("")) {
//             console.log("Victory");
//           } else {
//             console.log("more to go");
//           }
//         });
//       }
//     });
//   }

//   UNSAFE_componentWillUpdate(prevProps, nextState) {
//     console.log(this.state);
//     console.log(nextState);
//   }
//   shouldComponentUpdate(prevProps, nextState) {
//     return this.state.hidden.join("") !== nextState.hidden.join("");
//   }
//   generateWord(words) {
//     let word = words[Math.floor(Math.random() * words.length)];
//     let hidden = new Array(word.length).fill("_");
//     this.setState({ original: word, hidden });
//   }
//   render() {
//     return (
//       <div className="app">
//         <h2>{this.state.hidden.join("")}</h2>
//         <h2>{this.state.original}</h2>
//       </div>
//     );
//   }
// }
