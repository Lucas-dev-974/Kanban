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
    print('column: ', column)

    task = Tasks(title = title, column=column.id)

    session.add(task)
    session.commit()

    return toJson(task, Tasks, True)

@hug.post('/update-position')
def updatePosition(body):
    task_id      = body.get('task_id')
    col_id       = body.get('col_id')
    from_pos = int(body.get('from_pos'))
    to_pos   = int(body.get('to_pos'))

    
    task  = session.query(Tasks).filter_by(id = task_id).first()  

    # Pour les 2 premières conditions
    tsk   = session.query(Tasks).filter_by(position = to_pos).first()

    # Pour les 2 dernières conditions
    tasks = session.query(Tasks).filter_by(column = col_id).all()

    
    # Changement de place juste a coter vers le bas
    if(from_pos + 1 == to_pos):
        old_position = task.position
        task.position = tsk.position
        tsk.position  = old_position
    # Changement de placer juste a coter vers le haut
    elif(from_pos - 1 == to_pos):
        old_position = task.position
        task.position = tsk.position
        tsk.position  = old_position

    # Changement de place sur plusieurs block vers le bas 
    elif(from_pos < to_pos):
        for tsk in tasks:
            task.position= to_pos
            if(tsk.id != task.id and tsk.position <= to_pos and tsk.position >= from_pos):
                tsk.position -= 1
    # Changement de place sur plusieurs block vers le haut
    else:
        for tsk in tasks:
            task.position= to_pos
            if(tsk.id != task.id and tsk.position >= to_pos and tsk.position <= from_pos):
                tsk.position += 1
    session.commit()