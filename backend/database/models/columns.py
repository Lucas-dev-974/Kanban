from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship, Mapped
from .tasks import Tasks

try:
    from databases import Base
except:
    from ..databases import Base
    
class Columns(Base):
    __tablename__ = 'columns'

    id       = Column(Integer, primary_key=True) 
    title    = Column(String)
    position = Column(Integer)

    tasks   = relationship(Tasks, backref='columns', order_by=Tasks.position)