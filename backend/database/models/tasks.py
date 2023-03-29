from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import Column, Integer, String, ForeignKey

try:
    from databases import Base
except:
    from ..databases import Base
    
class Tasks(Base):
    __tablename__ = 'tasks'

    id       = Column(Integer, primary_key=True) 
    title    = Column(String)
    position = Column(Integer)
    desc     = Column(String)

    column  = mapped_column(ForeignKey('columns.id'))
 