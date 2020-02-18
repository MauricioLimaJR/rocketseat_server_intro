const express = require('express')

const myApp = express()

// Controller
class Project {

  constructor () {
    this.projects = []
  }
  
  create (id, title) {
    this.projects.push({ id, title, tasks: [] })
  }

  addTask (id, task) {
    this.projects.forEach(p => { if (p.id === id) p.tasks.push(task)})
  }

  findById (id) {
    const projectIndex = this.projects.findIndex(p => p.id === id)
    return projectIndex >= 0 ? this.projects[projectIndex] : false
  }

  list () {
    return this.projects
  }

  rename (id, newTitle) {
    this.projects.forEach(p => { if (p.id === id) p.title = newTitle})
  }

  remove (id) {
    console.log(this.projects.findIndex(p => p.id === id))
    this.projects.splice(this.projects.findIndex(p => p.id === id), 1)
  }
}

// Router
const ProjectRouter = express.Router()
const myProjects = new Project()

const findProjectById = (req, res, next) => {
  const { id } = req.params
  if (!id) return res.status(400).send("Id can not be null or undefined")
  
  const project = myProjects.findById(id)
  if (!project) return res.status(404).send("Project not found")

  return next()
}

ProjectRouter
  .post('', (req, res) => {
    const { id, title } = req.body
    myProjects.create(id, title)
    return res.send()
  })
  .get('', (req, res) => {
    return res.status(200).json(myProjects.list())
  })

ProjectRouter
  .use('/:id', findProjectById)
  .post('/:id/tasks', (req, res) => {
    const [id, title] = [req.params.id, req.body.title]
    myProjects.addTask(id, title)
    return res.send()
  })
  .put('/:id', (req, res) => {
    const [id, title] = [req.params.id, req.body.title]
    myProjects.rename(id, title)
    return res.send()
  })
  .delete('/:id', (req, res) => {
    myProjects.remove(req.params.id)
    return res.send()
  })

// Server Config
let COUNTER = 0
const countRequests = (req, res, next) => {
  COUNTER = COUNTER + 1
  console.log(`Request number ${COUNTER}`)
  next()
}

myApp.use(express.json())
myApp.use(countRequests)
myApp.use('/projects', ProjectRouter)
myApp.listen(3000)