import json


def _make_pony(client, name="Twilight"):
    r = client.post(
        "/api/ponies/",
        data={"name": name},
        content_type="multipart/form-data",
    )
    return r.get_json()["id"]


def _make_friendship(client, p1, p2):
    r = client.post(
        "/api/friendships/",
        data=json.dumps({"pony_ids": [p1, p2]}),
        content_type="application/json",
    )
    return r.get_json()["id"]


def test_list_pony_friendships_empty(client):
    r = client.get("/api/pony_friendships/")
    assert r.status_code == 200
    assert r.get_json() == []


def test_create_pony_friendship(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    p3 = _make_pony(client, "Rarity")
    r = client.post(
        "/api/pony_friendships/",
        data=json.dumps({"friendship_id": fid, "pony_id": p3}),
        content_type="application/json",
    )
    assert r.status_code == 201
    body = r.get_json()
    assert body["friendship_id"] == fid
    assert body["pony_id"] == p3


def test_create_pony_friendship_missing_friendship_id(client):
    p1 = _make_pony(client)
    r = client.post(
        "/api/pony_friendships/",
        data=json.dumps({"pony_id": p1}),
        content_type="application/json",
    )
    assert r.status_code == 400


def test_create_pony_friendship_missing_pony_id(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    r = client.post(
        "/api/pony_friendships/",
        data=json.dumps({"friendship_id": fid}),
        content_type="application/json",
    )
    assert r.status_code == 400


def test_create_pony_friendship_friendship_not_found(client):
    p1 = _make_pony(client)
    r = client.post(
        "/api/pony_friendships/",
        data=json.dumps({"friendship_id": 999, "pony_id": p1}),
        content_type="application/json",
    )
    assert r.status_code == 404


def test_create_pony_friendship_pony_not_found(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    r = client.post(
        "/api/pony_friendships/",
        data=json.dumps({"friendship_id": fid, "pony_id": 999}),
        content_type="application/json",
    )
    assert r.status_code == 404


def test_delete_pony_friendship(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    _make_friendship(client, p1, p2)
    pfs = client.get("/api/pony_friendships/").get_json()
    pfid = pfs[0]["id"]
    r = client.delete(f"/api/pony_friendships/{pfid}/")
    assert r.status_code == 204


def test_delete_pony_friendship_not_found(client):
    r = client.delete("/api/pony_friendships/999/")
    assert r.status_code == 404
