from hug.middleware import CORSMiddleware
import hug

from controllers import column, task

api = hug.API(__name__)
api.http.add_middleware(CORSMiddleware(api, allow_origins=['*'])) # allow_origins à restreindre pour le déploiement

api.extend(column, '/api/column')
api.extend(task, '/api/task')