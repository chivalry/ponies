import json


def _make_pony(client, name="Twilight"):
    r = client.post(
        "/api/ponies/",
        data={"name": name},
        content_type="multipart/form-data",
    )
    return r.get_json()["id"]


def test_create_hobby(client):
    pid = _make_pony(client)
    r = client.post(
        "/api/hobbies/",
        data=json.dumps({"name": "Reading", "pony_id": pid}),
        content_type="application/json",
    )
    assert r.status_code == 201
    assert r.get_json()["name"] == "Reading"


def test_list_hobbies(client):
    pid = _make_pony(client)
    client.post(
        "/api/hobbies/",
        data=json.dumps({"name": "Magic", "pony_id": pid}),
        content_type="application/json",
    )
    r = client.get("/api/hobbies/")
    assert r.status_code == 200
    assert len(r.get_json()) == 1


def test_delete_hobby(client):
    pid = _make_pony(client)
    client.post(
        "/api/hobbies/",
        data=json.dumps({"name": "Flying", "pony_id": pid}),
        content_type="application/json",
    )
    r = client.delete("/api/hobbies/1/")
    assert r.status_code == 204
