import json


def _make_pony(client, name="Applejack"):
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


def _make_hobby(client, name="Reading"):
    r = client.post(
        "/api/hobbies/",
        data=json.dumps({"name": name}),
        content_type="application/json",
    )
    return r.get_json()["id"]


def test_list_friendships(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    _make_friendship(client, p1, p2)
    r = client.get("/api/friendships/")
    assert r.status_code == 200
    assert len(r.get_json()) == 1


def test_get_friendship(client):
    p1 = _make_pony(client, "Rarity")
    p2 = _make_pony(client, "Fluttershy")
    fid = _make_friendship(client, p1, p2)
    r = client.get(f"/api/friendships/{fid}/")
    assert r.status_code == 200
    assert r.get_json()["id"] == fid


def test_get_friendship_not_found(client):
    r = client.get("/api/friendships/999/")
    assert r.status_code == 404


def test_update_friendship_returns_405(client):
    p1 = _make_pony(client, "Pinkie")
    p2 = _make_pony(client, "Rainbow")
    fid = _make_friendship(client, p1, p2)
    r = client.put(
        f"/api/friendships/{fid}/",
        data=json.dumps({}),
        content_type="application/json",
    )
    assert r.status_code == 405


def test_delete_friendship_not_found(client):
    r = client.delete("/api/friendships/999/")
    assert r.status_code == 404


def test_create_friendship_pony_not_found(client):
    p1 = _make_pony(client, "Applejack")
    r = client.post(
        "/api/friendships/",
        data=json.dumps({"pony_ids": [p1, 999]}),
        content_type="application/json",
    )
    assert r.status_code == 404


def test_assign_hobby_to_friendship(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    hid = _make_hobby(client)
    r = client.post(
        f"/api/friendships/{fid}/hobbies/",
        data=json.dumps({"hobby_id": hid}),
        content_type="application/json",
    )
    assert r.status_code == 201
    body = r.get_json()
    assert body["friendship_id"] == fid
    assert body["hobby_id"] == hid


def test_assign_hobby_to_friendship_not_found(client):
    hid = _make_hobby(client)
    r = client.post(
        "/api/friendships/999/hobbies/",
        data=json.dumps({"hobby_id": hid}),
        content_type="application/json",
    )
    assert r.status_code == 404


def test_assign_hobby_missing_hobby_id(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    r = client.post(
        f"/api/friendships/{fid}/hobbies/",
        data=json.dumps({}),
        content_type="application/json",
    )
    assert r.status_code == 400


def test_assign_hobby_nonexistent_hobby(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    r = client.post(
        f"/api/friendships/{fid}/hobbies/",
        data=json.dumps({"hobby_id": 999}),
        content_type="application/json",
    )
    assert r.status_code == 404
