import json


def test_list_ponies_empty(client):
    r = client.get('/api/ponies/')
    assert r.status_code == 200
    assert r.get_json() == []


def test_create_pony(client):
    r = client.post(
        '/api/ponies/',
        data={'name': 'Rainbow Dash'},
        content_type='multipart/form-data',
    )
    assert r.status_code == 201
    data = r.get_json()
    assert data['name'] == 'Rainbow Dash'
    assert data['id'] == 1


def test_get_pony(client):
    client.post(
        '/api/ponies/',
        data={'name': 'Fluttershy'},
        content_type='multipart/form-data',
    )
    r = client.get('/api/ponies/1/')
    assert r.status_code == 200
    assert r.get_json()['name'] == 'Fluttershy'


def test_get_pony_not_found(client):
    r = client.get('/api/ponies/999/')
    assert r.status_code == 404


def test_update_pony(client):
    client.post(
        '/api/ponies/',
        data={'name': 'Pinkie Pie'},
        content_type='multipart/form-data',
    )
    r = client.put(
        '/api/ponies/1/',
        data=json.dumps({'name': 'Pinkie Pie Updated'}),
        content_type='application/json',
    )
    assert r.status_code == 200
    assert r.get_json()['name'] == 'Pinkie Pie Updated'


def test_delete_pony(client):
    client.post(
        '/api/ponies/',
        data={'name': 'Rarity'},
        content_type='multipart/form-data',
    )
    r = client.delete('/api/ponies/1/')
    assert r.status_code == 204
    r2 = client.get('/api/ponies/1/')
    assert r2.status_code == 404
