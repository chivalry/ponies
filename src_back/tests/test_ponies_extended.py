import json


def _make_pony(client, name="Twilight", generation_id=None):
    data = {"name": name}
    if generation_id is not None:
        data["generation_id"] = str(generation_id)
    r = client.post(
        "/api/ponies/",
        data=data,
        content_type="multipart/form-data",
    )
    return r.get_json()["id"]


def _make_generation(client, name="G4"):
    r = client.post(
        "/api/generations/",
        data=json.dumps({"name": name}),
        content_type="application/json",
    )
    return r.get_json()["id"]


def test_create_pony_missing_name(client):
    r = client.post(
        "/api/ponies/",
        data={},
        content_type="multipart/form-data",
    )
    assert r.status_code == 400


def test_create_pony_with_generation(client):
    gid = _make_generation(client)
    r = client.post(
        "/api/ponies/",
        data={"name": "Starlight", "generation_id": str(gid)},
        content_type="multipart/form-data",
    )
    assert r.status_code == 201
    assert r.get_json()["generation_id"] == gid


def test_list_ponies_sorted_by_name_asc(client):
    _make_pony(client, "Zecora")
    _make_pony(client, "Applebloom")
    r = client.get("/api/ponies/?sort=name_asc")
    assert r.status_code == 200
    names = [p["name"] for p in r.get_json()]
    assert names == sorted(names)
