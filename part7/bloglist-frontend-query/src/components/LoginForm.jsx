const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return (
    <form data-testid="login-form" onSubmit={handleLogin} className="flex flex-col gap-2 justify-center items-center bg-white w-100 h-120 mx-auto my-15 rounded">
      <h2 className="text-center font-bold text-2xl mb-10 mt-15">log in to application</h2>
      <div>
        <span  className="font-bold">username</span>
        <input data-testid='username' className="border-1 border-slate-300 rounded-md w-full focus:border-teal-700 focus:outline-none px-5 py-1 my-2"
          type="text" value={username} onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <span  className="font-bold mb-2">password</span>
        <input data-testid='password' className="border-1 border-slate-300 rounded-md focus:border-teal-700 focus:outline-none px-5 w-full py-1 mt-2"
          type="password" value={password} onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" className="hover:bg-teal-700 bg-teal-600 text-white w-70 py-1 rounded my-20 font-medium">login</button>
    </form>
  )
}

export default LoginForm
