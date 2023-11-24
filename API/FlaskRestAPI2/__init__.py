##flask는 기본적으로 5000번 포트를 사용함.
from flask import Flask, jsonify, request

app = Flask(__name__)

# 예시 데이터
tasks = [
    {
        'id': 1,
        'title': 'Task 1',
        'description': 'This is task 1',
        'done': False
    },
    {
        'id': 2,
        'title': 'Task 2',
        'description': 'This is task 2',
        'done': False
    }
]

# 모든 작업 목록 반환
@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

# 특정 작업 반환
@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = [task for task in tasks if task['id'] == task_id]
    if len(task) == 0:
        return jsonify({'error': 'Task not found'})
    return jsonify({'task': task[0]})

# 새 작업 생성
@app.route('/tasks', methods=['POST'])
def create_task():
    if not request.json or 'title' not in request.json:
        return jsonify({'error': 'The title field is required'})

    task = {
        'id': tasks[-1]['id'] + 1,
        'title': request.json['title'],
        'description': request.json.get('description', ''),
        'done': False
    }
    tasks.append(task)
    return jsonify({'task': task}), 201

# 작업 업데이트
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = [task for task in tasks if task['id'] == task_id]
    if len(task) == 0:
        return jsonify({'error': 'Task not found'})

    if not request.json:
        return jsonify({'error': 'No data provided'})

    task[0]['title'] = request.json.get('title', task[0]['title'])
    task[0]['description'] = request.json.get('description', task[0]['description'])
    task[0]['done'] = request.json.get('done', task[0]['done'])
    return jsonify({'task': task[0]})

# 작업 삭제
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = [task for task in tasks if task['id'] == task_id]
    if len(task) == 0:
        return jsonify({'error': 'Task not found'})

    tasks.remove(task[0])
    return jsonify({'result': True})

if __name__ == '__main__':
    app.run(debug=True)
출처: https://blog.pages.kr/2727 [pages.kr 날으는물고기 <º))))><:티스토리]