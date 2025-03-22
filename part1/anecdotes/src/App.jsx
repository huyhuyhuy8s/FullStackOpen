import { useState } from "react";

const Title = ({ title, selected, votes, anecdotes }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
    </div>
  );
};

const Button = ({ handler, text }) => {
  return <button onClick={handler}>{text}</button>;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const mostVotes = Math.max(...votes);

  const handleVote = (index) => {
    console.log("b", index);
    const nextVotes = votes.map((c, i) => {
      if (i === index) return c + 1;
      else return c;
    });
    setVotes(nextVotes);
  };

  const handleClick = () => {
    const result = Math.floor(Math.random() * 8);
    setSelected(result);
  };

  return (
    <div>
      <Title
        title="Anecdote of the day"
        selected={selected}
        votes={votes}
        anecdotes={anecdotes}
      />
      <Button handler={() => handleVote(selected)} text="vote" />
      <Button handler={handleClick} text="anecdote" />
      <Title
        title="Anecdote with most votes"
        selected={votes.indexOf(mostVotes)}
        votes={votes}
        anecdotes={anecdotes}
      />
    </div>
  );
};

export default App;
