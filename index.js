/**
 * GoStack Bootcamp
 * Desafio 1: Conceitos do NodeJS
 * @author Maurício Lima
 * @see https://github.com/MauricioLimaJR/rocketseat_server_intro
 */

const express = require('express')

const myApp = express()

// Controller config

/**
 * Product Methods
 */
class Project {

  constructor () {
    this.projects = []
  }
  
  create (id, title) {
    const project = { id, title, tasks: [] }
    this.projects.push(project)
    return project
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

// Router config

const ProjectRouter = express.Router()
const myProjects = new Project()

const findProjectById = (req, res, next) => {
  const { id } = req.params
    
  const project = myProjects.findById(id)
  if (!project) return res.status(400).json({ error: "Project not found" })

  req.project = project
  return next()
}

// Default Router
ProjectRouter
  /**
   * Create and save a project
   */
  .post('', (req, res) => {
    const { id, title } = req.body
    return res.json(myProjects.create(id, title))
  })
  /**
   * Get a list of all saved projects
   */
  .get('', (req, res) => {
    return res.status(200).json(myProjects.list())
  })

// Router for 'id' param urls
ProjectRouter
  // Verify if project exists by project ID 
  .use('/:id', findProjectById)
  /**
   * Save a project's task
   */
  .post('/:id/tasks', (req, res) => {
    const [id, title] = [req.params.id, req.body.title]
    myProjects.addTask(id, title)
    return res.json(req.project)
  })
  /**
   * Update the project title
   */
  .put('/:id', (req, res) => {
    const [id, title] = [req.params.id, req.body.title]
    myProjects.rename(id, title)
    return res.json(req.project)
  })
  /**
   * Remove a project by id
   */
  .delete('/:id', (req, res) => {
    myProjects.remove(req.params.id)
    return res.send()
  })

// Server Config

const countRequests = (req, res, next) => {
  console.count('Request number')
  next()
}

myApp.use(express.json())

myApp.use(countRequests)
myApp.use('/projects', ProjectRouter)

myApp.listen(3000)