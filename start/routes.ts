import './routes/docusign'
import Route from '@ioc:Adonis/Core/Route'
Route.get('/', async ({ view }) => {
  return view.render('login')
})
Route.get('/dashboard', 'DashboardController.index').middleware('auth:web')
Route.resource('companies', 'CompaniesController')
Route.resource('collaborators', 'CollaboratorsController')
// Route.resource('invitations', 'InvitationsController').apiOnly()
Route.put('/invitations/:id', 'InvitationsController.update').middleware('auth:web')
Route.post('/invitations', 'InvitationsController.store').middleware('auth:web')
Route.delete('/invitations/:id', 'InvitationsController.destroy').middleware('auth:web')
Route.post('/login', 'AuthController.store')
Route.get('/login', 'AuthController.create')
Route.post('/logout', 'AuthController.destroy')
Route.get('/users/me', async ({ auth }) => {
  await auth.user?.load((builder) => {
    builder.preload('company')
    builder.preload('collaborator')
  })
  return auth.user
}).middleware('auth:web')
