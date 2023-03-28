import hug

from database.databases import session
from database.models    import columns
from utils              import toJson

from database.models.columns import Columns
from database.models.tasks   import Tasks

@hug.post('/create')
def createTask(body):
    print(body)
    title  = body.get('title')
    col_id = body.get('col_id')
    print('title: ', title)
    if(title == None or title == ''):
        return 'Veuillez rensaigner le champ titre !'

    column = session.query(Columns).filter_by(id = col_id).first()
    print('column: ', column.title)

    task   = Tasks(title = title, column=column.id)

    session.add(task)
    session.commit()

    return toJson(task, Tasks, True)
