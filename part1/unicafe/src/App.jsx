import { useState } from 'react'
const Header = ({ name }) => <h1>{name}</h1>
const Button = ({ onClick, title }) => {
  return <button onClick={onClick} style={{ 'margin': '5px' }}>{title}</button>
}
const StatisticLine = (props) => {
  return(
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
    )

}
const Statistics = (props) => {
  console.log(props.total)
    if(props.total !== 0){
  return (
    <>
      <table>
    <StatisticLine text={"good"} value={props.good} />
    <StatisticLine text={"neutral"} value={props.neutral} />
    <StatisticLine text={"bad"} value={props.bad} />
    <StatisticLine text={"total"} value={props.total} />
    <StatisticLine text={"average"} value={props.average} />
    <StatisticLine text={"positive"} value={props.positive} />
    </table>
    </>
    )
}
}
const Total = ({ total }) => <p>total {total}</p>
const Average = ({ value, total }) => <p>average {value / total}</p>
const Positive = ({ good, total }) => <p>positive {good / total * 100 }</p>
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [value, setValue] = useState(0)
const increaseGood = () => {
  const goodUpdate = good + 1
setGood(goodUpdate)
  setTotal(goodUpdate + bad + neutral)
  setValue(value + 1)
}
const increaseNeutral = () => {
  const neutralUpdate = neutral + 1
  setNeutral(neutralUpdate)
  setTotal(neutralUpdate + bad + good)
}
const increaseBad = () => {
const badUpdate = bad + 1
  setBad(badUpdate)
  setTotal(good + badUpdate + neutral)
  setValue(value - 1)
}
  
  return (
    <>
      <Header name={"give feedback"} />
      <Button onClick={increaseGood} title={"good"} />
      <Button onClick={increaseNeutral} title={"neutral"} />
      <Button onClick={increaseBad} title={"bad"} />
      <Header name={"statistics"} />
      <Statistics good={good} bad={bad} neutral={neutral} total={total} average={value / total} positive={good / total * 100}/>
    </>
  )
}

export default App
