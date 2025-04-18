const WhoLoggedIn = ({ user, logout }) => {
  if(!user) {
    return null
  }
  return (
    <div>
      <p className="text-center text-sm font-bold">{user.name} logged in</p>
      <button className="block mx-auto bg-teal-500 hover:bg-teal-600 rounded p-2 text-white my-5 hover:cursor-pointer" onClick={logout}>log out</button>
    </div>
  )
}

export default WhoLoggedIn
