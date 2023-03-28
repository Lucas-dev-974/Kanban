from databases import engine

from models.columns import Columns, Base
from models.tasks   import Tasks,   Base


''' Create all table'''
Base.metadata.create_all(engine)