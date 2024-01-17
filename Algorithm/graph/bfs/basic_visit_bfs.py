from collections import deque

# BFS 메서드 정의 ( 방문처리 )
def basic_visit_bfs(graph, start, visited):
    # Queue 구현을 위해 deque 라이브러리 사용
    queue = deque([start])

    # 현재 노드를 방문 처리
    visited[start] = True

    # 큐가 빌 때까지 반복
    while queue:
        # 큐에서 하나의 원소를 뽑아 출력하기
        v = queue.popleft()
        print(v, end=' ')

        # 아직 방문하지 ㅏㅇㄴㅎ은 인접한 원소들을 큐에 삽입
        for i in graph[v]:
            if not visited[i]:
                queue.append(i)
                visited[i] = True