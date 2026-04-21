import json


def _make_pony(client, name):
    r = client.post(
        '/api/ponies/',
        data={'name': name},
        content_type='multipart/form-data',
    )
    return r.get_json()['id']


def test_create_friendship(client):
    p1 = _make_pony(client, 'Applejack')
    p2 = _make_pony(client, 'Rainbow Dash')
    r = client.post(
        '/api/friendships/',
        data=json.dumps({'pony_ids': [p1, p2]}),
        content_type='application/json',
    )
    assert r.status_code == 201
    assert r.get_json()['id'] == 1


def test_create_friendship_wrong_count(client):
    p1 = _make_pony(client, 'Applejack')
    r = client.post(
        '/api/friendships/',
        data=json.dumps({'pony_ids': [p1]}),
        content_type='application/json',
    )
    assert r.status_code == 400


def test_delete_friendship(client):
    p1 = _make_pony(client, 'Fluttershy')
    p2 = _make_pony(client, 'Rarity')
    client.post(
        '/api/friendships/',
        data=json.dumps({'pony_ids': [p1, p2]}),
        content_type='application/json',
    )
    r = client.delete('/api/friendships/1/')
    assert r.status_code == 204


def test_list_pony_friendships(client):
    p1 = _make_pony(client, 'Twilight')
    p2 = _make_pony(client, 'Spike')
    client.post(
        '/api/friendships/',
        data=json.dumps({'pony_ids': [p1, p2]}),
        content_type='application/json',
    )
    r = client.get('/api/pony_friendships/')
    assert r.status_code == 200
    assert len(r.get_json()) == 2
