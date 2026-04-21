import json


def _make_pony(client, name="Twilight"):
    r = client.post(
        "/api/ponies/",
        data={"name": name},
        content_type="multipart/form-data",
    )
    return r.get_json()["id"]


def _make_hobby(client, name="Reading"):
    r = client.post(
        "/api/hobbies/",
        data=json.dumps({"name": name}),
        content_type="application/json",
    )
    return r.get_json()["id"]


def test_create_hobby(client):
    r = client.post(
        "/api/hobbies/",
        data=json.dumps({"name": "Reading"}),
        content_type="application/json",
    )
    assert r.status_code == 201
    assert r.get_json()["name"] == "Reading"
    assert "pony_id" not in r.get_json()


def test_list_hobbies(client):
    _make_hobby(client, "Magic")
    r = client.get("/api/hobbies/")
    assert r.status_code == 200
    assert len(r.get_json()) == 1


def test_delete_hobby(client):
    hid = _make_hobby(client, "Flying")
    r = client.delete(f"/api/hobbies/{hid}/")
    assert r.status_code == 204


def test_assign_hobby_to_pony(client):
    pid = _make_pony(client)
    hid = _make_hobby(client)
    r = client.post(
        "/api/pony_hobbies/",
        data=json.dumps({"pony_id": pid, "hobby_id": hid}),
        content_type="application/json",
    )
    assert r.status_code == 201
    body = r.get_json()
    assert body["pony_id"] == pid
    assert body["hobby_id"] == hid


def test_duplicate_assignment_rejected(client):
    pid = _make_pony(client)
    hid = _make_hobby(client)
    client.post(
        "/api/pony_hobbies/",
        data=json.dumps({"pony_id": pid, "hobby_id": hid}),
        content_type="application/json",
    )
    r = client.post(
        "/api/pony_hobbies/",
        data=json.dumps({"pony_id": pid, "hobby_id": hid}),
        content_type="application/json",
    )
    assert r.status_code == 409


def test_get_pony_hobbies(client):
    pid = _make_pony(client)
    hid = _make_hobby(client)
    client.post(
        "/api/pony_hobbies/",
        data=json.dumps({"pony_id": pid, "hobby_id": hid}),
        content_type="application/json",
    )
    r = client.get(f"/api/ponies/{pid}/hobbies/")
    assert r.status_code == 200
    hobbies = r.get_json()
    assert len(hobbies) == 1
    assert hobbies[0]["id"] == hid
