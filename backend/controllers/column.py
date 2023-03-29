import hug

from database.databases import session
from database.models    import columns
from utils              import toJson

from database.models.columns import Columns
from database.models.tasks   import Tasks

@hug.get('/all')
def getCols():
    cols = session.query(Columns).all()
    json = []

    for col in cols:
        json.append({
            'id':       str(col.id),
            'title':    col.title,
            'position': col.position,
            'item':     toJson(col.tasks, Tasks)
        })
    
    return json


@hug.post('/create')
def createCol(body):
    title    = body.get('title')
    position = body.get('position') or '0'
    
    if(title == None or title == ''):
        return 'Veuillez renseigner le champs titre !'
    
    col = Columns(title=title, position=position)
    session.add(col)
    session.commit()

    return toJson(col, Columns, True)

@hug.post('/switch')
def switchColumn(body):
    task_id    = body.get('task_id')
    new_col_id = body.get('new_col_id')

    task = session.query(Tasks).filter_by(id = task_id).first()

    task.column = new_col_id
    session.commit()
    session.flush()
    
    return 'ok'