import hug

from database.databases import session
from database.models    import columns
from utils              import toJson

from database.models.columns import Columns
from database.models.tasks   import Tasks

@hug.get('/all')
def getCols():
    # cols = Columns.query.order_by(Columns.position)
    cols = session.query(Columns).order_by(Columns.position).all()
    json = []

    for col in cols:
        json.append({
            'id':       str(col.id),
            'title':    col.title,
            'position': col.position,
            'item':     toJson(col.tasks, Tasks),
            'class': 'rounded'
        })
    
    return json


@hug.post('/create')
def createCol(body):
    title    = body.get('title')
    position = body.get('position') or '0'
    
    if(title == None or title == ''):
        return 'Veuillez renseigner le champs titre !'
    
    cols = session.query(Columns).count()
    col = Columns(title=title, position=cols + 1)
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

@hug.patch('/position')
def updatePosition(col_id, position):
    col_id   = int(col_id)
    position = int(position)

    column  = session.query(Columns).filter_by(id = col_id).first()
    columns = session.query(Columns).all()

    old_pos = column.position
    
    if not column:
        return 'La colone n\'existe pas !'
    
    if old_pos == position:
        return False
    
    for col in columns:
        if(col.position <= position and col.position >= old_pos):
            if col.position - 1 != 0: 
                col.position -= 1

        elif col.position >= position and col.position <= old_pos:
            col.position += 1

    column.position = position    
    session.commit()

    return 'ok'