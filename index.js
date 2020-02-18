const express = require('express')

const myApp = express()
myApp.use(express.json())

// controller
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

// Routes
const ProjectRouter = express.Router()
const myProjects = new Project()

ProjectRouter
  .post('', (req, res) => {
    const { id, title } = req.body
    myProjects.create(id, title)
    return res.send()
  })
  .post('/:id/tasks', (req, res) => {
    const [id, title] = [req.params.id, req.body.title]
    myProjects.addTask(id, title)
    return res.send()
  })
  .get('', (req, res) => {
    return res.status(200).json(myProjects.list())
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


myApp.use('/projects', ProjectRouter)
myApp.listen(3000)