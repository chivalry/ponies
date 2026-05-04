import json


def _make_hobby(client, name="Reading"):
    r = client.post(
        "/api/hobbies/",
        data=json.dumps({"name": name}),
        content_type="application/json",
    )
    return r.get_json()["id"]


def test_get_hobby(client):
    hid = _make_hobby(client, "Flying")
    r = client.get(f"/api/hobbies/{hid}/")
    assert r.status_code == 200
    assert r.get_json()["name"] == "Flying"


def test_get_hobby_not_found(client):
    r = client.get("/api/hobbies/999/")
    assert r.status_code == 404


def test_update_hobby(client):
    hid = _make_hobby(client, "Singing")
    r = client.put(
        f"/api/hobbies/{hid}/",
        data=json.dumps({"name": "Dancing"}),
        content_type="application/json",
    )
    assert r.status_code == 200
    assert r.get_json()["name"] == "Dancing"


def test_update_hobby_not_found(client):
    r = client.put(
        "/api/hobbies/999/",
        data=json.dumps({"name": "X"}),
        content_type="application/json",
    )
    assert r.status_code == 404


def test_create_hobby_missing_name(client):
    r = client.post(
        "/api/hobbies/",
        data=json.dumps({}),
        content_type="application/json",
    )
    assert r.status_code == 400
