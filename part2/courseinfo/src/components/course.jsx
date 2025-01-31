const Course = (props) => {
return (
  <>
    {props.courses.map(course => (
      <div key={course.id}>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    ))}
  </>
);
}
const Header = (props) => {
  return (
      <h1>{props.course.name}</h1>
    )
}
const Part = (props) => {
  console.log(props)
  return(
      <p>
        {props.name} {props.number}
      </p>
    )
}
const Content = (props) => {
  return (
    <>
{props.parts.map(part => <Part key={part.id} name={part.name}  number={part.exercises} />
)}
    </>
    )
}
const Total = (props) => {
  const total = props.parts.reduce((acc, part) => acc + part.exercises, 0)
  return <p>total {total}</p>
}
export default Course