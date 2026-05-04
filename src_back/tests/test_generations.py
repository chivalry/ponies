import json


def _make_generation(client, name="G4"):
    r = client.post(
        "/api/generations/",
        data=json.dumps({"name": name}),
        content_type="application/json",
    )
    return r.get_json()["id"]


def _make_pony(client, name="Twilight", generation_id=None):
    data = {"name": name}
    if generation_id is not None:
        data["generation_id"] = generation_id
    r = client.post(
        "/api/ponies/",
        data=data,
        content_type="multipart/form-data",
    )
    return r.get_json()["id"]


def test_list_generations_empty(client):
    r = client.get("/api/generations/")
    assert r.status_code == 200
    assert r.get_json() == []


def test_create_generation(client):
    r = client.post(
        "/api/generations/",
        data=json.dumps({"name": "G4"}),
        content_type="application/json",
    )
    assert r.status_code == 201
    body = r.get_json()
    assert body["name"] == "G4"
    assert "id" in body


def test_create_generation_missing_name(client):
    r = client.post(
        "/api/generations/",
        data=json.dumps({}),
        content_type="application/json",
    )
    assert r.status_code == 400


def test_get_generation(client):
    gid = _make_generation(client, "G1")
    r = client.get(f"/api/generations/{gid}/")
    assert r.status_code == 200
    assert r.get_json()["name"] == "G1"


def test_get_generation_not_found(client):
    r = client.get("/api/generations/999/")
    assert r.status_code == 404


def test_update_generation(client):
    gid = _make_generation(client, "G3")
    r = client.put(
        f"/api/generations/{gid}/",
        data=json.dumps({"name": "Generation 3"}),
        content_type="application/json",
    )
    assert r.status_code == 200
    assert r.get_json()["name"] == "Generation 3"


def test_update_generation_not_found(client):
    r = client.put(
        "/api/generations/999/",
        data=json.dumps({"name": "X"}),
        content_type="application/json",
    )
    assert r.status_code == 404


def test_delete_generation(client):
    gid = _make_generation(client)
    r = client.delete(f"/api/generations/{gid}/")
    assert r.status_code == 204
    r2 = client.get(f"/api/generations/{gid}/")
    assert r2.status_code == 404


def test_delete_generation_not_found(client):
    r = client.delete("/api/generations/999/")
    assert r.status_code == 404


def test_list_generation_ponies(client):
    gid = _make_generation(client)
    _make_pony(client, "Applejack", generation_id=gid)
    r = client.get(f"/api/generations/{gid}/ponies/")
    assert r.status_code == 200
    ponies = r.get_json()
    assert len(ponies) == 1
    assert ponies[0]["name"] == "Applejack"


def test_list_generation_ponies_not_found(client):
    r = client.get("/api/generations/999/ponies/")
    assert r.status_code == 404


def test_delete_generation_nulls_pony_generation(client):
    gid = _make_generation(client)
    pid = _make_pony(client, "Rarity", generation_id=gid)
    client.delete(f"/api/generations/{gid}/")
    r = client.get(f"/api/ponies/{pid}/")
    assert r.status_code == 200
    assert r.get_json()["generation_id"] is None
