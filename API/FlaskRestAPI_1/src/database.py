from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import string
import random
db = SQLAlchemy()

class User(db.Model):
    ## 정수 Int타입, User테이블의 기본키.
    id = db.Column(db.Integer, primary_key=True)

    """
    문자열이고 최대 80자까지, 
    unique는 두 명의 사용자가 동일한 사용자 이름을 가질 수 없다. 
        만약 중복된 값이 들어온다면 'SQL Error: 23505, 1062 Duplicate entry 'John Doe' for key 'name''이런 에러를 리턴한다.
    nullable옵션은 데이터가 null이 들어갈 수 있다.
    """
    username = db.Column(db.String(80), unique=True, nullable=False) 
    email = db.Column(db.String(120), unique=True, nullable=False)

    ## Text()는 텍스트필드이고, 길이가 얼마든지 될 수있다.
    password = db.Column(db.Text(), nullable=False)

    
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
    
    def __repr__(self) -> str:
        return 'User>>> {self.username}'
    
class Bookmark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=True)
    url = db.Column(db.Text, nullable=False)
    short_url = db.Column(db.String(3), nullable=True)
    visits = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())