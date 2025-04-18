const Notification = ({ notification }) => {
  return (
    <div className="bg-indigo-700 text-4xl text-white w-full">
      {notification && <div>{notification}</div>}
    </div>
  )
}

export default Notification
