const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URL
console.log('connecting to', url)
mongoose.connect(url).then(() => console.log('connected to mongoose')).catch(error => console.log('error connecting to mongoose:', error.message))
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    match: [/^\d{3}-\d+$/, 'phone number must be in the format xxx-xxxx....']
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('person', personSchema)