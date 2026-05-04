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


def _make_hobby(client, name="Reading"):
    r = client.post(
        "/api/hobbies/",
        data=json.dumps({"name": name}),
        content_type="application/json",
    )
    return r.get_json()["id"]


def _make_friendship_hobby(client, friendship_id, hobby_id):
    r = client.post(
        "/api/friendship_hobbies/",
        data=json.dumps({"friendship_id": friendship_id, "hobby_id": hobby_id}),
        content_type="application/json",
    )
    return r.get_json()["id"]


def test_list_friendship_hobbies_empty(client):
    r = client.get("/api/friendship_hobbies/")
    assert r.status_code == 200
    assert r.get_json() == []


def test_create_friendship_hobby(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    hid = _make_hobby(client)
    r = client.post(
        "/api/friendship_hobbies/",
        data=json.dumps({"friendship_id": fid, "hobby_id": hid}),
        content_type="application/json",
    )
    assert r.status_code == 201
    body = r.get_json()
    assert body["friendship_id"] == fid
    assert body["hobby_id"] == hid


def test_create_friendship_hobby_duplicate(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    hid = _make_hobby(client)
    client.post(
        "/api/friendship_hobbies/",
        data=json.dumps({"friendship_id": fid, "hobby_id": hid}),
        content_type="application/json",
    )
    r = client.post(
        "/api/friendship_hobbies/",
        data=json.dumps({"friendship_id": fid, "hobby_id": hid}),
        content_type="application/json",
    )
    assert r.status_code == 409


def test_create_friendship_hobby_missing_friendship_id(client):
    hid = _make_hobby(client)
    r = client.post(
        "/api/friendship_hobbies/",
        data=json.dumps({"hobby_id": hid}),
        content_type="application/json",
    )
    assert r.status_code == 400


def test_create_friendship_hobby_missing_hobby_id(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    r = client.post(
        "/api/friendship_hobbies/",
        data=json.dumps({"friendship_id": fid}),
        content_type="application/json",
    )
    assert r.status_code == 400


def test_create_friendship_hobby_friendship_not_found(client):
    hid = _make_hobby(client)
    r = client.post(
        "/api/friendship_hobbies/",
        data=json.dumps({"friendship_id": 999, "hobby_id": hid}),
        content_type="application/json",
    )
    assert r.status_code == 404


def test_create_friendship_hobby_hobby_not_found(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    r = client.post(
        "/api/friendship_hobbies/",
        data=json.dumps({"friendship_id": fid, "hobby_id": 999}),
        content_type="application/json",
    )
    assert r.status_code == 404


def test_get_friendship_hobby(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    hid = _make_hobby(client)
    fhid = _make_friendship_hobby(client, fid, hid)
    r = client.get(f"/api/friendship_hobbies/{fhid}/")
    assert r.status_code == 200
    body = r.get_json()
    assert body["friendship_id"] == fid
    assert body["hobby_id"] == hid


def test_get_friendship_hobby_not_found(client):
    r = client.get("/api/friendship_hobbies/999/")
    assert r.status_code == 404


def test_update_friendship_hobby(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    hid1 = _make_hobby(client, "Reading")
    hid2 = _make_hobby(client, "Flying")
    fhid = _make_friendship_hobby(client, fid, hid1)
    r = client.put(
        f"/api/friendship_hobbies/{fhid}/",
        data=json.dumps({"hobby_id": hid2}),
        content_type="application/json",
    )
    assert r.status_code == 200
    assert r.get_json()["hobby_id"] == hid2


def test_update_friendship_hobby_not_found(client):
    r = client.put(
        "/api/friendship_hobbies/999/",
        data=json.dumps({"hobby_id": 1}),
        content_type="application/json",
    )
    assert r.status_code == 404


def test_update_friendship_hobby_bad_hobby(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    hid = _make_hobby(client)
    fhid = _make_friendship_hobby(client, fid, hid)
    r = client.put(
        f"/api/friendship_hobbies/{fhid}/",
        data=json.dumps({"hobby_id": 999}),
        content_type="application/json",
    )
    assert r.status_code == 404


def test_delete_friendship_hobby(client):
    p1 = _make_pony(client, "Twilight")
    p2 = _make_pony(client, "Spike")
    fid = _make_friendship(client, p1, p2)
    hid = _make_hobby(client)
    fhid = _make_friendship_hobby(client, fid, hid)
    r = client.delete(f"/api/friendship_hobbies/{fhid}/")
    assert r.status_code == 204


def test_delete_friendship_hobby_not_found(client):
    r = client.delete("/api/friendship_hobbies/999/")
    assert r.status_code == 404
