import json


def test_list_ponies_empty(client):
    r = client.get("/api/ponies/")
    assert r.status_code == 200
    assert r.get_json() == []


def test_create_pony(client):
    r = client.post(
        "/api/ponies/",
        data={"name": "Rainbow Dash"},
        content_type="multipart/form-data",
    )
    assert r.status_code == 201
    data = r.get_json()
    assert data["name"] == "Rainbow Dash"
    assert "id" in data


def test_get_pony(client):
    cr = client.post(
        "/api/ponies/",
        data={"name": "Fluttershy"},
        content_type="multipart/form-data",
    )
    pid = cr.get_json()["id"]
    r = client.get(f"/api/ponies/{pid}/")
    assert r.status_code == 200
    assert r.get_json()["name"] == "Fluttershy"


def test_get_pony_not_found(client):
    r = client.get("/api/ponies/999/")
    assert r.status_code == 404


def test_update_pony(client):
    cr = client.post(
        "/api/ponies/",
        data={"name": "Pinkie Pie"},
        content_type="multipart/form-data",
    )
    pid = cr.get_json()["id"]
    r = client.put(
        f"/api/ponies/{pid}/",
        data=json.dumps({"name": "Pinkie Pie Updated"}),
        content_type="application/json",
    )
    assert r.status_code == 200
    assert r.get_json()["name"] == "Pinkie Pie Updated"


def test_delete_pony(client):
    cr = client.post(
        "/api/ponies/",
        data={"name": "Rarity"},
        content_type="multipart/form-data",
    )
    pid = cr.get_json()["id"]
    r = client.delete(f"/api/ponies/{pid}/")
    assert r.status_code == 204
    r2 = client.get(f"/api/ponies/{pid}/")
    assert r2.status_code == 404
