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

    """
    default는 최초 데이터 삽입시에만 적용된다. 허나 필드에 값이 없을떄만 datetime.now를 호출하며 다른 값을 넣으면 그 값으로 넣어줌.
    onupdate는 최초 데이터 삽입시 + 이후 데이터가 수정되는 경우 매번 호춣되어서 현재 시간을 insert한다.
    """
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
    
    """
    Bookmark의 클래스의 인스턴스는 User클래스의 인스턴스에 속한다.
    """
    bookmarks = db.relationship('Bookmark', backref="user")

  
    """
    repr은 represent의 줄임말
    코틀린의 toString으로 보면된다. 호출시 'User>>> username'으로 호출됨.
    """
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

    def generate_short_characters(self):
        characters = string.digits+string.ascii_letters
        picked_chars = ''.join(random.choices(characters, k=3))

        link = self.query.filter_by(short_url=picked_chars).first()

        if link:
            self.generate_short_characters()
        else:
            return picked_chars
            
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.short_url = self.generate_short_characters()

    
    def __repr__(self) -> str:
        return 'Boomark>>> {self.url}'
