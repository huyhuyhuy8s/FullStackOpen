import { useState } from "react";

const Display = ({ name }) => {
  return <h2>{name}</h2>;
};

const Button = ({ onClick, option }) => {
  return (
    <button value={option} onClick={onClick}>
      {option}
    </button>
  );
};

const StatisticLine = ({ text, value, extension = "" }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>
        {value} {extension}
      </td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return <p>No feedback given</p>;
  } else {
    return (
      <table>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive} extension="%" />
      </table>
    );
  }
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const label = ["give feedback", "statistic"];

  const handleGood = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);
    handleClick({ updatedGood: updatedGood });
  };

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1;
    setNeutral(updatedNeutral);
    handleClick({ updatedNeutral: updatedNeutral });
  };

  const handleBad = () => {
    const updatedBad = bad + 1;
    setBad(updatedBad);
    handleClick({ updatedBad: updatedBad });
  };

  const handleClick = (props) => {
    let g = good,
      n = neutral,
      b = bad;
    if (props.updatedGood !== undefined) g = props.updatedGood;
    else if (props.updatedNeutral !== undefined) n = props.updatedNeutral;
    else b = props.updatedBad;

    setAll(g + n + b);
    setAverage((g - b) / (g + n + b));
    setPositive((g / (g + n + b)) * 100);
  };

  return (
    <div>
      <Display name={label[0]} />
      <Button option="good" onClick={handleGood} />
      <Button option="neutral" onClick={handleNeutral} />
      <Button option="bad" onClick={handleBad} />
      <Display name={label[1]} />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
