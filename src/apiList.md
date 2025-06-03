# we can make different express routers to club some apis together
# use express.router()

authRouter
    -POST /signup
    -POST /login
    -POST /logout

profileRouter
  - GET /profile/view
  - PATCH /profile/edeit
  - PATCH /profile/edit



# pagination

skip(), limit()

skip(0) limit(10) gives first ten users

skip = (page-1)*limit